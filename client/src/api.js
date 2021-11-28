const apiUrl = process.env.NODE_ENV === "development" ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD

export const getFeeds = async uid => {
  const data = {
    "uid" : uid,
    "type" : "GET"
  }
  const param = {
      mode: 'cors',
      method : "POST",
      headers: {
          "Content-Type": "application/json; charset=utf-8"
      },
      // body: data
      body: JSON.stringify(data)
  };
  console.log(apiUrl);
  const newFeeds = await fetch(`${apiUrl}/feed`, param)
  .then( res =>res.json())
  .catch( err => console.log(`[Fetch API]${err}`))
  console.log(newFeeds);
  return new Promise(resolve => resolve(newFeeds.resData))
}

export const getUserData = async uid => {
  const data = {
    "uid" : uid,
    "type" : "GET_USER_DATA"
  }
  const param = {
      mode: 'cors',
      method : "POST",
      headers: {
          "Content-Type": "application/json; charset=utf-8"
      },
      // body: data
      body: JSON.stringify(data)
  };
  console.log(apiUrl);
  const newFeeds = await fetch(`${apiUrl}/feed`, param)
  .then( res =>res.json())
  .catch( err => console.log(`[Fetch API]${err}`))
  console.log(newFeeds);
  return new Promise(resolve => resolve(newFeeds.resData))
}

export const searchFeeds = async (uid, url) => {
  const data = {
    "uid" : uid,
    "url" : url,
    "type" : "SEARCH"
  }
  const param = {
      mode: 'cors',
      method : "POST",
      headers: {
          "Content-Type": "application/json; charset=utf-8"
      },
      // body: data
      body: JSON.stringify(data)
  };
  console.log(apiUrl);
  const newFeeds = await fetch(`${apiUrl}/feed`, param)
  .then( res =>res.json())
  .catch( err => console.log(`[Fetch API]${err}`))
  console.log(newFeeds);
  return new Promise(resolve => resolve(newFeeds.resData))
}

export const updateFeeds = async (uid, newLists) => {
  const data = {
    "uid" : uid,
    "newLists" : newLists,
    "type" : "UPDATE"
  }
  const param = {
      mode: 'cors',
      method : "POST",
      headers: {
          "Content-Type": "application/json; charset=utf-8"
      },
      // body: data
      body: JSON.stringify(data)
  };
  console.log(apiUrl);
  // console.log("newLists:" + JSON.stringify(newLists, null, 2) + uid);
  const saveSucceeded = await fetch(`${apiUrl}/feed`, param)
  .then( res =>res.json())
  .catch( err => console.log(`[Fetch API]${err}`))
  console.log(saveSucceeded);
  return new Promise(resolve => resolve(saveSucceeded.resData))
}