const { REACT_APP_ID: key, REACT_APP_LOGO, REACT_APP_NAME, REACT_APP_FULL_NAME } = process.env;

export const GetAppName = (): string => REACT_APP_NAME || "";

export const GET_API_URL = () => process.env.REACT_APP_BASEURL;
export const GET_APP_ID = () => key || "potto";

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
