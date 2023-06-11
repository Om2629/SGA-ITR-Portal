module.exports = {
    attributes: {
      userName: {
        type: 'string',
        required: true
      },
      mobileNumber: {
        type: 'string',
        required: true,
        unique: true
      },
      email: {
        type: 'string',
        required: true,
        unique: true
      },
      password: {
        type: 'string',
        required: true
      },
      pancard: {
        type: 'string',
        required: true,
        unique: true
      },
      role:{
        type:'string',
        required: true
      }
    }
  };
  