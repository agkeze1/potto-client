export const GetAppName = (): string => "SpacoSpy";

export const GET_API_URL = () => process.env.REACT_APP_BASEURL;

export const CLEAN_DATE = (date: string): string => {
  if (date)
    return Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
      day: "2-digit",
      weekday: "short"
    }).format(new Date(date));
  return "";
};
