import { createAsyncThunk } from "@reduxjs/toolkit";
import storageApi from "../../apii/storageApi";

import { setCrops } from "../reducers/cropsReducer";
import { setOrders } from "../reducers/ordersReducer";
import { setBuyers } from "../reducers/buyersReducer";
import { setTasks } from "../reducers/tasksReducer";
import { setExpenses } from "../reducers/expensesReducer";
import { setInventory } from "../reducers/inventoryReducer";

export const loadFromStorage = createAsyncThunk(
  "storage/loadFromStorage",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const crops = storageApi.get("agri_crops", []);
      const orders = storageApi.get("agri_orders", []);
      const buyers = storageApi.get("agri_buyers", []);
      const tasks = storageApi.get("agri_tasks", []);
      const expenses = storageApi.get("agri_expenses", []);
      const inventory = storageApi.get("agri_inventory", []);

      dispatch(setCrops(crops));
      dispatch(setOrders(orders));
      dispatch(setBuyers(buyers));
      dispatch(setTasks(tasks));
      dispatch(setExpenses(expenses));
      dispatch(setInventory(inventory));

      return true;
    } catch (error) {
      return rejectWithValue(
        error.message || "Unable to load saved data."
      );
    }
  }
);