import { createSlice } from "@reduxjs/toolkit";
import axios from "../../../axiosInstance";
let initialState = {
  tasks: [],
  selectedTask: {},
  errors: "",
  updateDialog: false,
};

const TaskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask(state, action) {
      state.tasks.push(action.payload);
    },
    deleteTask(state, action) {
      const payload = action.payload;
      const index = state.tasks.findIndex((item) => item._id === payload);
      if (index !== -1) {
        state.tasks.splice(index, 1);
      }
    },

    setTaskList(state, action) {
      state.tasks = action.payload;
    },
    setSelectedTask(state, action) {
      state.selectedTask = action.payload;
    },
    setErrors(state, action) {
      state.errors = action.payload;
    },
    setUpdateDialog(state, action) {
      state.updateDialog = action.payload;
    },
  },
});

export const removeTask = (id) => (dispatch) => {
  axios
    .delete(`/task/delete/${id}`)
    .then((res) => {
      dispatch(deleteTask(id));
    })
    .catch((err) => {
      dispatch(setErrors(err));
    });
};

export const fetchTasks = () => (dispatch) => {
  axios
    .get("/task")
    .then((res) => {
      dispatch(setTaskList(res.data.tasks));
    })
    .catch((err) => {
      dispatch(setErrors(err));
    });
};

export const { setTaskList, setErrors, setSelectedTask, addTask, deleteTask } =
  TaskSlice.actions;

export default TaskSlice.reducer;
