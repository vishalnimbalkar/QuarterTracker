const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { sendCredentials } = require('../services/email.js');

const addFaculty = async (req, res) => {
	const connection = await pool.getConnection();
	try {
		const { fullName, email, phone, password, designation, department, institute, dateOfJoining } = req.body;
		// Start transaction
		await connection.beginTransaction();
		//check email is exists or not
		const emailQuery = `select id, email, updatedAt from faculties where email = ? limit 1`;
		const [result] = await pool.query(emailQuery, [email]);
		//if result contains user return email already exists
		if (result.length === 1) {
			return res.status(400).json({ success: false, message: 'Email Already Exists. Please try another Email' });
		}

		// Hash the password using bcryptjs
		const hashedPassword = await bcrypt.hash(password, 10);

		//database insert operation
		const userData = [fullName, email, phone, hashedPassword, designation, department, institute, dateOfJoining];
		const query = `insert into faculties (fullName, email, phone, password, designation, department, institute, dateOfJoining) values(?,?,?,?,?,?,?,?)`;
		await connection.query(query, userData);

		//sending register success mail with credentials
		await sendCredentials(email, fullName, password);

		// If everything succeeds, commit transaction
		await connection.commit();
		connection.release();
		return res.status(201).json({ success: true, message: 'Faculty added successfully.' });
	} catch (error) {
		await connection.rollback();
		connection.release();
		return res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = { addFaculty };
