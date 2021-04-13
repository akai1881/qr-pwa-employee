import React, {useEffect, useState} from 'react';
import QrReader from 'react-qr-reader';
import {
  compareTime,
  shiftStartedTime,
  parseScanData,
  countMinutesLate, getUserLocation
} from '../helpers/functions.js';
import {checkShift, getUserData, setShiftToDb, getCurrentTimeStamp} from '../api';
import RedCheck from '../assets/images/check_red.svg';
import Check from '../assets/images/check.svg';
import Spinner from '../components/Spinner';
import AOS from 'aos';
import classifyPoint from "robust-point-in-polygon";
import {ERROR, FAIL, polygon, SUCCESS} from "../constants";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {useLocationToast} from "../utils/useLocationToast";


AOS.init();


const Scanner = ({user}) => {
  const [access, setAccess] = useState(false);
  const [loader, setLoader] = useState(true);
  const [userData, setUserData] = useState({});
  const [shift, setShift] = useState('');
  const [success, error, locFail, handleLocation] = useLocationToast()
  const [location, setLocation] = useState(false);
  const [isLate, setIsLate] = useState(false);
  const [navigator, setNavigator] = useState(window.navigator.geolocation);


  useEffect(() => {

    getUserLocation(checkUserLocation, handleLocError);


    // check if user already shifted
    if (user) {
      fetchUser().then(() => console.log('success'));
    }
    checkUserShift().then(() => console.log('success'));


  }, [navigator]);


  async function checkUserShift() {
    try {
      const res = await checkShift(user.uid);
      setShift(shiftStartedTime(res.date.toDate()));
      setIsLate(res.isLate);
      setAccess(true);
    } catch (e) {
      console.log(e.message);
      setLoader(false);
    } finally {
      setLoader(false);
    }
  }

  const checkUserLocation = (position) => {
    const {latitude, longitude} = position.coords;

    const loc = classifyPoint(polygon, [latitude, longitude]);

    if (loc === -1 || loc === 0) {
      setLocation(true);
      handleLocation(SUCCESS)
      return;
    }
    handleLocation(FAIL)
    setLocation(false);
  };

  async function fetchUser() {
    const fetchedUser = await getUserData(user.uid);


    setUserData({
      email: user.email,
      uid: user.uid,
      firstName: fetchedUser.firstName,
      lastName: fetchedUser.lastName,
      role: fetchedUser.role,
      department: fetchedUser.department.name,
      phone: fetchedUser.phone1,
      dueTime: fetchedUser.dueTime.toDate() || new Date()
    });

  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  function handleLocError() {
    handleLocation(ERROR);
  }


  const handleScan = async result => {
    if (!result) return;

    const permission = parseScanData(result);

    let date = new Date();

    if (!location || !permission) {
      return;
    }
    setLoader(true);
    let is_late = false;
    let minutesLate = 0;
    try {
      date = await getCurrentTimeStamp();
      setShift(shiftStartedTime(date));
    } catch (e) {
      console.log(e.message);
    }
    if (compareTime(date, userData.dueTime)) {
      is_late = true;
      minutesLate = countMinutesLate(date, userData.dueTime);
    }
    if (is_late) {
      setIsLate(true);
    }
    const userShift = {
      ...userData,
      date,
      location,
      isLate: is_late,
      minutesLate
    };

    console.log(userShift);

    setShiftToDb(date, userShift).then(() => {
      setAccess(true);
      setLoader(false);
    });
  };

  if (loader) {
    return (
      <div className="loader-container">
        <Spinner loader={loader}/>
      </div>
    );
  }


  const handleClick = () => {
    setLocFail(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setLocFail(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(false);
  };

  const handleError = error => {
    console.error(error);
  };

  return (
    <div className="w-full flex-c-m m-b-50 overlay" style={{height: '100vh'}}>
      <Snackbar open={locFail} autoHideDuration={3000} onClose={handleClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert onClose={handleClose} severity="warning">
          Геопозиция не соответcвует {location}
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={3000} onClose={handleClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert onClose={handleClose} severity="error">
          Предоставьте доступ к вашей локации{location}
        </Alert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={3000} onClose={handleClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert onClose={handleClose} severity="error">
          Предоставьте доступ к вашей локации{location}
        </Alert>
      </Snackbar>
      {access ? (
        <div
          className="paper flex-col-c-m"
          data-aos="zoom-in-up"
          data-aos-delay="300"
          style={{
            width: '300px',
            padding: '40px',
            backgroundColor: '#fff',
            borderRadius: '10px'
          }}
        >
          {isLate ? (
            <img data-aos="flip-down" data-aos-delay="600" style={{width: '90px'}} src={RedCheck} alt="Late"/>
          ) : (
            <img data-aos="flip-down" data-aos-delay="600" style={{width: '90px'}} src={Check} alt="On time"/>
          )}
          <p className="fs-18 text-center m-t-30">{'Вы вошли в систему'}</p>
          <p className="fs-18">{shift}</p>
        </div>
      ) : (
        <QrReader delay={800} onError={handleError} onScan={handleScan} className="scanner"/>
      )}
    </div>
  );
};

export default Scanner;
