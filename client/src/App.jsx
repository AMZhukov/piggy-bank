import React from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './theme';
import { GlobalStyles } from './global';

import './App.css';
import { Total } from './Components/Total/Total';
import { History } from './Components/History/History';
import { Operation } from './Components/Operation/Operation';
import { LightBubbleToggle } from './Components/Light-bubble-toggle/LightBubbleToggle';

import {
  changeAmount, changeDate,
  changeDescription,
  changeIsIncome,
  changeMonth, createTransaction, deleteTransaction,
  requestTransactionsHistory,
} from './redux/piggyBank/piggyBankActions';

import { changeTheme } from './redux/changeTheme/themeActions.js';

class App extends React.Component {

  createTransaction = async (event) => {
    try {
      event.preventDefault();
      await this.props.createTransaction();
      event.target.reset();
    } catch (error) {
      console.warn('Error', error.message);
    }
  };

  componentDidMount() {
    this.props.requestTransactionsHistory();
  }

  render() {
    return (
      <ThemeProvider theme={this.props.theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        <section>
          <header>
            <h1>Кошелёк</h1>
            <h2>Калькулятор расходов</h2>
            <LightBubbleToggle changeTheme={this.props.changeTheme} />
          </header>
          <main>
            <div className="container">
              <Total
                changeMonth={this.props.changeMonth}
                currentMonth={this.props.currentMonth}
                income={this.props.sumIncome}
                expenses={this.props.sumExpenses}
                totalMoney={this.props.totalMoney}
              />
              <Operation
                createTransaction={this.createTransaction}
                changeAmount={this.props.changeAmount}
                changeDescription={this.props.changeDescription}
                changeDate={this.props.changeDate}
                changeIsIncome={this.props.changeIsIncome}
                date={this.props.date}
              />
              <History
                currentMonth={this.props.currentMonth}
                transactions={this.props.transactionsCurrentMonth}
                deleteTransaction={this.props.deleteTransaction}
                currentTimezone={this.props.currentTimezone}
              />
            </div>
          </main>
        </section>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (store) => ({
  amount: store.piggyBank.amount,
  currentMonth: store.piggyBank.currentMonth,
  currentTimezone: store.piggyBank.currentTimezone,
  date: store.piggyBank.date,
  description: store.piggyBank.description,
  isIncome: store.piggyBank.isIncome,
  transactionsCurrentMonth: store.piggyBank.transactionsCurrentMonth,
  sumExpenses: store.piggyBank.sumExpenses,
  sumIncome: store.piggyBank.sumIncome,
  totalMoney: store.piggyBank.totalMoney,

  theme: store.theme.value,
});

const mapDispatchToProps = {
  changeAmount,
  changeDate,
  changeDescription,
  changeIsIncome,
  changeMonth,
  createTransaction,
  deleteTransaction,
  requestTransactionsHistory,

  changeTheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
