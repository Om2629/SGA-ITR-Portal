module.exports = {
    attributes: {
      loginID: {
        type: 'string'
      },
      refreshToken: {
        type: 'string',
        required: true,
        unique: true
      },
      disabled: {
        type: 'boolean',
        defaultsTo: false
      },
      expiresAt: {
        type: 'number',
        required: true
      }
    }
  };
  