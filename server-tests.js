/* server startup checks. If any of these fail the server will not run. 
 * the validateData function in order to start the server. 
 */
var validator = require('validator');

(function serverTests() {
  function validateData(data, dimensions) {
    // yeah so what it's a long return statement why you talkin shit
    return validator.isInt(data.row) && validator.isInt(data.col) && validator.isHexColor(data.color) && data.row < dimensions && data.col < dimensions;
  }

  function validateApiKey (keyObj) {
    return keyObj && keyObj.apiKey.toString().length === 96 && validator.isHexadecimal(keyObj.apiKey) && validateTimeApiKey(keyObj);
  }

  // above is super ghetto please fix

  function failServer(message) {
    console.error(message);
    process.exit(1);
  }
  console.log("info: Startup tests engage");
  var testData = [
    { // row too big
      row: 10000,
      col: 1,
      color: "#fff"
    },
    { // col too big
      row: 1,
      col: 10000,
      color: "#fff"
    },
    { // invalid row
      row: "not valid",
      col: 1,
      color: "#fff"
    },
    { // invalid col
      row: 1,
      col: 100,
      color: "#fff"
    },
    { // invalid color
      row: 1,
      col: 1,
      color: "#abababab"
    },
    { // invalid case 2
      row: 1,
      col: 1,
      color: 111111
    },
    
  ];
  var testKeys = [
    'ABCDEFZ',
    '123ABCZ123ABCZ123ABCZ123ABCZ123ABCZ123ABCZ123ABCZ123ABCZ123ABCZ123ABCZ123ABCZ123ABCZ123ABCZ123ABCZ123ABCZ',
    '2344',
    '',
    null,
    undefined,
    true,
    'c642370327fb8c&dcf3ff62980a1725de42f2c536d6d20210dbafe16071575780ff69983671c3d2e5c876f756291e300'
  ];
  if(testData.some(validateData(testData, 32)) === true) {
    failServer("FAILED: validateData function is not working properly");
  } else {
    console.log("PASSED: validateData is nominal");
  }
  if(testKeys.some(validateApiKey) === true) {
    failServer("FAILED: validateApiKey is not working properly")
  } else {
    console.log("PASSED: validateApiKey is nominal")
  }
  if(!grid) {
    failServer("FAILED: grid is not instantiated properly");
  } else {
    console.log("PASSED: grid instantiation nominal");
  }
}());