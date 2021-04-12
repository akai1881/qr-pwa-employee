
const minutesOfDay = time => time.getMinutes() + time.getHours() * 60;

export const compareTime = (currentTime, userTime) => minutesOfDay(currentTime) > minutesOfDay(userTime);

export const shiftStartedTime = time => {
  return `${time.toJSON().slice(0, 10).split('-').reverse().join('/')} ${time.toLocaleTimeString()}`;
};

export const parseScanData = data => {
  try {
    return JSON.parse(data);
  } catch (e) {
    if (e instanceof SyntaxError) {
      return false;
    }
  }
};

export const getTodayData = () => {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0];
};


export const countMinutesLate = (currentTime, userTime) => minutesOfDay(currentTime) - minutesOfDay(userTime);
