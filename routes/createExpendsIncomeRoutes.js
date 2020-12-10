const { Router } = require('express');

const router = Router();

// /api/createExpenseIncome
router.post('/expense', async (req, res) => {
  try {

  } catch (error) {
    res.status(500).json({message: `Error error while accessing the database, ${error.message}`});
  }
});

router.post('/income', async (req, res) => {
  try {

  } catch (error) {
    res.status(500).json({message: `Error while accessing th database, ${error.message}`});
  }
});

module.exports = router;
