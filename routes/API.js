const { Router } = require('express');
const Transaction = require('../models/Transaction');
const { getFirstDayOfMonth, getFirstDayOfNextMonth } = require('./operationWithDate');

const router = Router();

// /api/addTransaction
router.post('/createTransaction', async (req, res) => {
  try {
    const { description, amount, isIncome, date } = req.body;
    const transaction = new Transaction({
      description,
      amount,
      isIncome,
      date,
    });

    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error error while accessing the database: ${error.message}` });
  }
});

router.delete('/deleteTransaction', async (req, res) => {
  const { _id } = req.body;
  try {
    await Transaction.findByIdAndDelete(_id);
    res.status(200).json(_id);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error error while accessing the database: ${error.message}` });
  }
});
router.post('/transactionsHistory', async (req, res) => {
  try {
    const { currentMonth, currentYear, currentTimezone } = req.body;

    // to request relevant data according to the time zone
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear, currentTimezone);
    const firstDayOfNextMonth = getFirstDayOfNextMonth(currentMonth, currentYear, currentTimezone);

    const transactions = await Transaction.find({
      date: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth,
      },
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Все влшыо из под кролнотя' });
  }
});

module.exports = router;
