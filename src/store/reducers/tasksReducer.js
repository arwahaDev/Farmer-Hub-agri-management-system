import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      state.push(action.payload);
    },

    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      const task = state.find((item) => item.id === id);

      if (task) {
        Object.assign(task, updates);
      }
    },

    deleteTask: (state, action) => {
      return state.filter((task) => task.id !== action.payload);
    },

    setTasks: (state, action) => {
      return action.payload;
    },
  },
});

export const { addTask, updateTask, deleteTask, setTasks } =
  tasksSlice.actions;

export default tasksSlice.reducer;