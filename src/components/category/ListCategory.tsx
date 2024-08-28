'use client';

import { getAllCategoryApi } from "@/api/category";
import { CategoryModel } from "@/models/category";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { ROUTE } from "@/constants/enum";
import { useRouter } from "next/navigation";

const ListCategory = () => {

    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await getAllCategoryApi();
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch category data', error);
            }
        };

        fetchCategoryData();
    }, []);

    const handleScrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const handleGetProductByCategory = (categoryId: any, title: any) => {
        router.push(`${ROUTE.CATEGORY}/${categoryId}&${title}`);
    }

    return (
        <>
            <div className="relative w-full py-8">
                <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 p-2 border rounded-full hidden sm:block"
                    onClick={handleScrollLeft}
                >
                    <ChevronLeft />
                </button>
                <div
                    ref={scrollContainerRef}
                    className="flex flex-row justify-between items-center whitespace-nowrap overflow-y-hidden overflow-x-scroll sm:overflow-x-hidden sm:px-10"
                >
                    {categories && categories.length > 0 && categories.map((category) => {
                        let imageBase64 = '';
                        if (category.image) {
                            imageBase64 = Buffer.from(category.image, 'base64').toString('binary');
                        }

                        return (
                            <div
                                key={category.id}
                                className="cursor-pointer hover:underline"
                                onClick={() => handleGetProductByCategory(category.id, category.title)}

                            >
                                <div className="flex flex-col items-center px-4">
                                    <img
                                        src={imageBase64}
                                        alt={category.title}
                                        className="rounded-md h-6 w-auto bg-no-repeat bg-center bg-cover"
                                    />
                                    <h2 className="text-base font-semibold truncate">{category.title}</h2>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 p-2 border rounded-full hidden sm:block"
                    onClick={handleScrollRight}
                >
                    <ChevronRight />
                </button>
            </div>
        </>
    );
}

export default ListCategory;