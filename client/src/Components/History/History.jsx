import React from 'react';
import { HistoryItem } from './HistoryItem';
import '@zachleat/details-utils';

export const History = ({ transactions, deleteTransaction }) => {
  return (
    <section className="history">
      <details-utils animate>
        <details>
          <summary className="history__summary">
            <h3 className="history__title">История расходов</h3>
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
      </details-utils>
    </section>
  );
};
