import { AlertInfo } from "../actions/index";

type Action = { type: string; payload: AlertInfo | undefined };

const alertComponentReducer = (
  state: AlertInfo = { message: "", severity: "" },
  action: Action
) => {
  switch (action.type) {
    case "SET_ALERT_INFO":
      return action.payload;
    case "RESET_ALERT_INFO":
      return { message: "", severity: "" };
    default:
      return state;
  }
};

export default alertComponentReducer;
