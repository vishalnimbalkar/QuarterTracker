const { pool } = require('../config/database');

// function to generate prefix from campus/block/flatType
function generateQuarterPrefix(campusName, blockName, flatType) {
	const campusCode = campusName.substring(0, 2).toUpperCase().replace(/\s/g, '');
	return `${campusCode}-${blockName.toUpperCase()}-${flatType.toUpperCase()}`;
}

//function to add multiple quarters
const addQuarter = async (req, res) => {
	try {
		const { campusName, blockName, flatType, totalFlats } = req.body;
		const prefix = generateQuarterPrefix(campusName, blockName, flatType);
		// Count how many quarters already exist with this prefix
		const [existing] = await pool.query('SELECT COUNT(*) as count FROM quarters WHERE quarterCode LIKE ?', [
			`${prefix}-%`,
		]);
		const startIndex = existing[0].count;
		const values = [];
		for (let i = 0; i < totalFlats; i++) {
			const serial = String(startIndex + i + 1).padStart(3, '0');
			const quarterCode = `${prefix}-${serial}`;
			values.push([quarterCode, campusName, blockName, flatType]);
		}
		const insertQuery = `insert into quarters (quarterCode, campusName, blockName, flatType) values ?`;
		await pool.query(insertQuery, [values]);
		return res.status(201).json({ success: true, message: `${totalFlats} quarters added successfully.` });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

//function to get all quarters
const getAllQuarters = async (req, res) => {
	try {
		const [rows] = await pool.query(
			'select id, quarterCode, campusName, blockName, flatType, status, createdAt, updatedAt from quarters where isActive = 1 order by createdAt desc'
		);
		return res.status(200).json({ success: true, quarters: rows });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

//function to get quarters with campus Name and flat type
const getQuarterByCampusAndFlatType = async (req, res) => {
	try {
		const { campusName, flatType } = req.query;
		const [rows] = await pool.query(
			'select id, quarterCode, campusName, blockName, flatType, status, createdAt, updatedAt from quarters where campusName = ? and flatType = ? and status = ? and isActive = 1 order by createdAt desc',
			[campusName, flatType, 'available']
		);
		return res.status(200).json({ success: true, quarters: rows });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

//function to soft delete quarter(isActive = false)
const deleteQuarter = async (req, res) => {
	try {
		const quarterId = Number(req.params.quarterId);
		//check id is valid or not
		if (isNaN(quarterId)) {
			return res.status(400).json({ success: false, message: 'Invalid Quarter ID' });
		}
		//soft-delete set isActive false
		const query = `update quarters set isActive = 0 where id = ?`;
		const [result] = await pool.query(query, [quarterId]);
		//check quarters exists or not
		if (result.affectedRows === 0) {
			return res.status(400).json({ success: false, message: 'Quarters not found' });
		}
		return res.status(200).json({ success: true, message: 'Quarters deleted successfully' });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = { addQuarter, getAllQuarters, getQuarterByCampusAndFlatType, deleteQuarter };
