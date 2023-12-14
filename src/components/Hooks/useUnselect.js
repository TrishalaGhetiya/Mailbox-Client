import { useEffect } from "react";
import { showNotification } from "../../store/authSlice";
import { setChecked } from "../../store/mailSlice";

const useUnselect = (dispatch) => {
    useEffect(() => {
        return () => {
          dispatch(setChecked({ id: null, selector: "none" }));
          dispatch(showNotification({ message: null, variant: null }));
        };
      }, [dispatch]);
}
export default useUnselect;