const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost/moneyTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const transactionSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    type: String, // 'income' or 'expense'
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    const transactions = await Transaction.find();
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/transactions', async (req, res) => {
    const transactions = await Transaction.find();
    res.json(transactions);
});

app.post('/api/transactions', async (req, res) => {
    const { description, amount, type } = req.body;

    try {
        const newTransaction = new Transaction({ description, amount, type });
        await newTransaction.save();
        res.json(newTransaction);
    } catch (error) {
        res.status(500).send('Error adding transaction');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
