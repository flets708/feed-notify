module.exports.createMessages = (eachFeesResults, reqId) => {
  if(eachFeesResults.resFeed.feeds.length > 0){
    const resStr = eachFeesResults.resFeed.feeds.map(feedResult => {
      if(feedResult.feedImage === "NoImage"){
        return {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": `${eachFeesResults.resFeed.siteTitle}, ${feedResult.feedPubDate}`,
                "color": "#aaaaaa",
                "size": "xs",
                "wrap": true
              },
              {
                "type": "text",
                "text": feedResult.feedTitle,
                "size": "lg",
                "wrap": true
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "none",
            "contents": [
              {
                "type": "button",
                "style": "link",
                "action": {
                  "type": "uri",
                  "label": "WEBSITE",
                  "uri": feedResult.feedLink
                },
                "height": "sm"
              }
            ],
            "flex": 0,
            "margin": "none"
          },
          "styles": {
            "footer": {
              "separator": true,
              "separatorColor": "#d0d4f4"
            }
          }
        }
      }else{
        return {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": feedResult.feedImage,
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover",
            "action": {
              "type": "uri",
              "uri": feedResult.feedLink
            }
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": `${eachFeesResults.resFeed.siteTitle}, ${feedResult.feedPubDate}`,
                "color": "#aaaaaa",
                "size": "xs",
                "wrap": true
              },
              {
                "type": "text",
                "text": feedResult.feedTitle,
                "size": "lg",
                "wrap": true
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "none",
            "contents": [
              {
                "type": "button",
                "style": "link",
                "action": {
                  "type": "uri",
                  "label": "WEBSITE",
                  "uri": feedResult.feedLink
                },
                "height": "sm"
              }
            ],
            "flex": 0,
            "margin": "none"
          },
          "styles": {
            "footer": {
              "separator": true,
              "separatorColor": "#d0d4f4"
            }
          }
        }
      }
    })

    // もしresStr.lengthが9より大きかったら、9以下に切ってAndMoreをつける
    if(resStr.length > 9){
      const moreArticleMsg = `and more\n${resStr.length - 9} articles`
      resStr.splice(9)
      resStr.push({
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": moreArticleMsg,
              "size": "xxl",
              "weight": "bold",
              "color": "#444488",
              "align": "center",
              "wrap": true
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": `Go ${eachFeesResults.resFeed.siteTitle}`,
                    "uri": eachFeesResults.resFeed.siteLink
                  },
                  "height": "sm",
                  "style": "link"
                }
              ]
            }
          ],
          "backgroundColor": "#d0d4f4",
          "position": "relative",
          "justifyContent": "center",
          "alignItems": "center"
        }
      })
    }

    // console.log(resStr);

    return({
      "type": "flex",
      "altText": "RssFeed Notify",
      "contents": {
        "type": "carousel",
        "contents": resStr
      }
    })
    
  }else{
    if(reqId === "all"){
      return({
        "type": "empty",
        "text": `No new articles`
      })
    }else{
      return({
        "type": "text",
        "text": `No new articles from ${eachFeesResults.resFeed.siteTitle}`
      })
    }

  }
}