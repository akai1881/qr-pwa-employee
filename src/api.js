import {db} from "./firebase";
import {getTodayData} from "./helpers/functions";

export const SERVER_TIME_API = process.env.REACT_APP_SERVER_TIME_API;

const getDateFromDb = async (date) => {
    console.log(date)
    const dayRef = await db
        .collection("shifts")
        .where("date", "==", date)
        .get()
        .catch((error) => console.log(error));

    console.log(dayRef, 'this is ref')
    return await dayRef.docs[0].ref;
};

export const checkShift = async (userId) => {
    const currentDate = getTodayData();

    const userRef = await getDateFromDb(currentDate);

    return userRef
        .collection("users")
        .doc(userId)
        .get()
        .then((doc) => {
            console.log(doc.data())
            return doc.data()
        });
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

    return userRef.collection("users").doc(userData.id).update(userData);
};

export const getUserData = async (userId) => {
    return await db
        .doc("/users/" + userId)
        .get()
        .then((doc) => doc.data());
};
