import React, { useContext, useEffect, useState } from 'react'
import liff from "@line/liff";
import { Store } from '../../store';
import Header from '../Header/Header';
import Body from '../Body/Body';
import './Layout.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Modal } from 'react-bootstrap'

const Layout = () => {
  const { globalState, setGlobalState } = useContext(Store)
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [isCloseWindow, setIsCloseWindow] = useState(false)
  const handleClose = () => setShow(false)
  const handleClose2 = () => setShow2(false)
  const handleShow = () => setShow(true)
  const handleShow2 = () => setShow2(true)

  const closeWindow = () => {
    if (liff.isInClient()) {
      handleShow();
    } else {
      handleShow2()
    }
  }

  const openWindow = url => {
    if (liff.isInClient()) {
      liff.openWindow({
        url: url,
        external: true,
      });
    } else {
      window.open(url)
    }
  }

  useEffect(()=>{
    if(isCloseWindow){
      liff.closeWindow();
    }
  },[isCloseWindow])
  
  useEffect(()=>{
    liff.init({
      liffId: globalState.lId
    })
    .then(()=>{
      if(liff.isLoggedIn() === false) liff.login({})
    })
    .then(()=>{
      liff.getProfile()
      .then(p => {
        setGlobalState({ type: "SET_PROFILE", payload: {
          "userId": p.userId,
          "displayName": p.displayName,
          "pictureUrl": p.pictureUrl || `${process.env.PUBLIC_URL}/logo192.png`,
        }})
        console.log(`this is ${process.env.NODE_ENV}, ${globalState.lId}`);
      })
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div>
      <Header closeWindow={closeWindow}></Header>
      <div className="App-body">
        <Body openWindow={openWindow}></Body>
      </div>     

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Leave this page?</Modal.Title>
        </Modal.Header>
      
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="outline-primary" onClick={() => setIsCloseWindow(true)}>
            Leave
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Cannot Close</Modal.Title>
        </Modal.Header> 
        <Modal.Body>
          <span>This button is unavailable as LIFF is currently being opened in an external browser.</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose2}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Layout
