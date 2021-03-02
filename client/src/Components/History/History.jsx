import React from 'react';
import { HistoryItem } from './HistoryItem';

export const History = ({ transactions, deleteTransaction }) => {
  return (
    <section className="history">
      <details>
        <summary>
          <h3>История расходов</h3>
        </summary>
        {transactions.length > 0 ? (
          <ul className="history__list">
            {transactions.map((transaction) => {
              return (
                <HistoryItem
                  transaction={transaction}
                  key={transaction._id}
                  deleteTransaction={deleteTransaction}
                />
              );
            })}
          </ul>
        ) : (
          <div className="history__item history__item_no-transactions">
            Транзакций в данном месяце нет
          </div>
        )}
      </details>
    </section>
  );
};
