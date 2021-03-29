import React, { useEffect, useState } from 'react';
import QrReader from 'react-qr-reader';
import Spinner from './Spinner';
import {
  compareTime,
  shiftStartedTime,
  parseScanData,
  getTodaysData,
} from '../helpers/functions.js';
import { checkShift, getUserData, setShiftToDb } from '../api';
import { Backdrop, CircularProgress } from '@material-ui/core';

const LATE_TIME_IN_MINUTES = 610; // 10 AM in minutes

const Scanner = ({ user }) => {
  const [error, setError] = useState(false);
  const [access, setAccess] = useState(false);
  const [loader, setLoader] = useState(false);
  const [check, setCheck] = useState(true);
  const [userData, setUserData] = useState(null);
  const [shift, setShift] = useState('');

  useEffect(() => {
    //check if user already shifted
    const checkUser = async () => {
      const currentDate = getTodaysData();

      const res = await checkShift(currentDate, user.uid);
      if (res) {
        setAccess(true);
        setCheck(false);
        setShift(shiftStartedTime(res.date.toDate()));
        return;
      }
      console.log('no shift');
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUser = async () => {
        const userData = await getUserData(user.uid);
        setUserData({
          email: user.email,
          uid: user.uid,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          department: userData.department.name,
          phone: userData.phone1,
        });
      };

      fetchUser();
    }
  }, []);

  const handleScan = (result) => {
    if (!result) return;

    const permission = parseScanData(result);

    if (permission) {
      const date = new Date();
      setShift(shiftStartedTime(date));
      setLoader(true);

      let isLate = false;

      if (compareTime(date, LATE_TIME_IN_MINUTES)) {
        isLate = true;
      }

      const userShift = {
        ...userData,
        date,
        isLate,
      };

      const currentDate = getTodaysData();

      // Push shift to firestore
      setShiftToDb(currentDate, userShift).then(() => {
        setAccess(true);
        setLoader(false);
      });
    }
  };

  const handleError = (error) => {
    console.error(error);
  };
  return (
    <div className="w-full flex-c-m m-b-50 overlay" style={{ height: '100vh' }}>
      <Backdrop open={check}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {access ? (
        <QrReader
          delay={500}
          onError={handleError}
          onScan={handleScan}
          className="scanner"
        />
      ) : (
        <div
          className="paper flex-col-c-m"
          style={{
            width: '300px',
            padding: '40px',
            backgroundColor: '#fff',
            borderRadius: '10px',
          }}
        >
          <Spinner loader={loader} />
          <p className="fs-18 text-center m-t-30">
            {!loader && 'Вы вошли в систему'}
          </p>
          <p className="fs-18">{!loader && shift}</p>
        </div>
      )}
    </div>
  );
};

export default Scanner;
