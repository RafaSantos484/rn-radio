type Radio = {}; //temp

export type AlertInfo = { severity: string; message: string };
export type User =
  | {
      id: string;
      name: string;
      favorites: Array<Radio>;
      history: Array<Radio>;
      isAnonymous: boolean;
    }
  | { isAnonymous: boolean, history: Array<Radio> };

export const setAlertInfo = (payload: AlertInfo) => ({
  type: "SET_ALERT_INFO",
  payload,
});
export const resetAlertInfo = () => ({ type: "RESET_ALERT_INFO" });

export const setUser = (payload: User | null) => ({
  type: "SET_USER",
  payload,
});
