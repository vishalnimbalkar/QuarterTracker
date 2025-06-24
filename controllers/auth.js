const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { generateToken } = require('../middlewares/jwt.js');
const { forgotPasswordEmail } = require('../services/email.js');

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		//Get user by email
		const query = `select id, fullName, email, phone, password, designation, department, institute, dateOfJoining, role, isActive, createdAt, updatedAt from faculties where email = ? LIMIT 1`;
		const [rows] = await pool.query(query, email);
		//Check if user data is fetched or not
		if (rows.length === 0) {
			return res.status(401).json({ success: false, message: 'Invalid email or password' });
		}

		const faculty = rows[0];
		console.log(faculty);

		//account checks
		if (!faculty.isActive) {
			return res.status(403).json({ success: false, message: 'Your account is deactivated' });
		}
		//password verification
		const isMatch = await bcrypt.compare(password, faculty.password);
		if (!isMatch) {
			return res.status(401).json({ success: false, message: 'Invalid email or password' });
		}

		// Remove password before sending user data
		delete faculty.password;
		//Generate access token
		const accessToken = generateToken(faculty);
		return res.status(200).json({ success: true, message: 'Login successfully', faculty, accessToken });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const query = `select id, email, createdAt, updatedAt from faculties where email = ? LIMIT 1`;
		const [row] = await pool.query(query, [email]);
		//checks user exists or not
		if (row.length === 0) {
			return res
				.status(400)
				.json({ success: false, message: 'If the email is registered, a reset link will be sent.' });
		}
		const user = row[0];
		//generate token with 15 min expire time
		const token = jwt.sign({ email }, process.env.JWT_FORGOT_PASSWORD_KEY, { expiresIn: '15m' });
		//sending forgot password email
		await forgotPasswordEmail(token, email, user.name);
		return res.status(200).json({ success: true, message: 'If the email is registered, a reset link will be sent.' });
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(400).json({ success: false, message: 'Reset link expired. Please request again.' });
		}
		return res.status(500).json({ success: false, message: error.message });
	}
};

const resetPassword = async (req, res) => {
	try {
		const { verificationToken } = req.query;
		const { password } = req.body;
		//verify token and extract email
		const { email } = jwt.verify(verificationToken, process.env.JWT_FORGOT_PASSWORD_KEY);
		// hashed password before storing into database
		const hashedPassword = await bcrypt.hash(password, 10);
		await pool.query('update faculties set password = ? where email = ?', [hashedPassword, email]);
		return res.status(200).json({ success: true, message: 'Password reset successfully' });
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(400).json({ success: false, message: 'Reset link expired. Please request again.' });
		}
		return res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = { login, forgotPassword, resetPassword };
