const minutesOfDay = (time) => time.getMinutes() + time.getHours() * 60;

export const compareTime = (time, init) => minutesOfDay(time) > init;

export const shiftStartedTime = (time) => {
  return `${time
    .toJSON()
    .slice(0, 10)
    .split('-')
    .reverse()
    .join('/')} ${time.toLocaleTimeString()}`;
};

export const parseScanData = (data) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    if (e instanceof SyntaxError) {
      return false;
    }
  }
};

export const getTodaysData = () => new Date().toJSON().slice(0, 10);
