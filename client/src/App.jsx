import React from 'react';
import './App.css';
import { Total } from './Components/Total/Total';
import { History } from './Components/History/History';
import { Operation } from './Components/Operation/Operation';

class App extends React.Component {
  state = {
    transactions: [],
    transactionsCurrentMonth: [],
    description: '',
    amount: '',
    isIncome: false,
    sumIncome: 0,
    sumExpenses: 0,
    totalMoney: 0,
    date: new Date(),
    currentTimezone: new Date().getTimezoneOffset(),
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    wereDataRequests: [],
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

      response.date = new Date(response.date);
      if (!!this.checkWereDataRequests(response.date.getMonth(), response.date.getFullYear())) {
        this.setState({ transactions: [...this.state.transactions, response] }, () =>
          this.requestTransactionsHistory(),
        );
      }
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
      const currentMonth = date.getMonth();
      const currentYear = date.getFullYear();
      this.setState({ date, currentMonth, currentYear }, () => this.requestTransactionsHistory());
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

  changeMonth = (prevOrNext) => {
    const date = new Date(this.state.date);
    date.setMonth(date.getMonth() + prevOrNext);
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    this.setState({ date, currentMonth, currentYear }, () => this.requestTransactionsHistory());
  };

  // This function execute calculating all transaction income either expenses
  calculateIncomeExpenses = () => {
    let sumIncome = 0;
    let sumExpenses = 0;
    if (this.state.transactionsCurrentMonth[0]) {
      this.state.transactionsCurrentMonth.forEach((item) => {
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
    const prevTransactions = [...this.state.transactions];
    const deleteTransaction = prevTransactions.find((transaction) => transaction._id === id);
    const transactions = prevTransactions.filter((transaction) => transaction._id !== id);

    try {
      const deleteTransactionFromDB = await this.request(
        '/api/deleteTransaction',
        'DELETE',
        deleteTransaction,
      );
      if (deleteTransactionFromDB) {
        this.setState({ transactions }, () => this.requestTransactionsHistory());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  checkWereDataRequests = ({ currentMonth, currentYear }) =>
    this.state.wereDataRequests.find(
      (item) => item.currentMonth === currentMonth && item.currentYear === currentYear,
    );

  getTransactionCurrentMonth = () => {
    const transactionsCurrentMonth = [...this.state.transactions].filter(
      (transaction) =>
        transaction.date.getMonth() === this.state.currentMonth &&
        transaction.date.getFullYear() === this.state.currentYear,
    );
    this.setState({ transactionsCurrentMonth }, () => this.calculateIncomeExpenses());
  };

  requestTransactionsHistory = async () => {
    try {
      const date = {
        currentMonth: this.state.date.getMonth(),
        currentYear: this.state.date.getFullYear(),
        // currentTimeZone — for the correct time to query the transaction data because there are different time zones
        currentTimezone: this.state.currentTimezone,
      };
      if (!this.checkWereDataRequests(date)) {
        const transactions = await this.request('/api/transactionsHistory', 'POST', date);
        transactions.forEach((transaction) => (transaction.date = new Date(transaction.date)));
        if (transactions) {
          this.setState(
            {
              transactions: [...this.state.transactions, ...transactions],
              wereDataRequests: [...this.state.wereDataRequests, date],
              // transactions
            },
            () => this.getTransactionCurrentMonth(),
          );
        }
      } else this.getTransactionCurrentMonth();
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
              changeMonth={this.changeMonth}
              currentMonth={this.state.currentMonth}
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
              currentMonth={this.state.currentMonth}
              transactions={this.state.transactionsCurrentMonth}
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
