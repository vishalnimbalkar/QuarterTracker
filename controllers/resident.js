const { pool } = require('../config/database');

//function to get all residents with quarter details
const getAllResident = async (req, res) => {
	try {
		const query = `
			select f.id as facultyId, f.fullName, q.blockName, q.flatType, q.campusName
			from requests r
			inner join faculties f on f.id = r.facultyId
            inner join quarters q on q.id = r.quarterId
            where r.status = 'Approved' and r.isActive = 1 order by r.createdAt desc`;
		const [residents] = await pool.query(query);
		return res.status(200).json({ success: true, message: 'Residents fetched successfully', residents });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

//function to soft delete request/facult and make quarter available
const deleteResident = async (req, res) => {
	try {
		const requestId = Number(req.params.requestId);
		if (isNaN(requestId)) {
			return res.status(400).json({ success: false, message: 'Invalid request id' });
		}
		const [result] = await pool.query(`select id, facultyId, quarterId, isActive from requests where id = ? limit 1`, [
			requestId,
		]);
		const resident = result[0];
		if (result.length === 0 || !resident.isActive) {
			return res.status(404).json({ success: false, message: 'Resident not found' });
		}
		// soft delete faculty
		// await pool.query(`update faculties set isActive = 0 where id = ?`, [resident.facultyId]);
		// soft delete request
		await pool.query('update requests set isActive = 0 where id = ?', [requestId]);
		//make quarter available
		await pool.query(`update quarters set status = 'available' where id = ?`, [resident.quarterId]);
		return res.status(200).json({ success: true, message: 'Resident deleted successfully.' });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};
module.exports = { getAllResident, deleteResident };
