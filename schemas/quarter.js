module.exports = {
    type: 'object',
    properties: {
        campusName: { type: 'string', minLength: 1 },
        blockName: { type: 'string', minLength: 1 },
        flatType: {
            type: 'string',
            enum: ['1BHK', '2BHK', '3BHK']
        },
        totalFlats: {
            type: 'integer',
            minimum: 1
        }
    },
    required: ['campusName', 'blockName', 'flatType', 'totalFlats'],
    additionalProperties: false
};
