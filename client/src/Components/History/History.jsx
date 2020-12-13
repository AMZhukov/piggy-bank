import React from 'react';
import { HistoryItem } from './HistoryItem';

export const History = ({ transactions, deleteTransaction }) => {
  return (
    <section className="history">
      <h3>История расходов</h3>
      <ul className="history__list">
        {transactions.map((item) => (
          <HistoryItem transaction={item} key={item._id} deleteTransaction={deleteTransaction} />
        ))}
      </ul>
    </section>
  );
};
