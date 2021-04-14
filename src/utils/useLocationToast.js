import {useState} from "react";
import {ERROR, FAIL, SUCCESS} from "../constants";

export const useLocationToast = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [locFail, setLocFail] = useState(false);

  function handleLocation(status) {
    switch (status) {
      case ERROR:
        setError((prev) => !prev);
        break;

      case SUCCESS:
        setSuccess((prev) => !prev);
        break;

      case  FAIL:
        setLocFail((prev) => !prev);
        break;

      default:
        return 'default';
    }
  }

  return [success, error, locFail, handleLocation];
};