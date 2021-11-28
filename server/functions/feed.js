
'use strict';

const { getRssTitle } = require('../lib/getFeedContents');
const logger = require('../lib/logger')
const { getAllFeedList, updateFeedList, getFullUserData } = require('../io/feedList')
const { v4 } = require('uuid')

const IS_OFFLINE = process.env.IS_OFFLINE || false


module.exports.handler = async (event) => {


  // console.log(JSON.stringify(event, null, 2));
  const body = JSON.parse(event.body)
  let resData

  logger(event, body.uid, `feed ${body.type}`)

  switch(body.type){
    case "GET" :
      resData = await getAllFeedList(body.uid)
      break
    case "GET_USER_DATA" :
      resData = await getFullUserData(body.uid)
      break
    case "UPDATE" :
      resData = await updateFeedList(body.newLists, body.uid)
      break
    case "SEARCH" :
      resData = await getRssTitle(body.url)
        .then(res => {
          const addDate = new Date().toISOString()
          return({
          "feedUrl": body.url,
          "siteUrl": res.siteLink,
          "lastModifiedAt": addDate,
          "addedAt": addDate,
          "lastAction": "added",
          "title": res.siteTitle,
          "enabled": true,
          "feedId": v4()
          })
        })
      break
  }

  console.log(JSON.stringify(resData, null, 2));

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT"
  },
    body: JSON.stringify(
      {
        "resData": resData
      },
      null,
      2
    ),
  };
};
