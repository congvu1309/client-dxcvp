'use client';

import { getProductByIdApi } from "@/api/product";
import { ProductModel } from "@/models/product";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Dot, CircleMinus, CirclePlus } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import DescriptionProduct from "./DesciptionProduct";
import Link from 'next/link';
import { UtilitiesModel } from "@/models/utilities";
import { getAllUtilitiesApi } from "@/api/utilities";
import UtilitiesProduct from "./UtilitiesProduct";
import { TIME_TS } from "@/constants/time";
import dynamic from 'next/dynamic';
import { DateRange } from 'react-date-range';
import { addDays, differenceInDays, isBefore, format, eachDayOfInterval, parse } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { vi } from 'date-fns/locale';
import { ROUTE } from "@/constants/enum";
import useAuth from "@/hooks/useAuth";
import Login from "../auth/Login";
import Register from "../auth/Register";
import { ScheduleModel } from "@/models/schedule";
import { getAllScheduleByProductId } from "@/api/schedule";

const MapProduct = dynamic(() => import('./MapProduct'), { ssr: false });

const DetailProduct = () => {

    const params = useParams();
    const id = parseInt(params.id as string, 10);
    const [product, setProduct] = useState<ProductModel | null>(null);
    const [showModalDescriptionProduct, setShowModalDescriptionProduct] = useState(false);
    const [utilities, setUtilities] = useState<UtilitiesModel[]>([]);
    const [showModalUtilitiesProduct, setShowModalUtilitiesProduct] = useState(false);
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
    });
    const [guestCount, setGuestCount] = useState(1);
    const router = useRouter();
    const { user } = useAuth();
    const [showModalRegister, setShowModalRegister] = useState(false);
    const [showModalLogin, setShowModalLogin] = useState(false);
    const [schedules, setSchedules] = useState<ScheduleModel[]>([]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await getProductByIdApi(id);
                if (response.status === 0) {
                    setProduct(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch product data', error);
                toast.error('Failed to fetch product data');
            }
        };

        const fetchUtilitiesData = async () => {
            try {
                const response = await getAllUtilitiesApi();
                setUtilities(response.data);
            } catch (error) {
                console.error('Failed to fetch utilities data', error);
                toast.error('Failed to fetch utilities data');
            }
        };

        const fetchSchedules = async () => {
            try {
                const response = await getAllScheduleByProductId(id);
                setSchedules(response.data);
            } catch (error) {
                console.error('Failed to fetch schedules', error);
            }
        };

        fetchSchedules();
        fetchProductData();
        fetchUtilitiesData();
    }, []);

    const images = product?.imageProductData || [];
    const previewImgURLs = images.map((item: any) => {
        const imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
        return imageBase64;
    });

    const truncateDescription = (description: string, wordLimit: number) => {
        const words = description.split(/\s+/);
        if (words.length <= wordLimit) {
            return description;
        }
        return words.slice(0, wordLimit).join(' ') + '...';
    };
    const truncatedDescription = truncateDescription(product?.description ?? '', 200);

    const utilitiesData = product?.utilityProductData ?? [];
    const utilityId = utilitiesData.map((item: any) => item.utilityId);

    const utilitiesOptions = utilities.map(utility => ({
        value: utility.id.toString(),
        label: utility.title,
        image: utility.image,
    }));

    const utilityLookup = new Map<string, { id: string, label: string; image: string }>();
    utilitiesOptions.forEach(option => {
        utilityLookup.set(option.value, {
            id: option.value,
            label: option.label,
            image: option.image,
        });
    });

    const utilityDetails = utilityId.map((id: any) => utilityLookup.get(id.toString()) ?? { id: '', label: '', image: '' });

    const timeOptions = TIME_TS.map(time => ({
        value: time.id.toString(),
        label: time.title,
    }));

    const timeLookup = new Map<string, string>();
    timeOptions.forEach(option => {
        timeLookup.set(option.value, option.label);
    });

    const checkInLabel = timeLookup.get(product?.checkIn.toString() ?? '') ?? '';
    const checkOutLabel = timeLookup.get(product?.checkOut.toString() ?? '') ?? '';

    const handleSelect = (ranges: any) => {
        const { selection } = ranges;
        const { startDate, endDate } = selection;

        if (isBefore(startDate, new Date()) || isBefore(endDate, new Date())) {
            return;
        }

        setSelectionRange(selection);
    };

    const { startDate, endDate } = selectionRange;
    const numberOfDays = endDate && startDate ? differenceInDays(endDate, startDate) : 0;
    const formattedPrice = product?.price ?? "0";
    const pricePerNight = Number(formattedPrice.replace(/[^\d.-]/g, ''));
    const provisional = pricePerNight * numberOfDays;
    const formattedProvisional = provisional.toLocaleString();
    const serviceCharge = provisional * 0.2;
    const formattedServiceCharge = serviceCharge.toLocaleString();
    const totalAmount = provisional + serviceCharge;
    const formattedTotalAmount = totalAmount.toLocaleString();

    const handleIncrease = () => {
        if (guestCount < Number(product?.guests ?? 1)) {
            setGuestCount(prevCount => prevCount + 1);
        }
    };

    const handleDecrease = () => {
        if (guestCount > 1) {
            setGuestCount(prevCount => prevCount - 1);
        }
    };

    const formattedStartDate = format(startDate, 'dd/MM/yyyy');
    const formattedEndDate = format(endDate, 'dd/MM/yyyy');

    const handleClickReservation = () => {
        const minDate = addDays(new Date(), 0);

        if (isBefore(startDate, minDate)) {
            toast.error('Ngày nhận phòng không thể là ngày hôm nay.');
            return;
        }

        if (!user) {
            setShowModalLogin(true)
        } else {
            router.push(`${ROUTE.BOOK}?productId=${product?.id}&startDate=${startDate}&endDate=${endDate}&numberOfDays=${numberOfDays}&guestCount=${guestCount}`)
        }
    }

    const disabledDates = schedules
        .filter((schedule) => schedule.status === 'accept')
        .reduce<Date[]>((dates, schedule) => {
            const start = parse(schedule.startDate, 'dd/MM/yyyy', new Date());
            const end = parse(schedule.endDate, 'dd/MM/yyyy', new Date());
            const interval = eachDayOfInterval({ start, end });
            return dates.concat(interval);
        }, []);

    if (product) {
        return (
            <>
                <div className="py-8 flex flex-col">
                    <div className='text-3xl font-semibold mb-4'>{product?.title}</div>
                    <div className="flex flex-col sm:flex-row justify-between overflow-hidden mb-4">
                        {previewImgURLs[0] && (
                            <div
                                className="h-[200px] sm:h-[392px] w-full sm:w-[750px] bg-no-repeat bg-center bg-cover rounded-xl mb-2 mr-2"
                                style={{ backgroundImage: `url(${previewImgURLs[0]})` }}
                            >
                            </div>
                        )}
                        <div className="grid grid-cols-2 grid-rows-2 gap-2 overflow-hidden">
                            {previewImgURLs.slice(1, 5).map((url: any) => (
                                <div
                                    key={url}
                                    className="h-24 sm:h-48 w-auto sm:w-[369px] bg-no-repeat bg-center bg-cover rounded-xl"
                                    style={{ backgroundImage: `url(${url})` }}
                                >
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='text-xl sm:text-3xl font-semibold mb-1'>Toàn bộ tại {product?.districts}, {product.provinces}</div>
                    <div className="flex flex-row items-center mb-4">
                        <div className="text-sm sm:text-lg font-semibold">{product?.guests} khách</div>
                        <Dot size={18} />
                        <div className="text-sm sm:text-lg font-semibold">{product?.bedrooms} phòng ngủ</div>
                        <Dot size={18} />
                        <div className="text-sm sm:text-lg font-semibold">{product?.beds} giường</div>
                        <Dot size={18} />
                        <div className="text-sm sm:text-lg font-semibold">{product?.bathrooms} phòng tắm</div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:space-x-14 w-full mb-4">
                        <div className="sm:w-2/3">
                            <div data-color-mode="light">
                                <div className="text-xl sm:text-3xl font-semibold mb-2">Giới thiệu về chỗ ở này</div>
                                <div className="h-[430px] sm:h-[250px] overflow-hidden">
                                    <MDEditor.Markdown
                                        source={truncatedDescription}
                                        style={{ whiteSpace: 'pre-wrap', fontSize: '18px' }}
                                    />
                                </div>
                                <div className="pt-3 sm:pt-5 mb-4">
                                    <Link
                                        href="#"
                                        className="text-base sm:text-lg font-semibold underline"
                                        onClick={() => setShowModalDescriptionProduct(true)}
                                    >
                                        Xem thêm
                                    </Link>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="text-xl sm:text-3xl font-semibold mb-2">Các tiện ích ở đây</div>
                                <div className="grid grid-cols-2 grid-rows-2 gap-2 overflow-hidden">
                                    {utilityDetails.slice(0, 8).map((utility: any) => {
                                        let imageBase64 = '';
                                        if (utility.image) {
                                            imageBase64 = Buffer.from(utility.image, 'base64').toString('binary');
                                        }

                                        return (
                                            <div className="flex items-center" key={utility.id}>
                                                <img
                                                    src={imageBase64}
                                                    alt={utility.label}
                                                    className='mt-2 rounded-md mr-7 h-12 w-12'
                                                />
                                                <span className='text-base sm:text-lg'>{utility.label}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="pt-3 sm:pt-5 mb-4">
                                <Link
                                    href="#"
                                    className="text-base sm:text-lg font-semibold underline"
                                    onClick={() => setShowModalUtilitiesProduct(true)}
                                >
                                    Xem toàn bộ {utilityDetails.length} tiện nghi
                                </Link>
                            </div>
                            <div className="mb-4">
                                <div className="text-xl sm:text-3xl font-semibold mb-2">Nội quy nhà</div>
                                <div className="flex flex-col text-base sm:text-lg">
                                    <span>Nhận phòng sau {checkInLabel}</span>
                                    <span>Trả phòng trước {checkOutLabel}</span>
                                    <span>Tối đa {product.guests} khách</span>
                                </div>
                            </div>
                        </div>
                        <div className="sm:w-1/3">
                            <div className=" w-auto border rounded-xl p-3 sm:p-5 shadow">
                                <div className="text-xl sm:text-2xl font-semibold mb-2">
                                    {product?.price}
                                    <span className="text-lg sm:text-xl font-normal"> VND/đêm</span>
                                </div>
                                <DateRange
                                    locale={vi}
                                    ranges={[selectionRange]}
                                    onChange={handleSelect}
                                    months={1}
                                    direction="horizontal"
                                    minDate={addDays(new Date(), 1)}
                                    disabledDates={disabledDates}
                                />
                                <div className="flex items-center mb-2">
                                    <div className="text-base sm:text-lg">Khách</div>
                                    <div className="flex flex-1 justify-end items-center">
                                        <button
                                            className={`${guestCount <= 1 ? 'bg-[#EFF2F7] cursor-not-allowed' : 'bg-[#EFF2F7] hover:bg-gray-300'
                                                } p-2 rounded-full transition-colors duration-200`}
                                            onClick={handleDecrease}
                                            disabled={guestCount <= 1}
                                        >
                                            <CircleMinus className={`${guestCount <= 1 ? 'text-gray-500' : 'text-black'}`} />
                                        </button>
                                        <div className="text-base sm:text-lg mx-6">{guestCount}</div>
                                        <button
                                            className={`${guestCount >= Number(product?.guests ?? 1) ? 'bg-[#EFF2F7] cursor-not-allowed' : 'bg-[#EFF2F7] hover:bg-gray-300'
                                                } p-2 rounded-full transition-colors duration-200`}
                                            onClick={handleIncrease}
                                            disabled={guestCount >= Number(product?.guests ?? 1)}
                                        >
                                            <CirclePlus className={`${guestCount >= Number(product?.guests ?? 1) ? 'text-gray-500' : 'text-black'}`} />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-base sm:text-lg my-4 flex justify-between">
                                    <span>{product?.price} VND x {numberOfDays} đêm</span>
                                    <span>{formattedProvisional} VND</span>
                                </div>
                                <div className="text-base sm:text-lg my-4 flex justify-between">
                                    <span> Phí ứng dụng</span>
                                    <span>{formattedServiceCharge} VND</span>
                                </div>
                                <div className="text-base sm:text-lg border-t py-4 font-semibold flex justify-between">
                                    <span>Tổng dịch vụ</span>
                                    <span>{formattedTotalAmount} VND</span>
                                </div>
                                <button
                                    className="bg-primary w-full p-2 text-center text-white font-bold rounded-xl text-xl sm:text-xl  hover:bg-primary-foreground"
                                    onClick={() => handleClickReservation()}
                                >
                                    Đặt chỗ
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="text-xl sm:text-3xl font-semibold mb-2">Những điều cần biết</div>
                        <div className="flex flex-col sm:flex-row justify-between">
                            <div className="flex flex-col">
                                <div className="text-lg sm:text-xl font-semibold mb-2">Nội quy nhà</div>
                                <div className="flex flex-col text-base sm:text-lg">
                                    <span>Nhận phòng sau {checkInLabel}</span>
                                    <span>Trả phòng trước {checkOutLabel}</span>
                                    <span>Tối đa {product.guests} khách</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-lg sm:text-xl font-semibold mb-2">An toàn</div>
                                <div className="flex flex-col text-base sm:text-lg">
                                    <span>Chỗ ở có camera an ninh ngoài nhà</span>
                                    <span>Đã lắp máy phát hiện khí CO</span>
                                    <span>Đã lắp máy báo khói</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-lg sm:text-xl font-semibold mb-2">Chính sách hủy</div>
                                <div className="flex flex-col text-base sm:text-lg">
                                    <span>Trước {formattedStartDate} Hoàn tiền đầy đủ</span>
                                    <span>Trước {formattedEndDate} Hoàn tiền một phần</span>
                                    <span>Sau {formattedEndDate} Không hoàn tiền</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="text-xl sm:text-3xl font-semibold mb-2">Nơi bạn sẽ đến</div>
                        <span className="text-base sm:text-lg">{product?.districts}, {product.provinces}</span>
                        <MapProduct districts={product.districts} />
                    </div>
                    {/* <div className="mt-4">
                        <div className="text-xl sm:text-3xl font-semibold mb-2">Đánh giá</div>

                    </div> */}
                </div>
                <DescriptionProduct
                    showModalDescriptionProduct={showModalDescriptionProduct}
                    setShowModalDescriptionProduct={setShowModalDescriptionProduct}
                    description={product.description}
                />
                <UtilitiesProduct
                    showModalUtilitiesProduct={showModalUtilitiesProduct}
                    setShowModalUtilitiesProduct={setShowModalUtilitiesProduct}
                    utilityDetails={utilityDetails}
                />
                <Login
                    showModalLogin={showModalLogin}
                    setShowModalLogin={setShowModalLogin}
                    setShowModalRegister={setShowModalRegister}
                />
                <Register
                    showModalRegister={showModalRegister}
                    setShowModalRegister={setShowModalRegister}
                    setShowModalLogin={setShowModalLogin}
                />
            </>
        );
    }
}

export default DetailProduct;