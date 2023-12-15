import { Button } from "react-bootstrap";

import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../store/authSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const logoutHandler = () => {
    dispatch(logout());
    history.replace("/auth");
  };
  return (
    <Button
      onClick={logoutHandler}
      variant="light"
      className="border-0 bg-gradient rounded-0"
    >
      Logout
    
    </Button>
  );
};

export default Logout;