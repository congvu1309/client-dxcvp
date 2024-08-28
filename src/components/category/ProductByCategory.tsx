'use client';

import { getAllProductApi } from "@/api/product";
import { ROUTE } from "@/constants/enum";
import { ProductModel } from "@/models/product";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import defaultImage from '@/public/no-image.jpg';
import Image from 'next/image';
import { getAllProductByCategoryApi } from "@/api/category";
import LoadingPage from "@/app/loading";

const ProductByCategory = () => {
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [searchProduct, setSearchProduct] = useState('');
    const router = useRouter();
    const params = useParams();
    const id = parseInt(params.id as string, 10);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await getAllProductByCategoryApi(id);
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch product data', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    const filteredProduct = products
        .filter(product => product.title.toLowerCase().includes(searchProduct.toLowerCase()))
        .reverse();

    const handleViewDetailProduct = (productId: any) => {
        router.push(`${ROUTE.DETAIL_PRODUCT}/${productId}`);
    }

    return (
        <div className="pb-8">
            {isLoading ? (
                <LoadingPage />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProduct.length > 0 ? filteredProduct.map((product) => {
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
                                    onClick={() => handleViewDetailProduct(product.id)}
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
                        }) :
                            <div className="text-2xl font-semibold mb-4">Hiện chưa có dịch vụ</div>
                        }
                    </div>
                </>
            )}
        </div>
    );
}


export default ProductByCategory;
