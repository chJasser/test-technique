import { combineReducers } from "redux";
import authSilce from "./silces/AuthSilce";
import TaskSlice from "./silces/TaskSlice";
const reducers = combineReducers({
  authSilce,
  TaskSlice,
});
export default reducers;
