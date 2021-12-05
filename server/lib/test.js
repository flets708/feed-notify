const { getOgImage } = require('./getFeedContents')

const test = async () => {
  const hoge = await getOgImage("https://www.shinnihon-ins.co.jp/industry-news/industry-news-20211203-7/")
  console.log(hoge);
}

test()