module.exports = {


    friendlyName: 'Bad request',
  
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
      var statusCodeToSet = 400;
  
      var message = {
        message: inputs.errMessage ? inputs.errMessage : 'Invalid request'
      }
      sails.log.warn({ reqId: req.reqId }, "Bad Request:", message);
      return exits.response.status(statusCodeToSet).send(message);
  
    }
  };
  
  