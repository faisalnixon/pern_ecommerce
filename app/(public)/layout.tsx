'use client'
import {ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useUser } from "@clerk/nextjs";

import Banner from "../../components/Banner";
// import Banner from "@/components/Banner";
import Navbar from "../../components/Navbar";
// import Navbar from "@/components/Navbar";
import Footer from "../../components/Footer";
// import Footer from "@/components/Footer";

import {fetchProducts} from "../../lib/features/product/productSlice"
import { fetchCart, uploadCart } from "../../lib/features/cart/cartSlice";

import type { RootState, AppDispatch } from "../../lib/store";
import { fetchAddress } from "../../lib/features/address/addressSlice";
import { fetchUserRatings } from "../../lib/features/rating/ratingSlice";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {

    const dispatch = useDispatch<AppDispatch>();

    const {user} = useUser()
    const {getToken} = useAuth()

    const {cartItems} = useSelector((state: RootState)=>state.cart)

    useEffect(() => {
        dispatch(fetchProducts({})) //dispatching fetchProducts action to fetch products when the component mounts. and passes to children. on children components we can use useSelector to access the products from the store / global state under the name of state.product.list . . and we can use the products to display them on the UI.
    }, [dispatch]);

    useEffect(()=>{
        if(user){
            dispatch(fetchCart({getToken}))
            dispatch(fetchAddress({getToken}))
            dispatch(fetchUserRatings({getToken}))
        }
    },[user, dispatch, getToken])

     useEffect(()=>{
        if(user){
            dispatch(uploadCart({getToken}))
        }
    },[cartItems, user, dispatch, getToken])
    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
