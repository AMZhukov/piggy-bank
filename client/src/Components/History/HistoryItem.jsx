import React from 'react';

export const HistoryItem = ({ transaction, deleteTransaction }) => {
  return (
    <li
      className={`history__item ${
        transaction.isIncome ? 'history__item-plus' : 'history__item-minus'
      }`}
    >
      <div className="history__description">{transaction.description}</div>
      <div className="history__date">{new Date(transaction.date).toLocaleDateString()}</div>
      <div className="history__money">
        {transaction.isIncome ? '+' : '–'} {transaction.amount.toLocaleString()} &#8381;
        <button className="history__delete" onClick={() => deleteTransaction(transaction._id)}>
          x
        </button>
      </div>

    </li>
  );
};
