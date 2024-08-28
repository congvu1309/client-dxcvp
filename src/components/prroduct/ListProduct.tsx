'use client';

import { getAllProductApi } from "@/api/product";
import { ROUTE } from "@/constants/enum";
import { ProductModel } from "@/models/product";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import defaultImage from '@/public/no-image.jpg';
import Image from 'next/image';

const ListProduct = () => {

    const [products, setProducts] = useState<ProductModel[]>([]);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchProductData = async (page: number) => {
            try {
                const response = await getAllProductApi(page);
                setProducts(response.data.product);
                const totalCount = response.data.totalCount;
                const totalPagesCount = Math.ceil(totalCount / 20);
                setTotalPages(totalPagesCount);
            } catch (error) {
                console.error('Failed to fetch product data', error);
            }
        };

        fetchProductData(currentPage);
    }, [currentPage]);

    const filteredProduct = products
        .filter(product => product.status === 'S1')
        .reverse();

    const handleViewDetailProduct = (productId: any, title: any) => {
        router.push(`${ROUTE.DETAIL_PRODUCT}/${productId}&${title}`);
    }

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <div className="pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProduct.length > 0 && filteredProduct.map((product) => {
                        let imageSrc = defaultImage.src;
                        const imageProductData = product.imageProductData?.[0];

                        if (imageProductData?.image) {
                            try {
                                imageSrc = Buffer.from(imageProductData.image, 'base64').toString('binary');
                            } catch (error) {
                                imageSrc = defaultImage.src;
                            }
                        }

                        return (
                            <div
                                key={product.id}
                                className='cursor-pointer'
                                onClick={() => handleViewDetailProduct(product.id, product.title)}
                            >
                                <div className="h-[250px] w-auto">
                                    <Image
                                        src={imageSrc}
                                        alt={product.title}
                                        width={400}
                                        height={400}
                                        style={{ width: '100%', height: '100%' }}
                                        className='rounded-md bg-no-repeat bg-center bg-cover'
                                    />
                                </div>
                                <div className="p-2">
                                    <h2 className='text-xl font-semibold truncate'>{product.title}</h2>
                                    <h2 className='text-lg text-[#6a6a6a] '>Chủ nhà: {product.userProductData.name}</h2>
                                    <h2 className='text-lg font-semibold'>{product.price} VND/đêm</h2>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Pagination Controls */}
            <div className='flex justify-end mb-8'>
                <nav className='block'>
                    <ul className='flex pl-0 rounded list-none flex-wrap'>
                        {Array.from(Array(totalPages > 0 ? totalPages : 1).keys()).map((index) => (
                            <li key={index}>
                                <button
                                    onClick={() => goToPage(index + 1)}
                                    className={`px-3 py-1 mx-1 rounded focus:outline-none ${currentPage === index + 1
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-gray-200'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default ListProduct;