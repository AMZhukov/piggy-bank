import React from 'react';
import { HistoryItem } from './HistoryItem';

export const History = ({ transactions, deleteTransaction, currentTimezone }) => {
  return (
    <section className="history">
      <h3>История расходов</h3>
      <ul className="history__list">
        {transactions.map((item) => (
          <HistoryItem
            transaction={item}
            key={item._id}
            deleteTransaction={deleteTransaction}
            currentTimezone={currentTimezone}
          />
        ))}
      </ul>
    </section>
  );
};
