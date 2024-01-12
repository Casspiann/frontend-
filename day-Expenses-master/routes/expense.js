const express = require('express');
const router = express.Router();
const expenceController = require('../controllers/expenses');
const userauthentication = require('../middleware/auth')

router.post('/addExpens', userauthentication.authenticate , expenceController.addExpense);
router.get('/get-expenses',userauthentication.authenticate ,expenceController.getExpense);
router.delete('/delete-expens/:id',userauthentication.authenticate , expenceController.deleteExpense);
router.get('/download', userauthentication.authenticate, expenceController.downloadExpenses)


module.exports = router;