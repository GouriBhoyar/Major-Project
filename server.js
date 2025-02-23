const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'shravani', // Change this if you have a different MySQL user
    password: '', // Add your MySQL password
    database: 'autogenics' // Change this to your actual database name
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API to get all orders
app.get('/orders', (req, res) => {
    db.query('SELECT * FROM order_details', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// API to add a new order
app.post('/orders', (req, res) => {
    const { customer_name, phone_number, start_date, end_date, service_used, workers, equipments_used, total_cost } = req.body;
    const sql = 'INSERT INTO order_details (customer_name, phone_number, start_date, end_date, service_used, workers, equipments_used, total_cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [customer_name, phone_number, start_date, end_date, service_used, workers, equipments_used, total_cost], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Order added successfully', orderId: result.insertId });
    });
});

// API to delete an order
app.delete('/orders/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM order_details WHERE order_id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Order deleted successfully' });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
