const { pool } = require('../config/database');


//get all faculty details
const getAllRequests = async (req, res) => {
    try {
        const { status } = req.query;
        let query = `
			select f.id, f.fullName, f.designation, r.status
			from faculties f
			join requests r on f.id = r.facultyId
		`;
        const values = [];
        if (status && status !== 'all') {
            query += ` WHERE r.status = ?`;
            values.push(status);
        }
        const [requests] = await pool.query(query, values);
        return res.status(200).json({ success: true, message: 'Data fetched successfully', requests });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//function to reject request with reason
const getAllRequestsByFacultyId = async (req, res) => {
    try {
        const facultyId = Number(req.params.facultyId);
        //check id is valid or not
        if (isNaN(facultyId)) {
            return res.status(400).json({ success: false, message: 'Invalid Faculty Id' });
        }
        const query = `select f.id, f.fullName, f.preferredLocation,f.preferredFlatType, r.status, r.rejectReason 
        from requests r join faculties f on r.facultyId = f.id where r.facultyId = ? `;
        const [requests] = await pool.query(query, [facultyId]);
        return res.status(200).json({ success: true, message: `Data fetched successfully.`, requests });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//function to approve request and assign quarter
const approvedRequest = async (req, res) => {
    try {
        const { quarterId } = req.body;
        const requestId = Number(req.params.requestId);
        //check id is valid or not
        if (isNaN(requestId)) {
            return res.status(400).json({ success: false, message: 'Invalid Request Id' });
        }
        // Check if the quarter exists and is available
        const [quarter] = await pool.query(`select id, status from quarters where id = ?`, [quarterId]);
        if (!quarter.length) {
            return res.status(404).json({ success: false, message: 'Quarter not found' });
        }
        if (quarter[0].status === 'occupied') {
            return res.status(400).json({ success: false, message: `Quarter is already occupied` });
        }
        const query = `update requests set quarterId = ?, status = 'Approved' where id = ? and status = 'Pending'`;
        const [result] = await pool.query(query, [quarterId, requestId]);
        //check request is valid or not
        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: `Invalid Request` });
        }
        //mark quarter as occupied
        await pool.query(`update quarters set status = 'occupied' where id = ?`, [quarterId]);
        return res.status(200).json({ success: true, message: `Request approved successfully.` });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//function to reject request with reason
const rejectRequest = async (req, res) => {
    try {
        const requestId = Number(req.params.requestId);
        //check id is valid or not
        if (isNaN(requestId)) {
            return res.status(400).json({ success: false, message: 'Invalid Request Id' });
        }
        const { rejectReason } = req.body;
        const query = `update requests set rejectReason = ?, status = 'Rejected' where id = ? and status = 'Pending'`;
        const [result] = await pool.query(query, [rejectReason, requestId]);
        //check request is valid or not
        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: `Invalid Request` });
        }
        return res.status(200).json({ success: true, message: `Request rejected successfully.` });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllRequests, approvedRequest, rejectRequest, getAllRequestsByFacultyId };