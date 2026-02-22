import { createAsyncThunk, createSlice ,PayloadAction} from "@reduxjs/toolkit"; // reduxjs/toolkit is used for storing data globally and managing state in a more efficient way.

import { productDummyData } from "../../../assets/assets";
import axios from "axios";


import type { Product, Rating, Store } from "../../../src-db/generated/prisma";

export interface ProductWithRelations extends Product {
  rating?: Rating[];
  store?: Store;
}


/* =========================
   Define State Type
========================= */
interface ProductState {
  list: Product[];
  loading: boolean;
  error: string | null;
}

export const fetchProducts = createAsyncThunk<
  Product[],                  // return type
  { storeId?: string },       // argument type
  { rejectValue: string }     // error type
>(
  //createAsyncThunk is used for creating asynchronous actions that can be dispatched to the store. It takes two arguments: a string that represents the action type and a function that returns a promise.

  "product/fetchProducts", // its like new api call for this function.  it will be used in the reducer.. and reducer will be used within the component to get the data from the store.

  async ({ storeId }: { storeId?: string }, thunkAPI) => {
    //thunkAPI is used for dispatching actions and getting the current state of the store. it has several methods like dispatch, getState, rejectWithValue, etc. we can use these methods to dispatch actions and get the current state of the store.

    try {
      const { data } = await axios.get(
        "/api/products" + (storeId ? `?storeId=${storeId}` : ""),
      );
      return data.products as Product[];
    } catch (error :any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch products");
    }
  },
);


const initialState: ProductState = {
  list: [],
  loading: false,
  error: null,
};
const productSlice = createSlice({
  //createSlice is used for creating a slice of the store. It takes an object as an argument that contains the name of the slice, the initial state, and the reducers.
  name: "product",
  
  // initialState: {
  //   list: [],
  // },
  initialState 
,
  
  
  reducers: {
    //reducers are used for defining the actions that can be dispatched to the store. They take the current state and an action as arguments and return the new state.

    setProduct: (state, action: PayloadAction<Product[]>) => {
      // action is an object that contains the type of the action and the payload. The payload is the data that is passed to the reducer when the action is dispatched.
      state.list = action.payload;
    },
    clearProduct: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    //extraReducers is used for handling the actions that are created by createAsyncThunk. It takes a builder as an argument that is used for adding cases to the reducer.

    builder
     .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(fetchProducts.fulfilled, (state, action) => {
      //addCase is used for adding a case to the reducer. It takes two arguments: the action type and a function that takes the current state and the action as arguments and returns the new state.
      state.loading = false;
      state.list = action.payload;
    })
    .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });;
  },
});

export const { setProduct, clearProduct } = productSlice.actions;

export default productSlice.reducer;
