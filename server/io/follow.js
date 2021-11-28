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

module.exports.follow = async (reqId, reqName) => {
  let putResult

  const params = {
    TableName: USERS_TABLE,
    Item: {
      "userId": reqId,
      "name": reqName,
      "lastSubscribe": new Date(Date.now() + (9 * 60) * 60 * 1000).toISOString(),
      "subscribeFeeds" : []
    },
  };

  await dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      putResult = false
    } else {
      putResult = true
    }
  }).promise();
    
  return new Promise( resolve => resolve(putResult));
};

module.exports.unfollow = async (reqId) => {
  let putResult

  const params = {
    TableName: USERS_TABLE,
    Key : {
      "userId" : reqId
    }
  }

  await dynamoDb.delete(params, (error) => {
    if (error) {
      console.log(error);
      putResult = false
    } else {
      putResult = true
    }
  }).promise();
    
  return new Promise( resolve => resolve(putResult));
};