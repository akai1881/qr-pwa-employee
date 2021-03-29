import { db } from './firebase';

const getDateFromDb = async (date) => {
  const dayRef = await db.collection('shifts').where('date', '==', date).get();
  const userRef = await dayRef.docs[0].ref;
  return userRef;
};

export const checkShift = async (date, userId) => {
  const userRef = await getDateFromDb(date);
  return userRef
    .collection('users')
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data();
      } else {
        return false;
      }
    });
};

export const setShiftToDb = async (date, userData) => {
  const userRef = await getDateFromDb(date);

  return userRef.collection('users').doc(userData.uid).set(userData);
};

export const getUserData = async (userId) => {
  const userData = await db
    .collection('users')
    .doc(userId)
    .get()
    .then((doc) => doc.data());

  console.log('THIS USER DATA', userData);

  return userData;
};
