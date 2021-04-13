import {useState} from "react";
import {ERROR, FAIL, SUCCESS} from "../constants";

export const useLocationToast = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [locFail, setLocFail] = useState(false);

  function handleLocation(status) {
    switch (status) {
      case ERROR:
        setError(true);
        break;

      case SUCCESS:
        setSuccess(true);
        break;

      case  FAIL:
        setLocFail(true);
        break;

      default:
        return 'default'
    }
  }

  return [success, error, locFail, handleLocation];
};