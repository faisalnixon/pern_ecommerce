'use client'
import Banner from "../../components/Banner";
// import Banner from "@/components/Banner";
import Navbar from "../../components/Navbar";
// import Navbar from "@/components/Navbar";
import Footer from "../../components/Footer";
// import Footer from "@/components/Footer";

export default function PublicLayout({ children }) {

    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
