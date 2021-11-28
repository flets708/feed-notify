import React, { createContext, useReducer } from 'react'

const lId = process.env.NODE_ENV === "development" ? process.env.REACT_APP_LIFF_ID_DEV : process.env.REACT_APP_LIFF_ID_PROD

const initialState = {
  userId: "",
  displayName: "",
  pictureUrl: `${process.env.PUBLIC_URL}/init.svg`,
  lId: lId
}

const reducer = (state, action) => {
  switch(action.type){
    case 'SET_PROFILE':
      return { 
        userId:action.payload.userId,
        displayName:action.payload.displayName,
        pictureUrl:action.payload.pictureUrl,
        lId:lId
      }
    default:
      return state
  }
}

export const Store = createContext({})

const StoreProvider = ({ children }) => {
  const [ globalState, setGlobalState ] = useReducer(reducer, initialState)
  return (
    <Store.Provider value={{ globalState, setGlobalState }}>
      {children}
    </Store.Provider>
  )
}

export default StoreProvider
