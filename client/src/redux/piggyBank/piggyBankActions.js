import {
  ADD_TRANSACTION_IN_STORE,
  CHANGE_AMOUNT,
  CHANGE_DATE,
  CHANGE_DESCRIPTION,
  CHANGE_IS_INCOME,
  CHANGE_MONTH,
  CREATE_TRANSACTION,
  DELETE_TRANSACTION,
  GET_TRANSACTION_CURRENT_MONTH,
  SUM_EXPENSES_INCOME,
  TOTAL_MONEY,
} from './piggyBankTypes';

function getDateOfRequest(date, currentTimezone) {
  const newDate = new Date(date);
  return {
    currentMonth: newDate.getMonth(),
    currentYear: newDate.getFullYear(),
    // currentTimeZone — for the correct time to query the transaction data because there are different time zones
    currentTimezone: currentTimezone,
  };
}

export function changeDescription(newDescription) {
  return {
    type: CHANGE_DESCRIPTION,
    payload: newDescription,
  };
}

export function changeAmount(newAmount) {
  const amount = newAmount > 0 ? +newAmount : -1 * newAmount;
  return {
    type: CHANGE_AMOUNT,
    payload: amount,
  };
}

// This function need for change status new transaction income or expenses
export function changeIsIncome(isIncome) {
  return {
    type: CHANGE_IS_INCOME,
    payload: isIncome,
  };
}

// This function need for change month of form to entering transaction or view history transactions
export function changeMonth(prevOrNext) {
  return (dispatch, getState) => {
    const date = new Date(getState().piggyBank.date);
    date.setMonth(date.getMonth() + prevOrNext);
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    dispatch({ type: CHANGE_MONTH, payload: { date, currentMonth, currentYear } });
    dispatch(requestTransactionsHistory());
  };
}

function checkWereDataRequests({ currentMonth, currentYear }) {
  return (dispatch, getState) => {
    return getState().piggyBank.wereDataRequests.find(
      (item) => item.currentMonth === currentMonth && item.currentYear === currentYear,
    );
  };
}

async function request(url, method = 'GET', data = null) {
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

function addTransactionInStore(transactions, wereDataRequests) {
  return {
    type: ADD_TRANSACTION_IN_STORE,
    payload: { transactions, wereDataRequests },
  };
}

export function createTransaction() {
  return async (dispatch, getState) => {
    try {
      const currentState = getState().piggyBank;
      const transaction = {
        description: currentState.description,
        amount: currentState.amount,
        isIncome: currentState.isIncome,
        date: currentState.date,
        _id: null,
      };
      const response = await request('/api/createTransaction', 'POST', transaction);
      response.date = new Date(response.date);
      dispatch({ type: CREATE_TRANSACTION, payload: { response } });
      dispatch(getTransactionCurrentMonth());
    } catch (error) {
      console.warn('Error', error.message);
    }
  };
}

export function changeDate(newDate) {
  return async (dispatch, getState) => {
    try {
      const date = new Date(newDate);

      if (this.checkData(date, 'date')) {
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        dispatch({ type: CHANGE_DATE, payload: { date, currentMonth, currentYear } });
        dispatch(requestTransactionsHistory());
      }
    } catch (error) {
      console.warn('Error', error.message);
    }
  };
}

function checkData(data, type) {
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
}
export function deleteTransaction(id) {
  return async (dispatch, getState) => {
    const currentState = getState().piggyBank;
    const prevTransactions = [...currentState.transactions];
    const deleteTransaction = prevTransactions.find((transaction) => transaction._id === id);
    const transactions = prevTransactions.filter((transaction) => transaction._id !== id);
    try {
      const deleteTransactionFromDB = await request(
        '/api/deleteTransaction',
        'DELETE',
        deleteTransaction,
      );
      if (deleteTransactionFromDB) {
        dispatch({ type: DELETE_TRANSACTION, payload: transactions });
        dispatch(getTransactionCurrentMonth());
      }
    } catch (error) {
      console.warn('Error', error.message);
    }
  };
}

function getTransactionCurrentMonth() {
  return async (dispatch, getState) => {
    try {
      const currentState = getState().piggyBank;
      const transactionsCurrentMonth = [...currentState.transactions].filter(
        (transaction) =>
          transaction.date.getMonth() === currentState.currentMonth &&
          transaction.date.getFullYear() === currentState.currentYear,
      );
      dispatch({ type: GET_TRANSACTION_CURRENT_MONTH, payload: { transactionsCurrentMonth } });
      dispatch(calculateIncomeExpenses());
    } catch (error) {
      console.log(error.message);
    }
  };
}

export function requestTransactionsHistory() {
  return async (dispatch, getState) => {
    try {
      const date = getState().piggyBank.date;
      const currentTimezone = getState().piggyBank.currentTimezone;
      const dateOfRequest = getDateOfRequest(date, currentTimezone);
      // Here need rewrite this code for compliance with SOLID principle
      if (!dispatch(checkWereDataRequests(dateOfRequest))) {
        const transactions = await request('/api/transactionsHistory', 'POST', dateOfRequest);
        if (transactions) {
          transactions.forEach((transaction) => (transaction.date = new Date(transaction.date)));
          dispatch(addTransactionInStore(transactions, dateOfRequest));
        }
      }
      dispatch(getTransactionCurrentMonth());
    } catch (error) {
      console.log(error.message);
    }
  };
}

// This function execute calculating all transaction income either expenses
function calculateIncomeExpenses() {
  return (dispatch, getState) => {
    let sumIncome = 0;
    let sumExpenses = 0;
    const currentState = getState().piggyBank;
    if (currentState.transactionsCurrentMonth[0]) {
      currentState.transactionsCurrentMonth.forEach((item) => {
        if (item.isIncome) sumIncome += item.amount;
        else sumExpenses += item.amount;
      });
    }
    dispatch({ type: SUM_EXPENSES_INCOME, payload: { sumExpenses, sumIncome } });
    dispatch(calculateTotalMoney());
  };
}

function calculateTotalMoney() {
  return (dispatch, getState) => {
    const currentState = getState().piggyBank;
    const totalMoney = currentState.sumIncome - currentState.sumExpenses;
    dispatch({
      type: TOTAL_MONEY,
      payload: { totalMoney },
    });
  };
}
