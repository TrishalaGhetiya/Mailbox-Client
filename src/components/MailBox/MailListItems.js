import { ListGroup, Row, Col, Form } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { setChecked } from "../../store/mailSlice";
import { useDispatch, useSelector } from "react-redux";
import { setRead } from "../../store/mailSlice";
import useAxiosFetch from "../../Hooks/useAxiosFetch";

const MailListItems = (props) => {
  const { mail } = props;
  const email = useSelector((state) => state.auth.email);
  const senderMail = email.replace(/[.]/g, "");
  const location = useLocation();
  const dispatch = useDispatch();
  const { fetchData: modifyMail } = useAxiosFetch();
  const onCheckHandler = () => {
    dispatch(setChecked({ id: mail.id, selector: "single" }));
  };

  const url =
    mail.sender === email
      ? `https://react-http-ff156-default-rtdb.firebaseio.com/sent-emails/${senderMail}/${mail.id}.json`
      : `https://react-http-ff156-default-rtdb.firebaseio.com/emails/${mail.id}.json`;


  const onClickHandler = () => {
    dispatch(setChecked({ id: null, selector: "none" }));

    const onSuccess = (response) => {
      if (response.status === 200) {
        dispatch(setRead({ id: mail.id }));
      }
    };

    if (!mail.hasRead) {
      modifyMail(
        url,
        "PUT",
        {
          ...mail,
          hasRead: true,
        },
        onSuccess
      );
    }
  };

  return (
    <ListGroup.Item
      as={Link}
      to={
        location.pathname === "/welcome/inbox"
          ? `/welcome/inbox/${mail.id}`
          : location.pathname === "/welcome/trash"
          ? `/welcome/trash/${mail.id}`
          : location.pathname === "/welcome/sent"
      }
      className={`mb-1 py-2 border-bottom ${
        mail.isChecked ? "bg-success bg-opacity-25" : ""
      }`}
      onClick={onClickHandler}
    >
      <Row>
        <Col lg="3">
          <div className="d-flex">
            <Form>
              <Form.Check
                checked={mail.isChecked}
                onChange={onCheckHandler}
                onClick={(e) => e.stopPropagation()}
              />
            </Form>

            <p className="fw-bold ps-3 m-0">
              <i
                className={`bi ${
                  mail.hasRead ? "invisible" : ""
                } bi-record-fill text-primary pe-1`}
              ></i>
              {mail.sender}
            </p>
          </div>{" "}
        </Col>
        <Col lg="8" className="pt-1 pt-lg-0">
          <div>
            <span className="fw-bold">{mail.subject}</span>
            <span className="ps-2">{`${mail.emailContent.substring(
              0,
              50
            )}...`}</span>
          </div>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default MailListItems;