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

const initialState = {
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

export const piggyBankReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TRANSACTION_IN_STORE:
      console.log(action.payload);
      return {
        ...state,
        transactions: [...state.transactions, ...action.payload.transactions],
        wereDataRequests: [...state.wereDataRequests, action.payload.wereDataRequests],
      };
    case CHANGE_AMOUNT:
      return { ...state, amount: action.payload };
    case CHANGE_DATE:
      return {
        ...state,
        date: action.payload.date,
        currentMonth: action.payload.currentMonth,
        currentYear: action.payload.currentYear,
      };
    case CHANGE_DESCRIPTION:
      return { ...state, description: action.payload };
    case CHANGE_IS_INCOME:
      return { ...state, isIncome: action.payload };
    case CHANGE_MONTH:
      return {
        ...state,
        date: new Date(action.payload.date),
        currentMonth: action.payload.currentMonth,
        currentYear: action.payload.currentYear,
      };
    case CREATE_TRANSACTION:
      return { ...state, transactions: [...state.transactions, action.payload.response] };
    case DELETE_TRANSACTION:
      return { ...state, transactions: action.payload };
    case GET_TRANSACTION_CURRENT_MONTH:
      return {
        ...state,
        transactionsCurrentMonth: action.payload.transactionsCurrentMonth,
      };
    case SUM_EXPENSES_INCOME:
      return {
        ...state,
        sumExpenses: action.payload.sumExpenses,
        sumIncome: action.payload.sumIncome,
      };
    case TOTAL_MONEY:
      return {
        ...state,
        totalMoney: action.payload.totalMoney,
      };
    default:
      return state;
  }
};
