module.exports = {
	type: 'object',
	properties: {
		facultyId: { type: 'integer' },
		quarterId: { type: 'integer' },
		status: { type: 'string', enum: ['Pending', 'Approved', 'Rejected'] },
		rejectReason: { type: 'string' },
	},
	required: ['facultyId', 'quarterId', 'status'],
	additionalProperties: false,
};
