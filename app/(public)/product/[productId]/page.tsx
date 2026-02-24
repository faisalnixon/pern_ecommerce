'use client'
import ProductDescription from "../../../../components/ProductDescription";
// import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "../../../../components/ProductDetails";
// import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../lib/store";
import type { Product, Rating, Store } from "../../../../src-db/generated/prisma";

import type { ProductWithRelations } from "../../../../types/product";


export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState<ProductWithRelations | null>(null);
    const products = useSelector((state: RootState) => state.product.list) as ProductWithRelations[];
     // use Selector is an react-redux hook that allows us to access the state from the redux store 

    const fetchProduct = async () => { 
        const product = products.find((product) => product.id === productId);
        setProduct(product ?? null);
    }

    useEffect(() => {
        if (products.length > 0) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [productId,products]);

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrums */}
                <div className="  text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product?.category}
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}
            </div>
        </div>
    );
}



