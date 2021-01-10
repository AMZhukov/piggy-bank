const getFirstDayOfMonth = (currentMonth, currentYear, currentTimezone) => {
  const firstDayOfMonth = new Date(currentYear, currentMonth);
  const diffBetweenTimezone = currentTimezone - firstDayOfMonth.getTimezoneOffset();
  firstDayOfMonth.setMinutes(firstDayOfMonth.getMinutes() + diffBetweenTimezone);
  return firstDayOfMonth;
};

const getFirstDayOfNextMonth = (currentMonth, currentYear, currentTimezone) => {
  const firstDayOfNextMonth = getFirstDayOfMonth(currentMonth, currentYear, currentTimezone);
  firstDayOfNextMonth.setMonth(firstDayOfNextMonth.getMonth() + 1);
  return firstDayOfNextMonth;
};

module.exports = { getFirstDayOfMonth, getFirstDayOfNextMonth };
