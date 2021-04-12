import React, {useEffect, useState} from 'react';
import QrReader from 'react-qr-reader';
import {
  compareTime,
  shiftStartedTime,
  parseScanData,
  countMinutesLate
} from '../helpers/functions.js';
import {checkShift, getUserData, setShiftToDb, getCurrentTimeStamp} from '../api';
import RedCheck from '../assets/images/check_red.svg';
import Check from '../assets/images/check.svg';
import Spinner from '../components/Spinner';
import AOS from 'aos';

AOS.init();

const Scanner = ({user}) => {
  const [access, setAccess] = useState(false);
  const [loader, setLoader] = useState(true);
  const [userData, setUserData] = useState({});
  const [shift, setShift] = useState('');
  const [isLate, setIsLate] = useState(false);

  useEffect(() => {
    // check if user already shifted
    if (user) {
      fetchUser().then(() => console.log('success'));
    }
    checkUserShift().then(() => console.log('success'));
  }, []);

  async function checkUserShift() {
    try {
      const res = await checkShift(user.uid);
      console.log(res);
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

  const handleScan = async result => {
    if (!result) return;

    const permission = parseScanData(result);

    console.log('this is user data', userData)

    let date = new Date();

    if (!permission) {
      return;
    }
    setLoader(true);
    let is_late = false;
    let minutesLate = 0;
    try {
      date = await getCurrentTimeStamp();
      console.log(date)
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
      isLate: is_late,
      minutesLate
    };

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

  const handleError = error => {
    console.error(error);
  };

  return (
    <div className="w-full flex-c-m m-b-50 overlay" style={{height: '100vh'}}>

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
