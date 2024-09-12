'use client';

import { getProductByIdApi } from "@/api/product";
import { ProductModel } from "@/models/product";
import { useEffect, useState } from "react";
import Image from 'next/image';
import defaultImage from '@/public/no-image.jpg';
import { getAllScheduleByUserId } from "@/api/schedule";
import useAuth from "@/hooks/useAuth";
import { ScheduleModel } from "@/models/schedule";
import { ROUTE } from "@/constants/enum";
import { useRouter } from "next/navigation";
import LoadingPage from "@/app/loading";
import Link from 'next/link';

const Trip = () => {
    const { user, loading } = useAuth();
    const [products, setProducts] = useState<Record<number, ProductModel>>({});
    const [schedules, setSchedules] = useState<ScheduleModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push(ROUTE.HOME);
        }

        const fetchScheduleData = async () => {
            try {
                if (user) {
                    setIsLoading(true);
                    const scheduleResponse = await getAllScheduleByUserId(user.id);
                    const schedulesData = scheduleResponse.data;
                    setSchedules(schedulesData);

                    const productPromises = schedulesData.map(async (schedule: ScheduleModel) => {
                        return await getProductByIdApi(schedule.productId);
                    });
                    const productResponses = await Promise.all(productPromises);

                    const productsMap = productResponses.reduce((acc: Record<number, ProductModel>, response) => {
                        acc[response.data.id] = response.data;
                        return acc;
                    }, {});

                    setProducts(productsMap);
                }
            } catch (error) {
                console.error('Failed to fetch schedule or product data', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchScheduleData();
        }
    }, [user, loading]);

    const pendingSchedules = schedules.filter(schedule => schedule.status === 'pending');
    const acceptSchedules = schedules.filter(schedule => schedule.status === 'accept');

    const getImageSrc = (imageData: string | undefined) => {
        if (!imageData) return defaultImage.src;
        try {
            return Buffer.from(imageData, 'base64').toString('binary');
        } catch {
            return defaultImage.src;
        }
    };

    const ScheduleCard = ({ schedule, statusText }: { schedule: ScheduleModel; statusText: string }) => {
        const product = products[schedule.productId];
        const imageSrc = getImageSrc(product?.imageProductData?.[0]?.image);
        const formattedPrice = product?.price ?? "0";
        const pricePerNight = Number(formattedPrice.replace(/[^\d.-]/g, ''));
        const provisional = pricePerNight * schedule.numberOfDays;
        const serviceCharge = provisional * 0.2;
        const totalAmount = provisional + serviceCharge;
        const formattedTotalAmount = totalAmount.toLocaleString();

        return (
            <div className="mb-10 flex flex-col sm:flex-row items-center border rounded-md shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105">
                <div className="h-[200px] w-full sm:h-[300px] sm:w-[50%]">
                    <Image
                        src={imageSrc}
                        alt={product?.title || 'Product Image'}
                        width={600}
                        height={300}
                        style={{ width: '100%', height: '100%' }}
                        className="object-cover rounded-t-md sm:rounded-t-none sm:rounded-l-md shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div className="pl-5 py-4 w-full">
                    <h2 className="text-xl font-semibold truncate">{product?.title}</h2>
                    <h2 className="text-lg text-[#6a6a6a]">Chủ nhà: {product?.userProductData?.name}</h2>
                    <h2 className="text-lg font-semibold">{product?.price} VND/đêm</h2>
                    <h2>Ngày: {schedule.startDate} - {schedule.endDate}</h2>
                    <h2>Số đêm: {schedule.numberOfDays} đêm</h2>
                    <h2>Khách: {schedule.guestCount} người</h2>
                    <h2 className="text-base sm:text-lg border-t pt-4 font-semibold flex justify-between">
                        Tổng thanh toán: {formattedTotalAmount} VND
                    </h2>
                    <h2>{statusText}</h2>
                </div>
            </div>
        );
    };

    return (
        <div className="py-8 flex flex-col">
            {isLoading ? (
                <LoadingPage />
            ) : (
                <>
                    {schedules.length > 0 ? (
                        <>
                            <div className="text-xl sm:text-3xl font-semibold mb-10">Đã duyệt</div>
                            {acceptSchedules.map(schedule => (
                                <ScheduleCard key={schedule.id} schedule={schedule} statusText="(Đã thanh toán)" />
                            ))}
                            <div className="text-xl sm:text-3xl font-semibold my-10">Đang chờ xử lý</div>
                            {pendingSchedules.map(schedule => (
                                <ScheduleCard key={schedule.id} schedule={schedule} statusText="(Chỉ trừ tiền khi đã duyệt)" />
                            ))}
                        </>
                    ) : (
                        <div className="text-center ">
                            <div className="text-lg sm:text-xl font-semibold pb-8">Bạn chưa có lịch trình nào</div>
                            <Link href="/">
                                <span className="text-xl sm:text-3xl font-semibold text-primary">Quay lại trang home để thêm hành trình mới</span>
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );

};

export default Trip;
