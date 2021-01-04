import React from 'react';
import './App.css';
import { Total } from './Components/Total/Total';
import { History } from './Components/History/History';
import { Operation } from './Components/Operation/Operation';

class App extends React.Component {
  state = {
    transactions: [],
    description: '',
    amount: '',
    isIncome: false,
    sumIncome: 0,
    sumExpenses: 0,
    totalMoney: 0,
    date: new Date(),
    currentTimezone: new Date().getTimezoneOffset(),
  };

  async request(url, method = 'GET', data = null) {
    try {
      const headers = {};
      let body = null;
      if (data) {
        body = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
      }
      const fetched = await fetch(url, { method, headers, body });
      return fetched.json();
    } catch (error) {
      console.warn('Error', error.message);
    }
  }

  addTransaction = async (event) => {
    try {
      event.preventDefault();

      const transaction = {
        description: this.state.description,
        amount: this.state.amount,
        isIncome: this.state.isIncome,
        date: this.state.date,
        _id: null,
      };
      const response = await this.request('/api/addTransaction', 'POST', transaction);
      event.target.reset();

      this.setState({ transactions: [...this.state.transactions, response] }, () =>
        this.calculateIncomeExpenses(),
      );
    } catch (error) {
      console.warn('Error', error.message);
    }
  };

  addAmount = (event) => {
    const amount = event.target.value > 0 ? +event.target.value : -1 * event.target.value;
    this.setState({ amount });
  };

  addDescription = (event) => {
    this.setState({ description: event.target.value });
  };

  addDate = (event) => {
    const date = event.target.value;

    if (this.checkData(date, 'date')) {
      const date = new Date(`${event.target.value}`);
      this.setState({ date });
    }
  };

  checkData = (data, type) => {
    console.log(data);
    switch (type) {
      case 'date': {
        console.log('20-20'.match(/([1-2][0-9])-([1-2][0-9])/));
        console.log('23'.match(/[0][1-9]|[1,2][0-9]|[3][0,1]/g));
        // console.log(data.match(/\d{4}-[0-2]\d-([0][1-9]|[1,2][0-9]|[3],[0,1]\)/))
        return data.toString().match(/\d{4}-[0-2]\d-[0][1-9]|[1,2][0-9]|[3][0,1]/);
      }
      default:
        return null;
    }
  };

  // This function need for change status new transaction income or expenses
  changeIsIncome = (isIncome) => {
    this.setState({ isIncome });
  };

  // This function execute calculating all transaction income either expenses
  calculateIncomeExpenses = () => {
    let sumIncome = 0;
    let sumExpenses = 0;
    if (this.state.transactions[0]) {
      this.state.transactions.forEach((item) => {
        if (item.isIncome) sumIncome += item.amount;
        else sumExpenses += item.amount;
      });
    }
    this.setState({ sumExpenses, sumIncome }, () => this.calculateTotalMoney());
  };

  calculateTotalMoney = () => {
    this.setState({ totalMoney: this.state.sumIncome - this.state.sumExpenses });
  };

  deleteTransaction = async (id) => {
    const transactions = [...this.state.transactions];
    let transaction;
    for (let index = 0; index < transactions.length; index++) {
      if (transactions[index]._id === id) {
        transaction = transactions[index];
        transactions.splice(index, 1);
        break;
      }
    }
    try {
      const deleteTransactionFromDB = await this.request(
        '/api/deleteTransaction',
        'DELETE',
        transaction,
      );
      if (deleteTransactionFromDB) {
        this.setState({ transactions }, () => this.calculateIncomeExpenses());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  requestTransactionsHistory = async () => {
    try {
      console.log(this.state.currentTimezone);
      const date = {
        currentMonth: this.state.date.getMonth(),
        currentYear: this.state.date.getFullYear(),
        // currentTimeZone — for the correct time to query the transaction data because there are different time zones
        currentTimezone: this.state.currentTimezone,
      };
      const transactions = await this.request('/api/transactionsHistory', 'POST', date);
      if (transactions) {
        this.setState({ transactions }, () => this.calculateIncomeExpenses());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {
    this.requestTransactionsHistory();
  }

  render() {
    return (
      <React.Fragment>
        <header>
          <h1>Кошелёк</h1>
          <h2>Калькулятор расходов</h2>
        </header>
        <main>
          <div className="container">
            <Total
              income={this.state.sumIncome}
              expenses={this.state.sumExpenses}
              totalMoney={this.state.totalMoney}
            />
            <Operation
              addTransaction={this.addTransaction}
              addAmount={this.addAmount}
              addDescription={this.addDescription}
              addDate={this.addDate}
              changeIsIncome={this.changeIsIncome}
              date={this.state.date}
            />
            <History
              transactions={this.state.transactions}
              deleteTransaction={this.deleteTransaction}
              currentTimezone={this.state.currentTimezone}
            />
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
