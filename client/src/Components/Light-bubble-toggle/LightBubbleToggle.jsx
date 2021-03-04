import React from 'react';
import './LightBubbleToggle.css';

export const LightBubbleToggle = ({ changeTheme }) => {
  return (
    <input
      className={'light-bubl-toggle'}
      type={'checkbox'}
      defaultChecked
      onChange={changeTheme}
    />
  );
};
