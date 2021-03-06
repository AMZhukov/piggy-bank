import React from 'react';

export const HistoryItem = ({ transaction, deleteTransaction }) => {
  return (
    <li
      className={`history__item ${
        transaction.isIncome ? 'history__item_plus' : 'history__item_minus'
      }`}
    >
      <div className="history__description">{transaction.description}</div>
      <div className="history__date">{transaction.date.toLocaleDateString()}</div>
      <div className="history__money">
        <div>
          {transaction.isIncome ? '+' : '–'} {transaction.amount.toLocaleString()} &#8381;
        </div>
        <button className="history__delete" onClick={() => deleteTransaction(transaction._id)}>
          <div>X</div>
        </button>
      </div>
    </li>
  );
};
