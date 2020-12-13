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
    const id = transaction._id;
    await transaction.save();
    res.status(201).json( id );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error error while accessing the database: ${error.message}` });
  }
});

module.exports = router;
