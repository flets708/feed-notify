const RssParser = require("rss-parser");
const axios = require("axios");
const cheerio = require("cheerio");
const { setDisplayDate } = require("./dateUtil")

const rssParser = new RssParser();

module.exports.getRssFeeds = async (url, lineDate) => {
  const line = new Date(lineDate).getTime()
  const res = await rssParser
    .parseURL(url)
    .then(async feed => {

      const feeds = await Promise.all(feed.items
        .filter(item => {
          const tempDate = item.pubDate || item.isoDate
          const itemDate = new Date(tempDate).getTime()
          return itemDate > line
        })
        .map(async item => {
          const feedTitleStr = item.title.length + 3 + feed.title.length > 100 ?
            item.title.substr(0,94 - feed.title.length )+'...' : item.title
          const feedSummaryStr = item.contentSnippet.length + 3 + feed.title.length  > 100 ?
            item.contentSnippet.substr(0,94 - feed.title.length )+'...' : item.contentSnippet
          const feedOgImage = await getOgImage(item.link)
          const itemDate = item.pubDate || item.isoDate
          return {
            feedTitle: feedTitleStr,
            feedSummary: feedSummaryStr,
            feedLink: item.link,
            feedImage: feedOgImage,
            feedPubDate: setDisplayDate(new Date(new Date(itemDate).getTime() + (new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
          }
        }))
      
      const resFeed = {
        "siteTitle": feed.title,
        "siteLink": feed.link,
        "feeds": feeds
      }

      return new Promise((resolve) => resolve({
        resFeed
      }));
    })
    .catch((err) => {
      console.error("getRssFeed failed", err);
      return new Promise((resolve) => resolve({
        "siteTitle": "error",
        "siteLink": "error",
        "feeds": ""
      }));
    });


  
  return new Promise(resolve => resolve(res))
}

const getOgImage = async url => {
  const ogImage = await axios.get(url, { timeout : 10000 })
    .then(res => {  
        const html = res.data;
        const $ = cheerio.load(html);
        const tempOgImage = $('meta[property="og:image"]').attr('content')
        if(!tempOgImage){
          return 'NoImage'
        }else{
          return tempOgImage
        }
    })
    .catch(e => {console.error(e); return 'NoImage'})
  return new Promise( resolve => resolve(ogImage));
}

module.exports.getRssTitle = async (url) => {
  const res = await rssParser
    .parseURL(url)
    .then(feed => new Promise((resolve) => resolve({
      "siteTitle": feed.title,
      "siteLink": feed.link,
    })))
    .catch((err) => {
      console.error("getRssFeed failed", err);
      return new Promise((resolve) => resolve({
        "siteTitle": `TitleErr(${url})`,
        "siteLink": `SiteUrlErr`,
      }));
    });

  return new Promise(resolve => resolve(res))
}