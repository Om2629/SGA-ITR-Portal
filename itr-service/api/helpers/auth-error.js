module.exports = {

    friendlyName: 'Auth Error',
  
    description: '',
  
    inputs: {
      errMessage: {
        description: 'Error message if occured',
        type: 'string',
        defaults: null
      },
      req: {
        type: 'ref',
        required: true,
        description: 'request'
      },
      res: {
        type: 'ref',
        required: true,
        description: 'custom response'
      },
      code: {
        description: 'Error code',
        type: 'string',
        defaults: null,
        required: false
      },
    },
    exits: {
      response: {
        description: 'custom response'
      }
    },
    fn: async function (inputs, exits) {
      // Get access to `req` and `res`
      var req = inputs.req;
      var res = inputs.res;
      exits.response = res;
      // Define the status code to send in the response.
      var statusCodeToSet = 401;
      var errResponse = {
        message: inputs.errMessage ? inputs.errMessage : 'Authentication error occured'
      }
      if (inputs.code) {
        errResponse.code = inputs.code;
      }
      sails.log.warn({ reqId: req.reqId }, "Auth Error", errResponse);
      return exits.response.status(statusCodeToSet).send(errResponse);
    }
  };
  
  