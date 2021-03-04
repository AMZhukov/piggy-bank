import { CHANGE_THEME } from './themeTypes';

export function changeTheme() {
  return (dispatch, getState) => {
    const newTheme = getState().theme.value === 'dark' ? 'light' : 'dark';
    dispatch({ type: CHANGE_THEME, payload: newTheme });
  };
}
