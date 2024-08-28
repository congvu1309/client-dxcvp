'use client';

import ListCategory from "@/components/category/ListCategory";
import Footer from "@/components/navigation/Footer";
import Header from "@/components/navigation/Header";
import SearchProduct from "@/components/prroduct/SearchProduct";
import { useSearchParams } from "next/navigation";

export default function SearchResult() {

    const searchParams = useSearchParams();
    const searchProduct = searchParams.get('address');

    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <Header isHidden={true} />
            </div>
            <div className="container mx-auto px-4 grow">
                <ListCategory />
                <SearchProduct
                    searchProduct={searchProduct}
                />
            </div>
            <Footer />
        </div>
    );
}