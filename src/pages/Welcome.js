import React, { useState } from "react";
import { Route, NavLink } from "react-router-dom";
import {
  Row,
  Col,
  ButtonGroup,
  ToggleButton,
  Container,
  Offcanvas,
} from "react-bootstrap";

import { useSelector } from "react-redux";
import ComposeMail from "../components/MailBox/ComposeMail";
import Notification from "../components/UI/Notification";
import Inbox from "../components/MailBox/Inbox";
import Message from "../components/MailBox/Message";
import Logout from "../components/userAuthentication/Logout";
import Sent from "../components/Sent/Sent";

const Welcome = () => {
  const [show, setShow] = useState(false);
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const { message, variant } = useSelector((state) => state.auth.notification);
  const filteredMails = mails.filter(
    (mail) => mail.recipient === email
  );
  let unread = 0;
  
  filteredMails.forEach((mail) => {
    if (!mail.hasRead) {
      unread++;
    }
  });

  const onClickHandler = () => {
    setShow(false);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container fluid>
      <Row className="vh-100 overflow-hidden">
        <Col className="bg-dark d-flex flex-column p-0 pb-4" xs="auto">
          <Offcanvas
            className="p-lg-3 pb-2 bg-dark"
            show={show}
            onHide={handleClose}
            responsive="lg"
            style={{ maxWidth: "70vw" }}
          >
            <Offcanvas.Body className="d-flex flex-column p-lg-2">
              <div className="text-center">
                <p className="ps-2 fs-4 fw-bold text-success">Mail Box Client</p>
              </div>
              <div className="text-start mt-5">
                <ButtonGroup className="d-flex h-100 text-light flex-column">
                  <NavLink
                    to="/welcome/composemail"
                    activeClassName={"bg-success"}
                  >
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="py-2 w-100 border-0 rounded-0 text-start text-light"
                      onClick={onClickHandler}
                    >
                      <i className="fs-4 pe-2 text-info bi bi-pencil-fill"></i>{" "}
                      Compose
                    </ToggleButton>
                  </NavLink>
                  <NavLink to="/welcome/inbox" activeClassName={"bg-success"}>
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 w-100 text-start border-0 py-2 text-light"
                      onClick={onClickHandler}
                    >
                      <div className="d-flex">
                        <span>
                          <i className="fs-4 pe-2 text-info bi bi-envelope-fill"></i>{" "}
                          Inbox
                        </span>
                        <span className="pt-3 position-relative mx-auto">
                          unread
                          <span className="p-0 position-absolute top-0 end-0 text-warning">
                            {unread}
                          </span>{" "}
                        </span>
                      </div>{" "}
                    </ToggleButton>
                  </NavLink>
                  <NavLink to="/welcome/sent" activeClassName={"bg-success"}>
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="py-2 w-100 rounded-0 text-start border-0 text-light"
                      onClick={onClickHandler}
                    >
                      <i className="fs-4 pe-2 text-info bi bi-send-check-fill"></i>{" "}
                      Sent
                    </ToggleButton>
                  </NavLink>
                </ButtonGroup>
              </div>
              <div className="mt-auto d-lg-none ms-3">
                <Logout />
              </div>
            </Offcanvas.Body>
          </Offcanvas>
          <div className="mt-auto d-none d-lg-block ms-4">
            <Logout />
          </div>
        </Col>
        <Col style={{ maxHeight: "100vh" }} className="overflow-auto">
          {message && (
            <div
              style={{ maxWidth: "15rem" }}
              className="fixed-bottom ms-auto mb-2 me-3"
            >
              <Notification message={message} variant={variant} />
            </div>
          )}
          <div className="d-lg-none border py-1 fixed-top bg-light">
            <span className="px-2 py-2">
              <i
                onClick={handleShow}
                style={{ cursor: "pointer" }}
                className="bi ps-2 bi-justify fs-2 mt-1"
              >
                <i className="bi fs-2 text-success ps-2 bi-envelope-at-fill">
                  {" "}
                  <span className="fs-6 fw-bold">Mail Box Client</span>
                </i>{" "}
              </i>
            </span>
          </div>

          <Route path="/welcome/composemail">
            <ComposeMail />
          </Route>
          <Route path="/welcome/inbox" exact>
            <Inbox />
          </Route>
          <Route path="/welcome/sent" exact>
            <Sent />
          </Route>
          <Route path="/welcome/sent/:messageId">
            <Message />
          </Route>
          <Route path="/welcome/inbox/:messageId">
            <Message />
          </Route>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
