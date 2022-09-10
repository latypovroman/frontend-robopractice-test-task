export const calculateTime = ({ Start, End }) => {
  let hours = Number(End.slice(0, 2)) - Number(Start.slice(0, 2));
  let minutes = Number(End.slice(-2)) - Number(Start.slice(-2));

  if (minutes < 0) {
    minutes = minutes > -51 ? minutes + 60 : `0${minutes + 60}`;
    hours -= 1;
  } else if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  const totalMinutes = hours * 60 + Number(minutes);
  const cellTime = `${hours}:${minutes}`;
  return { cellTime, totalMinutes };
};

const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

export const daysCount = daysInMonth(5, 2021);
