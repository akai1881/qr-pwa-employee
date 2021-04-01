import { db } from './firebase';
import { getTodayData } from './helpers/functions';

const getDateFromDb = async date => {
	const dayRef = await db
		.collection('shifts')
		.where('date', '==', date)
		.get()
		.catch(error => console.log(error));

	return await dayRef.docs[0].ref;
};

export const checkShift = async userId => {
	const currentDate = getTodayData();

	const userRef = await getDateFromDb(currentDate);

	return userRef
		.collection('users')
		.doc(userId)
		.get()
		.then(doc => {
			if (doc.exists) {
				console.log(doc.data());
				return doc.data();
			} else {
				return false;
			}
		});
};

export const setShiftToDb = async (date, userData) => {
	const currentDate = getTodayData();

	const userRef = await getDateFromDb(currentDate);

	return userRef.collection('users').doc(userData.uid).set(userData);
};

export const getUserData = async userId => {
	return await db
		.collection('users')
		.doc(userId)
		.get()
		.then(doc => doc.data());
};
