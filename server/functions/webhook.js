
'use strict';

const line = require('@line/bot-sdk')
const { follow, unfollow } = require('../io/follow')
const { getItems, updateLastSubscribe } = require('../io/subscribe');
const { getRssFeeds } = require('../lib/getFeedContents');
const logger = require('../lib/logger')
const { createMessages } = require('../lib/createMessages')

const TOKEN = process.env.LINE_ACCESS_TOKEN
const IS_OFFLINE = process.env.IS_OFFLINE || false
const PREF_URL = IS_OFFLINE ? `https://liff.line.me/${process.env.LIFF_ID_DEV}` : `https://liff.line.me/${process.env.LIFF_ID_PROD}`

module.exports.handler = async (event) => {

  const client = new line.Client({
    channelAccessToken: TOKEN
  })

  const body = JSON.parse(event.body)
  const reqId = body.events[0].source.userId
  const type = body.events[0].type  
  const prefArr = ["設定", "一覧", "確認", "?", "？"]

  logger(event, reqId, type)

  let messages

  switch(type){
    case "message" :
      if(prefArr.indexOf(body.events[0].message.text) === -1){

        const tempResults = await getItems()
        let results
        if(reqId === "all"){
          results = tempResults
        }else{
          results = tempResults.filter(v => {
            return v.userId === reqId
          })
        }
        console.log("results",JSON.stringify(results, null, 2));
  
        await Promise.all(results.map(async result => {
          const feedResults = await Promise.all(result.subscribeFeeds
            .filter(subscribeFeed => subscribeFeed.enabled)
            .map(async subscribeFeed => {
              const feedResult = 
                new Date(subscribeFeed.addedAt).getTime() > new Date(result.lastSubscribe).getTime() ? 
                await getRssFeeds(
                  subscribeFeed.feedUrl,
                  new Date(0).toISOString()
                )
                :
                await getRssFeeds(
                  subscribeFeed.feedUrl, 
                  result.lastSubscribe
                )
              return feedResult
            })
          ).catch(e => console.error(e))
  
          console.log("feedResults", JSON.stringify(feedResults, null, 2));
    
          messages = feedResults
          .map(v => createMessages(v, reqId))
          .filter(v => v.type !== "empty")

          console.log(`${reqId},${result.userId},${messages.length},${messages.join().length}\nMessage Is${JSON.stringify(messages, null, 2)}`);

          if(messages.length > 0){
            //5個以上のメッセージは発信できないので、その制約
            if(messages.length > 5){
              messages.splice(5)
              console.log(`Messages for ${result.userId} are spliced because their length exceeds 5`);
            }
    
            await client.pushMessage(result.userId, messages)
            .catch(e => console.error(e))
          }    

          const updateResult = await updateLastSubscribe(result)
          if(!updateResult){console.log("update last subscribe failed")}

        }))

      }else{

        messages = [{
          "type": "text",
          "text": PREF_URL
        }]
        
        console.log(`${reqId},Message Is${JSON.stringify(messages, null, 2)}`);

        await client.pushMessage(reqId, messages)
        .catch(e => console.error(e))
      }

      break

    case "follow" :
      const reqName = await client.getProfile(reqId)
      .then(profile => profile.displayName) 
      .catch(e => console.error(e))

      const putResult = await follow(reqId, reqName)
      if(!putResult){console.log("put follow failed");}

      messages = [{
        "type": "text",
        "text": `${reqName}さん、フォローありがとう！`
      }]

      await client.pushMessage(reqId, messages)
      .catch(e => console.error(e))

      break

    case "unfollow" :
      putResult = await unfollow(reqId)
      if(!putResult){console.log("put unfollow failed");}
      break
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'hello ' + (new Date(Date.now() + (9 * 60) * 60 * 1000).toISOString()),
        input: type,
      },
      null,
      2
    ),
  };
};
