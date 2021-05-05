import { db } from "./firebase";
import { getTodayData } from "./helpers/functions";

export const SERVER_TIME_API = process.env.REACT_APP_SERVER_TIME_API;

const getDateFromDb = async (date) => {
	const dayRef = await db
		.collection("users_visits")
		.where("date", "==", date)
		.get()
		.catch((error) => console.log(error));

	return await dayRef.docs[0].ref;
};

export const checkShift = async (userId) => {
	const currentDate = getTodayData();

	const userRef = await getDateFromDb(currentDate);

	return userRef
		.collection("users")
		.doc(userId)
		.get()
		.then((doc) => doc.data());
};

export const getCurrentTimeStamp = async () => {
	return await fetch(SERVER_TIME_API)
		.then((res) => res.json())
		.then((data) => new Date(data.fulldate))
		.catch((e) => {
			console.log(e);
		});
};

export const setShiftToDb = async (date, userData) => {
	const currentDate = getTodayData();

	const userRef = await getDateFromDb(currentDate);

	return userRef.collection("users").doc(userData.uid).update(userData);
};

export const getUserData = async (userId) => {
	return await db
		.doc("/users/" + userId)
		.get()
		.then((doc) => doc.data());
};
