import React from 'react';

export const Operation = ({
  createTransaction,
  changeDescription,
  changeAmount,
  changeDate,
  changeIsIncome,
  date,
}) => {
  return (
    <section className="operation">
      <h3>Новая операция</h3>
      <form id="form" onSubmit={(event) => createTransaction(event)}>
        <label>
          <input
            type="text"
            className="operation__fields operation__name"
            placeholder="Наименование операции"
            onChange={(event) => changeDescription(event.target.value)}
            required={true}
          />
        </label>
        <label>
          <input
            type="number"
            className="operation__fields operation__amount"
            placeholder="Введите сумму"
            onChange={(event) => changeAmount(event.target.value)}
            required={true}
          />
        </label>
        <label>
          <input
            type="date"
            className="operation__fields operation__date"
            placeholder="Введите дату"
            onChange={(event) => changeDate(event.target.value)}
            required={true}
            value={date.toISOString().slice(0, 10)}
          />
        </label>
        <div className="operation__btns">
          <button
            className="operation__btn operation__btn-subtract"
            type="submit"
            onClick={() => {
              changeIsIncome(false);
            }}
          >
            Расход
          </button>
          <button
            className="operation__btn operation__btn-add"
            type="submit"
            onClick={() => changeIsIncome(true)}
          >
            Доход
          </button>
        </div>
      </form>
    </section>
  );
};
