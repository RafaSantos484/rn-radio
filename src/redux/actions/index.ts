export type AlertInfo = { severity: string; message: string };

export const setAlertInfo = (payload: AlertInfo) => ({
  type: "SET_ALERT_INFO",
  payload,
});
export const resetAlertInfo = () => ({ type: "RESET_ALERT_INFO" });
