import { User } from "../actions";

type Action = { type: string; payload: User | null };

const userReducer = (state: User | null = null, action: Action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    default:
      return state;
  }
};

export default userReducer;
