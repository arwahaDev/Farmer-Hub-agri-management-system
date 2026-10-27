import { createAsyncThunk } from "@reduxjs/toolkit";
import { addBuyer } from "../reducers/buyersReducer";

export const saveBuyer = createAsyncThunk(
  "buyers/saveBuyer",
  async (buyer, { dispatch, getState, rejectWithValue }) => {
    try {
      if (!buyer || typeof buyer !== "object") {
        return rejectWithValue("Valid buyer data is required.");
      }

      const buyers = getState().buyers || [];

      const buyerCnic = String(buyer.cnic || "").replace(/\D/g, "");

      if (buyerCnic) {
        const duplicate = buyers.some(
          (item) =>
            String(item.cnic || "").replace(/\D/g, "") === buyerCnic
        );

        if (duplicate) {
          return rejectWithValue("This CNIC already exists.");
        }
      }

      dispatch(addBuyer(buyer));

      return buyer;
    } catch (error) {
      return rejectWithValue(
        error.message || "Unable to save buyer."
      );
    }
  }
);