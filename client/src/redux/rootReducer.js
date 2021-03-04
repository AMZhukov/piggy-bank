import { combineReducers } from 'redux';
import { themeReducer } from './changeTheme/themeReducer';
import { piggyBankReducer } from './piggyBank/piggyBankReducer';

export const rootReducer = combineReducers({
  theme: themeReducer,
  piggyBank: piggyBankReducer,
});
