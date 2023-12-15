import React, { useState, useRef } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";


import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Notification from "../UI/Notification";
import { login, showNotification } from "../../store/authSlice";

const SignUp = (props) => {
    const history = useHistory();
  const apiKey = useSelector((state) => state.auth.apiKey);
  const { message, variant } = useSelector((state) => state.auth.notification);
  const dispatch = useDispatch();
  const [signIn, setSignIn] = useState();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const onClickHandler = () => {
    setSignIn(!signIn);
  };

  const endPointUrl = signIn
    ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const enteredEmail = emailInputRef.current.value;
      const enteredPassword = passwordInputRef.current.value;

      const response = await axios.post(endPointUrl, {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      });
      const data = response.data;
      if (response.status === 200) {
        if (signIn) {
          dispatch(login({ idToken: data.idToken, email: data.email }));
          console.log("LoggedIn successfully");
          history.replace("/welcome/inbox");
        } else {
          emailInputRef.current.value = "";
          passwordInputRef.current.value = "";
          confirmPasswordInputRef.current.value = "";
          const message = "Welcome! You can now login with your credentials";
          dispatch(showNotification({ message: message, variant: "success" }));
        }
      }
    } catch (error) {
      console.log(error);
      const { data } = error.response;
      const { message } = data.error;
      dispatch(showNotification({ message: message, variant: "danger" }));
    }
  };

  return (
    <>
      <Container>
        <Row className="justify-content-center min-vh-100 align-items-center">
          {message && (
            <div className="fixed-top p-0">
              {" "}
              <Notification message={message} variant={variant} />{" "}
            </div>
          )}
          <Col>
            <div className="text-center pb-4">
              <h3>
                Welcome to{" "}
                <span className="text-danger fst-italic">Mail Box Client </span>
              </h3>
              <p>Please Sign Up/Login to continue.</p>
            </div>
            <div
              style={{ maxWidth: "25rem" }}
              className="text-center bg-danger bg-gradient mx-auto rounded-top py-1"
            >
              <i className="bi bi-envelope-at-fill fs-1 text-light"></i>
            </div>
            <Form
              onSubmit={onSubmitHandler}
              className="p-4 shadow-lg mx-auto "
              style={{ maxWidth: "25rem" }}
            >
              <FloatingLabel
                controlId="floatingInput"
                label="Email address"
                className="mb-3"
              >
                <Form.Control
                  className={`border-0 border-bottom rounded-0`}
                  type="email"
                  ref={emailInputRef}
                  placeholder="name@example.com"
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                className="mb-3"
                controlId="floatingPassword"
                label="Password"
              >
                <Form.Control
                  className={`border-0 border-bottom rounded-0`}
                  type="password"
                  ref={passwordInputRef}
                  placeholder="Password"
                  required
                />
              </FloatingLabel>
              {!signIn && (
                <FloatingLabel
                  controlId="floatingConfirmPassword"
                  label="Confirm Password"
                >
                  <Form.Control
                    className={`border-0 border-bottom rounded-0`}
                    type="password"
                    ref={confirmPasswordInputRef}
                    placeholder="Password"
                    required
                  />
                </FloatingLabel>
              )}
              <div className="text-center mt-4">
                {signIn ? (
                  <Button
                    type="submit"
                    className={`w-100 mt-2 bg-danger rounded-0 border-0 text-light fw-bold`}
                  >
                    Login
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className={`w-100 mt-2 bg-danger rounded-0 border-0 text-light fw-bold`}
                  >
                    Sign Up
                  </Button>
                )}
              </div>
              <div className="pt-3 text-center">
                <span>
                  {!signIn ? "Already a user?" : "First Time?"}{" "}
                  <span
                    onClick={onClickHandler}
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    {!signIn ? "Login" : "Sign Up"}
                  </span>{" "}
                </span>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignUp;
