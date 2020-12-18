const { Router } = require('express');
const Transaction = require('../models/Transaction');

const router = Router();

// /api/addTransaction
router.post('/addTransaction', async (req, res) => {
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

module.exports = router;
