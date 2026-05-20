// 'use client'
// import { Suspense } from "react"
// import ProductCard from "../../../components/ProductCard"
// // import ProductCard from "@/components/ProductCard"
// import { MoveLeftIcon } from "lucide-react"
// import { useRouter, useSearchParams } from "next/navigation"
// // import { useSelector } from "react-redux"
// import { useAppSelector } from "../../../lib/hooks"

//  function ShopContent() {

//     // get query params ?search=abc
//     const searchParams = useSearchParams()
//     const search = searchParams.get('search')
//     const router = useRouter()

//     const products = useAppSelector(state => state.product.list)

//     const filteredProducts = search
//         ? products.filter(product =>
//             product.name.toLowerCase().includes(search.toLowerCase())
//         )
//         : products;

//     return (
//         <div className="min-h-[70vh] mx-6">
//             <div className=" max-w-7xl mx-auto">
//                 <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"> {search && <MoveLeftIcon size={20} />}  All <span className="text-slate-700 font-medium">Products</span></h1>
//                 <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
//                     {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
//                 </div>
//             </div>
//         </div>
//     )
// }


// export default function Shop() {
//   return (
//     <Suspense fallback={<div>Loading shop...</div>}>
//       <ShopContent />
//     </Suspense>
//   );
// }





'use client'
import { Suspense } from "react"
import ProductCard from "../../../components/ProductCard"
import { MoveLeftIcon, SearchX } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppSelector } from "../../../lib/hooks"
import { ProductWithRelations } from "../../../lib/features/product/productSlice"

function ShopContent() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search')
  const router = useRouter()

  // Cast to ProductWithRelations so we can access .store and .category
  const products = useAppSelector(
    (state) => state.product.list
  ) as ProductWithRelations[]

  const filteredProducts = search
    ? products.filter((product) => {
        const q = search.toLowerCase()
        const matchesName     = product.name.toLowerCase().includes(q)
        const matchesCategory = product.category.toLowerCase().includes(q)
        const matchesStore    = product.store?.name?.toLowerCase().includes(q) ?? false
        return matchesName || matchesCategory || matchesStore
      })
    : products

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1
          onClick={() => router.push('/shop')}
          className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"
        >
          {search && <MoveLeftIcon size={20} />}
          All <span className="text-slate-700 font-medium">Products</span>
          {search && (
            <span className="ml-2 text-base text-slate-400">
              — results for &quot;<span className="text-slate-600">{search}</span>&quot;
            </span>
          )}
        </h1>

        {/* Search hint badges */}
        {search && (
          <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
            <span>Searching in:</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-full">Product name</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-full">Store name</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-full">Category</span>
          </div>
        )}

        {/* Results */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
            <SearchX size={48} strokeWidth={1.2} />
            <p className="text-lg">No products found for &quot;{search}&quot;</p>
            <button
              onClick={() => router.push('/shop')}
              className="mt-2 px-6 py-2 text-sm bg-slate-100 hover:bg-slate-200 transition rounded-full text-slate-600"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  )
}



