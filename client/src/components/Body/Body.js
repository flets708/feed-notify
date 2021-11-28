import React, { useContext, useEffect, useState } from 'react'
import './Body.css'
import { Store } from '../../store';
import { Form, InputGroup, Button, ButtonGroup, Spinner, Alert } from 'react-bootstrap';
import { getFeeds, searchFeeds, updateFeeds } from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt, faTimes } from '@fortawesome/free-solid-svg-icons'


const Body = props => {

  const { globalState } = useContext(Store)
  const [inputFeedUrl, setInputFeedUrl] = useState("")
  const [subscribeFeedList, setSubscribeFeedList] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [show, setShow] = useState(false)
  const initialFunc = async (id) => {
    if(id){
      const tempArr = await getFeeds(id)
      setSubscribeFeedList([...tempArr])
      setIsLoaded(true)
    }
  }

  useEffect(()=>{
    initialFunc(globalState.userId)
  },[globalState.userId])

  const handleChange = e => {
    setInputFeedUrl(e.target.value)
  }

  const handleAddFeedList = e => {
    const addFunc = async () => {
      if(inputFeedUrl){
        const newFeed = await searchFeeds(globalState.userId, inputFeedUrl)
        setSubscribeFeedList([...subscribeFeedList, newFeed])
        setInputFeedUrl('')
      }
    }
    addFunc()
    e.preventDefault()
  }

  const handleSaveFeedList = () => {
    const saveFunc = async () => {
      const saveSucceeded = await updateFeeds(globalState.userId, subscribeFeedList)
      console.log("subscribeFeedList: " + subscribeFeedList);
      if(saveSucceeded){
        setShow(true)
      }
      setTimeout(() => {
        setShow(false)
      }, 3000);
    }
    saveFunc()
  }

  const handleCheck = id => {
    const tempList = subscribeFeedList.slice()
    const i = tempList.findIndex(v => v.feedId === id)
    tempList[i].enabled = !subscribeFeedList[i].enabled
    tempList[i].lastAction = tempList[i].enabled? "enabled" : "disabled"
    tempList[i].lastModifiedAt = new Date().toISOString()
    setSubscribeFeedList(tempList)
  }

  const deleteList = id => {
    const tempList = (subscribeFeedList.slice()).filter(v => v.feedId !== id)
    setSubscribeFeedList(tempList)
  }

  return (
    <div>
      <Alert show={show} variant="success" size="sm">
        <div className="d-flex justify-content-between align-items-center">
          <div className="">
            Save subscribeFeeds Succeeded
          </div>
          <div className="" onClick={() => setShow(false)}>
            <Button variant="link">
              <FontAwesomeIcon icon={faTimes} size="lg" color="#88aa88"/>
            </Button>
          </div>
        </div>
      </Alert>
      <div className="d-flex justify-content-center">
        <ButtonGroup aria-label="UPDATE_RESET" className="mt-2">
          <Button variant="outline-primary" 
            onClick={() => handleSaveFeedList()}
          >
            SAVE
          </Button>
          <Button variant="outline-secondary" 
            onClick={() => initialFunc(globalState.userId)}
          >
            RESET
          </Button>
        </ButtonGroup>
      </div>
      <InputGroup className="d-flex justify-content-center my-4">
        <Form onSubmit={handleAddFeedList} className="col-9">
          <Form.Control 
            type="text" 
            placeholder="Feed Url" 
            value={inputFeedUrl} 
            onChange={handleChange} 
          />
        </Form>
        <Button variant="dark"  value="add" onClick={handleAddFeedList}>Add</Button>      
      </InputGroup>
      {!isLoaded ? <div><Spinner animation="border" variant="success" /></div> :
        <ul style={{listStyle : "none", paddingLeft:"0"}}>
          {subscribeFeedList.map(readFeed => {
            return( 
              <li key={readFeed.feedId} className="text-center">
                <div className="d-flex align-items-center justify-content-center mx-auto" >
                  <div className="read-feed">
                    <div className="switchArea">
                      <input type="checkbox" id={`switch${readFeed.feedId}`} onChange={()=>{
                        handleCheck(readFeed.feedId)
                      }} checked={readFeed.enabled}/>
                      <label htmlFor={`switch${readFeed.feedId}`}>
                        {readFeed.title}
                      </label>
                      <div className="swImg" onClick={() => handleCheck(readFeed.feedId)}></div>
                    </div>
                  </div>
                  <div className="external-link" onClick={() => props.openWindow(readFeed.siteUrl)}>
                    <FontAwesomeIcon icon={faExternalLinkAlt} size="lg" color="#88aa88"/>
                  </div>
                  <div 
                    className="delete-read-feed"
                    // className="bd-highlight btn-close delete-read-feed"
                    variant="secondary" 
                    onClick={() => deleteList(readFeed.feedId)}
                  >
                    <FontAwesomeIcon icon={faTimes} size="lg" color="#88aa88"/>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      }
    </div>
  )
}

export default Body
