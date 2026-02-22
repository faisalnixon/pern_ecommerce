import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Rating {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

interface FetchRatingsResponse {
  ratings: Rating[];
}
interface FetchUserRatingsArgs {
  getToken: () => Promise<string | null>;
}

export const fetchUserRatings = createAsyncThunk<Rating[], FetchUserRatingsArgs>(
  "rating/fetchUserRatings",
  async ({ getToken }, thunkAPI) => {
    try {
      const token = await getToken();
      const { data } = await axios.get<FetchRatingsResponse>("/api/rating", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data?data.ratings:[]
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
  },
);

const ratingSlice = createSlice({
  name: "rating",
  initialState: {
    ratings: [],
  },
  reducers: {
    addRating: (state, action) => {
      state.ratings.push(action.payload);
    },
  },
  extraReducers:(builder)=> {
      builder.addCase(fetchUserRatings.fulfilled,(state,action)=>{
        state.ratings = action.payload
      })
  },
});

export const { addRating } = ratingSlice.actions;

export default ratingSlice.reducer;
