import axios from 'axios';
import { addressDummyData } from '../../../assets/assets'
// import { addressDummyData } from '@/assets/assets'
import { createAsyncThunk, createSlice ,PayloadAction} from "@reduxjs/toolkit"; // reduxjs/toolkit is used for storing data globally and managing state in a more efficient way.

/* =========================
   Types (Based on Prisma)
========================= */

export interface Address {
  id: string;
  userId: string;
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  createdAt: string; // DateTime comes as string from API
}


/* =========================
   Thunk Argument Type
========================= */

interface FetchAddressArgs {
  getToken: () => Promise<string>;
}


// interface FetchAddressArgs {
//   getToken(): string;
// }

/* =========================
   Async Thunk
========================= */
export const fetchAddress = createAsyncThunk<
  Address[],          // Return type
  FetchAddressArgs,   // Argument type
  { rejectValue: any } // Reject type
>('address/fetchAddress',
    async ({getToken},thunkAPI)=>{
        try {
            const token = await getToken()
            const {data} = await axios.get('/api/address',{headers:{
            Authorization:`Bearer ${token}`}})

            return data ? data.addresses : []
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Error")
        }
    }
)


/* =========================
   Slice State Type
========================= */
interface AddressState {
  list: Address[];
}


/* =========================
   Slice
========================= */
const initialState: AddressState = {
  list: [],
};


const addressSlice = createSlice({
    name: 'address',
    // initialState: {
    //     list: [],
    // }
    initialState,
    reducers: {
        addAddress: (state, action) => {
            state.list.push(action.payload)
        },
    },
    extraReducers:(builder)=>{
    builder.addCase(fetchAddress.fulfilled,(state,action)=>{
        state.list = action.payload
    })}
})

export const { addAddress } = addressSlice.actions

export default addressSlice.reducer