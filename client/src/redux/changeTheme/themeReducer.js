import { CHANGE_THEME } from './themeTypes.js';

const initialState = {
  value: 'dark',
};

export const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_THEME:
      return { ...state, value: action.payload };
    default:
      return state;
  }
};
