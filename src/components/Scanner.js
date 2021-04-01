import React, { useEffect, useState } from 'react';
import QrReader from 'react-qr-reader';
import CheckLogo from './CheckLogo';
import {
	compareTime,
	shiftStartedTime,
	parseScanData,
	convertToMinutes,
	countMinutesLate
} from '../helpers/functions.js';
import { checkShift, getUserData, setShiftToDb } from '../api';
import RedCheck from '../assets/images/check_red.svg';
import Check from '../assets/images/check.svg';
import Spinner from '../components/Spinner';
import AOS from 'aos';

AOS.init();

const Scanner = ({ user }) => {
	const [access, setAccess] = useState(false);
	const [loader, setLoader] = useState(true);
	const [userData, setUserData] = useState(null);
	const [shift, setShift] = useState('');
	const [dueTime, setDueTime] = useState('10:00:00');
	const [isLate, setIsLate] = useState(false);

	useEffect(() => {
		// check if user already shifte
		if (user) {
			fetchUser();
		}
		checkUser();
		return;
	}, []);

	async function checkUser() {
		console.log('respond');
		const res = await checkShift(user.uid);
		if (res) {
			setLoader(false);
			setShift(shiftStartedTime(res.date.toDate()));
			setIsLate(res.isLate);
			setAccess(true);
			console.log('logged');
		} else {
			setLoader(false);
		}
	}

	async function fetchUser() {
		const userData = await getUserData(user.uid);
		setUserData({
			email: user.email,
			uid: user.uid,
			firstName: userData.firstName,
			lastName: userData.lastName,
			role: userData.role,
			department: userData.department.name,
			phone: userData.phone1,
			dueTime: userData.dueTime || '10:00:00'
		});
		setDueTime(userData.dueTime);
		return;
	}

	const handleScan = result => {
		if (!result) return;

		const permission = parseScanData(result);

		if (permission) {
			const date = new Date();
			setShift(shiftStartedTime(date));

			let is_late = false;
			let minutesLate = '';

			const dueTime = convertToMinutes(userData.dueTime);

			if (compareTime(date, dueTime)) {
				is_late = true;
			}

			if (is_late) {
				setIsLate(true);
				minutesLate = countMinutesLate(date, dueTime);
			}

			const userShift = {
				...userData,
				date,
				isLate: is_late,
				minutesLate
			};

			// Push shift to firestore
			setShiftToDb(date, userShift).then(() => {
				setAccess(true);
			});
		}
	};

	if (loader) {
		return (
			<div className="loader-container">
				<Spinner loader={loader} />;
			</div>
		);
	}

	const handleError = error => {
		console.error(error);
	};
	return (
		<div className="w-full flex-c-m m-b-50 overlay" style={{ height: '100vh' }}>
			{access ? (
				<div
					className="paper flex-col-c-m"
					style={{
						width: '300px',
						padding: '40px',
						backgroundColor: '#fff',
						borderRadius: '10px'
					}}
				>
					{isLate ? (
						<img style={{ width: '90px' }} src={RedCheck} />
					) : (
						<img style={{ width: '90px' }} src={Check} />
					)}
					<p className="fs-18 text-center m-t-30">{'Вы вошли в систему'}</p>
					<p className="fs-18">{shift}</p>
				</div>
			) : (
				<QrReader delay={500} onError={handleError} onScan={handleScan} className="scanner" />
			)}
		</div>
	);
};

export default Scanner;
