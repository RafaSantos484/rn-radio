import { combineReducers } from "@reduxjs/toolkit";
import alertComponentReducer from "./alert-component-reducer";
import userReducer from "./user-reducer";

export default combineReducers({
  alertComponentReducer,
  userReducer,
});
