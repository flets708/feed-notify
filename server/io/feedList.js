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

module.exports.getAllFeedList = async ( userId ) => {

  const params = {
    TableName: USERS_TABLE,
    Key: {
      'userId' : userId
    }
  };

  const results = await dynamoDb.get(params, (error,data) => {
    if (error) {console.error(error)}
    return data
  }).promise()
    
  return new Promise( resolve => resolve(results.Item.subscribeFeeds));
};

module.exports.getFullUserData = async ( userId ) => {

  const params = {
    TableName: USERS_TABLE,
    Key: {
      'userId' : userId
    }
  };

  const results = await dynamoDb.get(params, (error,data) => {
    if (error) {console.error(error)}
    return data
  }).promise()
    
  return new Promise( resolve => resolve(results.Item));
};

module.exports.updateFeedList = async ( newLists, userId) => {

  const params = {
    TableName: USERS_TABLE,
    Key: {
      "userId": userId
    },
    UpdateExpression: "set subscribeFeeds = :val",
    ExpressionAttributeValues:{
      ":val" : newLists
    }
  }

  let updateResult = true
  await dynamoDb.update(params, (error) => {
    if(error) {
      console.log(error)
      updateResult = false
    }
  }).promise();
  
  return new Promise( resolve => resolve(updateResult));
};