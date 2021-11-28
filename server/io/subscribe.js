const AWS = require('aws-sdk')

const USERS_TABLE = process.env.USERS_TABLE
const IS_OFFLINE = process.env.IS_OFFLINE || false

const dynamoDb = IS_OFFLINE ? 
  new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  :
  new AWS.DynamoDB.DocumentClient()

module.exports.getItems = async () => {

  const scanParams = {
    TableName: USERS_TABLE,
  };

  const results = await dynamoDb.scan(scanParams, (error,data) => {
    if (error) {console.error();(error)}
    return data
  }).promise()
    
  return new Promise( resolve => resolve(results.Items));
};

module.exports.updateLastSubscribe = async (item) => {
  const newItem = item
  newItem.lastSubscribe = new Date(Date.now()).toISOString()
  // newItem.lastSubscribe = new Date(Date.now() + (9 * 60) * 60 * 1000).toISOString()
  const putParams = {
    TableName: USERS_TABLE,
    Item: newItem
  }

  let updateResult
    await dynamoDb.put(putParams, (error) => {
      if(error) {
        console.log(error)
        updateResult = false
      }else{
        updateResult = true
      }
    }).promise();
  return new Promise( resolve => resolve(updateResult));
};