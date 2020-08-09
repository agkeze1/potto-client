const {
  REACT_APP_ID: key,
  REACT_APP_LOGO,
  REACT_APP_NAME,
  REACT_APP_FULL_NAME,
} = process.env;

export const GetAppName = (): string => REACT_APP_NAME || "";

export const GET_API_URL = () => process.env.REACT_APP_BASEURL;
export const GET_APP_ID = key || "potto";

export const GET_LOGO = REACT_APP_LOGO || "/logo192.png";
export const GET_FULL_NAME = REACT_APP_FULL_NAME;

export const CLEAN_DATE = (date: string): string => {
  if (date)
    return Intl.DateTimeFormat("en-GB", {
      month: "short",
      year: "numeric",
      day: "2-digit",
      weekday: "short",
    }).format(new Date(date));
  return "";
};

export const CLEAN_DATE_TIME = (date: string): string => {
  if (date)
    return Intl.DateTimeFormat("en-GB", {
      month: "short",
      year: "numeric",
      day: "2-digit",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
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
          (_inner.period.to >= to_date && _inner.period.from <= from_date)
      );
      if (inner) return callback(inner);
    }
  }
  return callback(null);
};

export const GetTimeDifference = (from: string, second: string): string => {
  const _first = new Date(from).getTime();
  const _second = new Date(second).getTime();
  const diff = _second - _first;
  const _date = new Date(diff);
  return `${_date.getHours()}H:${_date.getMinutes()}M`;
};

export const cleanDate = (date: string, onlyDate = false, short = true) =>
  onlyDate
    ? Intl.DateTimeFormat("en", {
        month: short ? "short" : "long",
        year: "numeric",
        weekday: short ? "short" : "long",
        day: "numeric",
      }).format(new Date(date))
    : Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
        month: short ? "short" : "long",
        year: "numeric",
        weekday: short ? "short" : "long",
        day: "numeric",
      }).format(new Date(date));
/**
 * Expansion / Show side nav and header
 */
export const ToggleExpansion = () => {
  const sideNav = document.getElementById("sideNav");
  const header = document.getElementById("header");

  //Toggle sideNav visibility
  if (sideNav) {
    if (sideNav.style.display === "none") {
      sideNav.style.display = "block";
    } else {
      sideNav.style.display = "none";
    }
  }

  // Toggle header visibility
  if (header) {
    if (header.style.display === "none") {
      header.style.display = "block";
    } else {
      header.style.display = "none";
    }
  }
};

export const scrollTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};
/**
 *
 * @param attResult Attendance result to be ordered
 */
export const OrderTimetableByDay = (ttResult: Array<any>) => {
  if (ttResult) {
    const result: any[] = [];
    ttResult.forEach((att: any) => {
      if (att.day === "MON") result[0] = att;
      else if (att.day === "TUE") result[1] = att;
      else if (att.day === "WED") result[2] = att;
      else if (att.day === "THUR") result[3] = att;
      else if (att.day === "FRI") result[4] = att;
      else if (att.day === "SAT") result[5] = att;
    });
    return result;
  }
  return null;
};

/**
 * Convert minute to hour and minutes
 * @param minutes total minutes
 */
export const toPrettyTime = (minutes: number): string => {
  if (minutes) {
    return `${Math.floor(minutes / 60)}h : ${Math.floor(minutes % 60)}m`;
  }
  return "";
};

/**
 * Gets a single value of a given key
 * @param name query key
 * @param url path
 */
export const GetParamFromQuery = (name: string, url?: string): string => {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) {
    return "";
  }
  if (!results[2]) {
    return "";
  }
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const LocalDate = (date: string): string => {
  const _date: any = new Date(date);
  const _d = new Date(_date.toGMTString() + "+2");
  return _d.toLocaleString();
};
