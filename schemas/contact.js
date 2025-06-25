module.exports = {
	type: 'object',
	properties: {
		fullName: { type: 'string' },
		email: { type: 'string' },
		subject: { type: 'string' },
		phone: { type: 'string' },
		message: { type: 'string' },
	},
	required: ['fullName', 'email', 'subject', 'phone', 'message'],
	additionalProperties: false,
};
