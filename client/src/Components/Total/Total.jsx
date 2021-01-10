import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';

const monthName = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const Total = ({ changeMonth, totalMoney, income, expenses, currentMonth }) => {
  return (
    <section className="total">
      <div className="total__month">
        <button className="total__button-arrow" type="button" onClick={() => changeMonth(-1)}>
          <i className="fas fa-angle-left" aria-hidden="true" />
        </button>
        {monthName[currentMonth]}
        <button className="total__button-arrow" type="button" onClick={() => changeMonth(1)}>
          <i className="fas fa-angle-right" aria-hidden="true" />
        </button>
      </div>
      <header className="total__header">
        <h3>Баланс</h3>
        <p className="total__balance">{totalMoney} &#8381;</p>
      </header>
      <div className="total__main">
        <div className="total__main-item total__income">
          <h4>Доходы</h4>
          <p className="total__money total__money-income">+{income} &#8381;</p>
        </div>
        <div className="total__main-item total__expenses">
          <h4>Расходы</h4>
          <p className="total__money total__money-expenses">-{expenses} &#8381;</p>
        </div>
      </div>
    </section>
  );
};
