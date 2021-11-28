import React, { useContext, useEffect, useState } from 'react'
import { Store } from '../../store'
import { Container, Modal, Nav, Navbar, Button } from "react-bootstrap";
import './Header.css'
import { getUserData } from '../../api';

const Header = props => {
  const { globalState } = useContext(Store)
  const [modalShow, setModalShow] = useState(false)
  const [userData, setUserData] = useState("")
  

  useEffect(()=>{
    const showData = async () => setUserData(JSON.stringify((await getUserData(globalState.userId)), null, 2))
    if(modalShow){
      showData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[modalShow])

  return (
    <div className='Header fixed-top'>
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Container>
          <img
            alt=""
            src={globalState.pictureUrl}
            className="d-inline-block align-top pic"
          />
          <Navbar.Brand>Preferences</Navbar.Brand>
          <Navbar.Toggle  aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link onClick={() => setModalShow(true)}>
                MyData
              </Nav.Link>
              <Nav.Link onClick={props.closeWindow}>
                Leave
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            All Settings of {globalState.displayName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>{userData}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Header
