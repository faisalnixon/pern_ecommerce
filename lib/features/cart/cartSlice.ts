import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../store";

/* ==============================
   Types
================================ */
interface CartState {
  total: number;
  cartItems: Record<string, number>;
}

interface FetchCartResponse {
  cart: Record<string, number>;
}

/* ==============================
   Initial State
================================ */

const initialState: CartState = {
  total: 0,
  cartItems: {},
};

/* ==============================
   Debounce Timer (Frontend Safe)
================================ */

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/* ==============================
   Upload Cart
================================ */

export const uploadCart = createAsyncThunk<
  void,
  { getToken: () => Promise<string | null> },
  { state: RootState; rejectValue: string }
>("cart/uploadCart", async ({ getToken }, thunkAPI) => {
  try {
    // clearTimeout(debounceTimer)
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const { cartItems } = thunkAPI.getState().cart;

      const token = await getToken();
      if (!token) return;

      await axios.post(
        "/api/cart",
        { cart: cartItems },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    }, 1000);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Failed to upload cart",
    );
  }
});

/* ==============================
   Fetch Cart
================================ */

export const fetchCart = createAsyncThunk<
  FetchCartResponse,
  { getToken: () => Promise<string | null> },
  { rejectValue: string }
>("cart/fetch", async ({ getToken }, thunkAPI) => {
  try {
    const token = await getToken();
    if (!token) {
      return thunkAPI.rejectWithValue("No auth token");
    }
    const { data } = await axios.get("/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data as FetchCartResponse;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Failed to fetch cart",
    );
  }
});

/* ==============================
   Slice
================================ */

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ productId: string }>) => {
      const { productId } = action.payload;
      if (state.cartItems[productId]) {
        state.cartItems[productId]++;
      } else {
        state.cartItems[productId] = 1;
      }
      state.total += 1;

      //             state.cartItems[productId] =
      //     (state.cartItems[productId] || 0) + 1;

      //   state.total += 1;
    },
    removeFromCart: (state, action: PayloadAction<{ productId: string }>) => {
      const { productId } = action.payload;
      if (!state.cartItems[productId]) return;

      if (state.cartItems[productId]) {
        state.cartItems[productId]--;
        if (state.cartItems[productId] === 0) {
          delete state.cartItems[productId];
        }
      }
      state.total -= 1;

      //             state.cartItems[productId] -= 1;
      //   state.total -= 1;

      //   if (state.cartItems[productId] <= 0) {
      //     delete state.cartItems[productId];
      //   }
    },
    deleteItemFromCart: (
      state,
      action: PayloadAction<{ productId: string }>,
    ) => {
      const { productId } = action.payload;
      state.total -= state.cartItems[productId]
        ? state.cartItems[productId]
        : 0;
      delete state.cartItems[productId];

      //             const quantity = state.cartItems[productId] || 0;

      //   state.total -= quantity;
      //   delete state.cartItems[productId];
    },
    clearCart: (state) => {
      state.cartItems = {};
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cartItems = action.payload.cart;
      state.total = Object.values(action.payload.cart).reduce(
        (acc, quantity) => acc + quantity,
        0,
      );
    });
  },
});

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
