import React from "react";
import { useDispatch, useSelector } from "react-redux";

import LoadingSpinner from "../UI/LoadingSpinner";
import EmptyMessage from "../UI/EmptyMessage";
import MailListItems from "./MailListItems";
import axios from "axios";
import { Button, ListGroup } from "react-bootstrap";
import { deleteMail } from "../../store/mailSlice";
import { showNotification } from "../../store/authSlice";

const Inbox = () => {
  const mails = useSelector((state) => state.mail.mails);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.mail.isLoading);
  const email = useSelector((state) => state.auth.email);
  const filteredMails = mails.filter(
    (mail) => mail.recipient === email
  );

  const isDeleteEnabled = filteredMails.some((mail) => mail.isChecked);

  const onDeleteHandler = async () => {
    try {
      const updatedPromises = filteredMails
        .filter((mail) => mail.isChecked)
        .map((mail) =>
          axios.delete(
            `https://react-http-ff156-default-rtdb.firebaseio.com/emails/${mail.id}.json`
          )
        );
      await Promise.all(updatedPromises);

      dispatch(
        showNotification({
          message: "Mail deleted",
          variant: "success",
        })
      );

      dispatch(deleteMail());
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="">
      <div className="border-bottom d-flex align-items-center py-2 px-1 mt-5 mt-lg-0">
        <div className="ms-auto mx-lg-auto">
          <Button
            variant="danger"
            className="px-2 border-0"
            disabled={!isDeleteEnabled}
            onClick={onDeleteHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i className="bi text-warning pe-2 bi-trash3"></i>
              <span className="">Delete</span>
            </p>
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="d-flex mt-5 pt-5 justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      ) : filteredMails.length === 0 ? (
        <EmptyMessage message="Your inbox is empty!" />
      ) : (
        <ListGroup variant="flush" className="overflow-auto">
          {filteredMails.map((mail) => (
            <MailListItems mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Inbox;
