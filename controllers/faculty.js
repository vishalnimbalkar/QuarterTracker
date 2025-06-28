const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { sendCredentials } = require('../services/email.js');

//function to add faculty by admin
const addFaculty = async (req, res) => {
	const connection = await pool.getConnection();
	try {
		const { fullName, email, password, designation, department, institute, dateOfJoining } = req.body;
		// Start transaction
		await connection.beginTransaction();
		//check email is exists or not
		const emailQuery = `select id, email, updatedAt from faculties where email = ? limit 1`;
		const [result] = await pool.query(emailQuery, [email]);
		//if result contains user return email already exists
		if (result.length === 1) {
			return res.status(400).json({ success: false, message: 'Email already exists. please try another email' });
		}

		// Hash the password using bcryptjs
		const hashedPassword = await bcrypt.hash(password, 10);

		//database insert operation
		const userData = [fullName, email, hashedPassword, designation, department, institute, dateOfJoining];
		const query = `insert into faculties (fullName, email, password, designation, department, institute, dateOfJoining) values(?,?,?,?,?,?,?)`;
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

//function to add preferences details by faculty
const updateFaculty = async (req, res) => {
	try {
		const facultyId = Number(req.params.facultyId);
		const {
			phone,
			maritalStatus,
			familyMembers,
			medicalCondition,
			natureOfEmployment,
			yearsOfService,
			preferredLocation,
			preferredFlatType,
			reasonForPreference,
		} = req.body;
		//check id is valid or not
		if (isNaN(facultyId)) {
			return res.status(400).json({ success: false, message: 'Invalid faculty id' });
		}
		const updateQuery = `update faculties SET
				phone = ?,
                maritalStatus = ?,
                familyMembers = ?,
                medicalCondition = ?,
                natureOfEmployment = ?,
                yearsOfService = ?,
                preferredLocation = ?,
                preferredFlatType = ?,
                reasonForPreference = ? WHERE id = ?`;

		const values = [
			phone,
			maritalStatus,
			familyMembers,
			medicalCondition,
			natureOfEmployment,
			yearsOfService,
			preferredLocation,
			preferredFlatType,
			reasonForPreference,
			facultyId,
		];
		const [result] = await pool.query(updateQuery, values);
		if (result.affectedRows === 0) {
			return res.status(404).json({ success: false, message: 'Faculty not found' });
		}
		const requestQuery = `insert into requests(facultyId) values(?)`;
		await pool.query(requestQuery, [facultyId]);
		return res.status(200).json({ success: true, message: 'Faculty updated successfully' });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

//get faculty details by id
const getFacultyById = async (req, res) => {
	try {
		const requestId = Number(req.params.requestId);
		//check id is valid or not
		if (isNaN(requestId)) {
			return res.status(400).json({ success: false, message: 'Invalid request id' });
		}
		const query = `SELECT f.id, f.fullName, f.email, f.phone, f.designation, f.department, f.institute,
       	f.dateOfJoining, f.maritalStatus, f.familyMembers, f.medicalCondition,
      	 f.natureOfEmployment, f.yearsOfService, f.preferredLocation,
      	 f.preferredFlatType, f.reasonForPreference, f.createdAt,
      	 r.status
		FROM faculties f
		INNER JOIN requests r ON f.id = r.facultyId
		WHERE f.isActive = 1 AND r.id = ?`;
		const [result] = await pool.query(query, [requestId]);
		const faculty = result[0];
		if (!faculty) {
			return res.status(404).json({ success: false, message: 'Request not found' });
		}
		return res.status(200).json({ success: true, message: 'Data fetched successfully', faculty });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = { addFaculty, updateFaculty, getFacultyById };
