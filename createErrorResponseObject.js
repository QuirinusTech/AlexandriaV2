  function createErrorResponseObject(error) {
  error = error.toLowerCase();
  switch(error) {
  case "aergia":
    return {
      'response': "error",
      'errormsg': "Account status is inactive. The administrator has been notified. Please do not attempt to log in again.",
      'error_desc': "Aergia",
      responsecode: 403
    }
  case "medusa":
    return {
      response: "error",
      errormsg: "Incorrect username or password.",
      'error_desc': "Medusa",
      responsecode: 403
    };
  case "tantalus":
    return {
      response: "error",
      errormsg: "Insufficient Permissions.",
      'error_desc': "Tantalus",
      responsecode: 403
    };
  case "prometheus":
    return {
      response: "error",
      errormsg: "Username already taken.",
      'error_desc': "Prometheus",
      responsecode: 409
    };
  default:
    return {
      response: "error",
      errormsg: "General error occurred.",
      'error_desc': "Britta",
      responsecode: 500
    };
  }
}

module.exports = createErrorResponseObject