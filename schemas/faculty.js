module.exports = {
	type: 'object',
	properties: {
		fullName: { type: 'string' },
		email: { type: 'string' },
		phone: { type: 'string' },
		password: { type: 'string' },
		designation: { type: 'string' },
		department: { type: 'string' },
		institute: { type: 'string' },
		dateOfJoining: { type: 'string' },
	},
	required: ['fullName', 'email', 'phone', 'password', 'designation', 'department', 'institute', 'dateOfJoining'],
	additionalProperties: false,
};
