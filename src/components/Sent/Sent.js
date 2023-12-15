import { Button, ListGroup } from "react-bootstrap";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { moveFromSentbox } from "../../store/mailSlice";
import { showNotification } from "../../store/authSlice";
import axios from "axios";
import EmptyMessage from "../UI/EmptyMessage";
import useUnselect from "../../Hooks/useUnselect";
import MailListItems from "../MailBox/MailListItems";
import Selector from "../MailBox/Selector";

const Sent = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const senderMail = email.replace(/[.]/g, "");
  const sentMails = mails.filter(
    (mail) => !mail.trashed && mail.sender === email
  );
  const isLoading = useSelector((state) => state.mail.isLoading);
  const dispatch = useDispatch();
  const isDeleteEnabled = sentMails.some((mail) => mail.isChecked);
  const onDeleteHandler = async () => {
    try {
      const updatedPromises = sentMails
        .filter((mail) => mail.isChecked)
        .map((mail) =>
          axios.put(
            `https://react-http-ff156-default-rtdb.firebaseio.com/sent-emails/${senderMail}/${mail.id}.json`,
            {
              ...mail,
              isChecked: false,
              trashed: true,
            }
          )
        );
      await Promise.all(updatedPromises);

      dispatch(moveFromSentbox({ move: "toTrash", email: email }));
      dispatch(
        showNotification({ message: "Moved to trash!", variant: "success" })
      );
    } catch (error) {
      const { data } = error.response;
      console.log(data.error.message);
    }
  };
  useUnselect(dispatch);
  return (
    <>
      <div className="border-bottom d-flex align-items-center py-2 px-1 mt-5 mt-lg-0">
        <Selector filteredMails={sentMails} />
        <div className="ms-auto mx-lg-auto">
          <Button
            disabled={!isDeleteEnabled}
            variant="danger"
            className="border-0 px-2"
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
        <div className=" d-flex h-50 justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      ) : sentMails.length === 0 ? (
        <>
          <EmptyMessage
            message="No sent messages!"
            link={
              <>
                <Link to="/welcome/composemail">
                  <span>Send</span>
                </Link>{" "}
                one now!
              </>
            }
          />{" "}
        </>
      ) : (
        <ListGroup variant="flush">
          {sentMails.map((mail) => (
            <MailListItems mail={mail} key={mail.id} isSent={true} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Sent;
