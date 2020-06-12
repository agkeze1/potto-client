const {
  REACT_APP_ID: key,
  REACT_APP_LOGO,
  REACT_APP_NAME,
  REACT_APP_FULL_NAME,
} = process.env;

export const GetAppName = (): string => REACT_APP_NAME || "";

export const GET_API_URL = () => process.env.REACT_APP_BASEURL;
export const GET_APP_ID = key || "potto";

export const GET_LOGO = REACT_APP_LOGO;
export const GET_FULL_NAME = REACT_APP_FULL_NAME;

export const CLEAN_DATE = (date: string): string => {
  if (date)
    return Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
      day: "2-digit",
      weekday: "short",
    }).format(new Date(date));
  return "";
};

export const CleanMessage = (message: string) =>
  message.replace("GraphQL error:", "").replace("Network error:", "");

export const DayString = (day: number): string => {
  if (day === 1) return "<label>1<sub>st</sub></label>";
  else if (day === 2) return "<label>2<sup>nd</sup></label>";
  else if (day === 3) return "<label>3<sup>rd</sup></label>";
  else if (day > 3) return `<label>${day}<sup>th</sup></label>`;
  else return "";
};

export const GetAge = (date: string): number => {
  const now = new Date();
  const birthDate = new Date(date);
  return now.getFullYear() - birthDate.getFullYear();
};

/**
 * Get timetable of a given period and day
 * @param day day
 * @param period period
 * @param timetables timetables
 * @param callback callback
 */
export const getTimetable = (
  day: string,
  period: any,
  timetables: [],
  callback: any
): any => {
  const { from_date, to_date } = period;
  if (timetables.length && day && period) {
    const item: any = timetables.find((a: any) => a.day === day);
    if (item) {
      const inner = item.timetable_list.find(
        (_inner: any) =>
          (_inner.period.from === from_date && _inner.period.to === to_date) ||
          _inner.period.to >= to_date
      );
      if (inner) return callback(inner);
    }
  }
  return callback(null);
};
