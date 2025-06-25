const { pool } = require('../config/database');

const assignQuarter = async (req, res) => {
    try {
        const { facultyId, quarterId, status, rejectReason } = req.body;
        const insertQuery = `insert into requests (facultyId, quarterId, status, rejectReason) values (?,?,?,?)`;
        const values = [facultyId, quarterId, status, rejectReason || null];
        await pool.query(insertQuery, values);
        return res.status(201).json({ success: true, message: `Quarter assign successfully.` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { assignQuarter };