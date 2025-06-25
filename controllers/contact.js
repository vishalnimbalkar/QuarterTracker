const { pool } = require('../config/database');

//function to add new contact query
const addContactQuery = async (req, res) => {
    try {
        const { fullName, email, subject, phone, message } = req.body;
        const query = `insert into contact_queries(fullName, email, subject, phone, message) values (?,?,?,?,?)`;
        await pool.query(query, [fullName, email, subject, phone, message]);
        return res.status(201).json({ success: true, message: 'Contact successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

//function to get all contact queries
const getAllContactQueries = async (req, res) => {
    try {
        const [result] = await pool.query(`select id, fullName, email, subject, phone, message, createdAt, updatedAt from contact_queries`);
        return res.status(200).json({ success: true, message: 'Data fetched successfully', data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addContactQuery, getAllContactQueries };