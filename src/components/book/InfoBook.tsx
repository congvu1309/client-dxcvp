'use client';

import { getProductByIdApi } from '@/api/product';
import { IMAGE_PAYMENT } from '@/constants/common';
import { TIME_TS } from '@/constants/time';
import { ProductModel } from '@/models/product';
import CommonUtils from '@/utils/CommonUtils';
import { useFormik } from 'formik';
import { ChevronLeft, CircleMinus, CirclePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { DateRange } from 'react-date-range';
import { addDays, differenceInDays, format, parse, eachDayOfInterval } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { vi } from 'date-fns/locale';
import { createNewSchedule, getAllScheduleByProductId } from '@/api/schedule';
import useAuth from '@/hooks/useAuth';
import { ROUTE } from '@/constants/enum';
import { ScheduleModel } from '@/models/schedule';

interface InfoBookProps {
    productId: number;
    startDate: string | null;
    endDate: string | null;
    numberOfDays: number;
    guestCount: number;
}

const InfoBook: React.FC<InfoBookProps> = ({ productId, startDate, endDate, numberOfDays: initialNumberOfDays, guestCount: initialGuestCount }) => {

    const router = useRouter();
    const [product, setProduct] = useState<ProductModel | null>(null);
    const [guestCount, setGuestCount] = useState<number>(initialGuestCount);
    const [isEditingGuest, setIsEditingGuest] = useState<boolean>(false);
    const [isEditingDate, setIsEditingDate] = useState<boolean>(false);
    const [dateRangeSelection, setDateRangeSelection] = useState<any>({
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
    });
    const [numberOfDays, setNumberOfDays] = useState<number>(initialNumberOfDays);
    const { user, loading } = useAuth();
    const [schedules, setSchedules] = useState<ScheduleModel[]>([]);

    useEffect(() => {

        if (!loading && !user) {
            router.push(ROUTE.HOME);
        }

        const fetchProductData = async () => {
            try {
                const response = await getProductByIdApi(productId);
                if (response.status === 0) {
                    setProduct(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch product data', error);
                toast.error('Failed to fetch product data');
            }
        };

        fetchProductData();

        if (dateRangeSelection.startDate && dateRangeSelection.endDate) {
            const days = differenceInDays(dateRangeSelection.endDate, dateRangeSelection.startDate);
            setNumberOfDays(days);
        }

        if (user) {
            formik.setValues({
                ...initialFormData,
                productId: productId,
                userId: user.id,
                startDate: displayStartDate,
                endDate: displayEndDate,
                numberOfDays: displayNumberOfDays,
                guestCount: guestCount,
                pay: formattedTotalAmount
            });
        }

        const fetchSchedules = async () => {
            try {
                const response = await getAllScheduleByProductId(productId);
                setSchedules(response.data);
            } catch (error) {
                console.error('Failed to fetch schedules', error);
            }
        };

        fetchSchedules();

    }, [productId, dateRangeSelection, user, loading, numberOfDays, guestCount]);

    const initialFormData = {
        productId: 0,
        userId: 0,
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        startDate: '',
        endDate: '',
        numberOfDays: 0,
        guestCount: 0,
        image: '',
        previewImgURL: '',
        phoneNumber: '',
        pay: '',
    };

    const validationSchema = Yup.object({
        cardNumber: Yup.string().required('Vui lòng nhập thông tin!'),
        cardHolder: Yup.string().required('Vui lòng nhập thông tin!'),
        expiryDate: Yup.string().required('Vui lòng nhập thông tin!'),
        cvv: Yup.string().required('Vui lòng nhập thông tin!'),
        phoneNumber: Yup.string().min(10, 'Số điện thoại cần dài ít nhất 10 ký tự!').max(10, 'Đã thừa ký tự!').required('Vui lòng nhập thông tin!'),
        image: Yup.string().required('Vui lòng chọn ảnh!'),
    });

    const handleBackClick = () => {
        router.back();
    };

    const images = product?.imageProductData || [];
    const previewImgURLs = images.map((item: any) => {
        const imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
        return imageBase64;
    });

    const displayStartDate = format(dateRangeSelection.startDate, 'dd/MM/yyyy');
    const displayEndDate = format(dateRangeSelection.endDate, 'dd/MM/yyyy');
    const displayNumberOfDays = Number(numberOfDays)
    const formattedPrice = product?.price ?? "0";
    const pricePerNight = Number(formattedPrice.replace(/[^\d.-]/g, ''));
    const provisional = pricePerNight * numberOfDays;
    const formattedProvisional = provisional.toLocaleString();
    const serviceCharge = provisional * 0.2;
    const formattedServiceCharge = serviceCharge.toLocaleString();
    const totalAmount = provisional + serviceCharge;
    const formattedTotalAmount = totalAmount.toLocaleString();

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

    const handleOnchangeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const data = event.target.files;
        if (data && data.length > 0) {
            const file = data[0];
            if (file) {
                const base64 = await CommonUtils.getBase64(file);
                const objectUrl = URL.createObjectURL(file);
                formik.setFieldValue('previewImgURL', objectUrl);
                formik.setFieldValue('image', base64);
            }
        }
    };

    const formatNumber = (value: string) => {
        return value.replace(/\D/g, '');
    };

    const handleChangeCardNumber = (event: any) => {
        const rawValue = event.target.value;
        const formattedValue = formatNumber(rawValue);
        formik.setFieldValue('cardNumber', formattedValue);
    };

    const handleChangeExpiryDate = (event: any) => {
        const inputValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        let formattedValue = inputValue;

        // Format to MM/YY
        if (inputValue.length >= 3) {
            formattedValue = `${inputValue.substring(0, 2)}/${inputValue.substring(2, 4)}`;
        }

        // Ensure that the formik state is updated
        formik.setFieldValue('expiryDate', formattedValue);
    };

    const handleChangeCVV = (event: any) => {
        const rawValue = event.target.value;
        const formattedValue = formatNumber(rawValue);
        formik.setFieldValue('cvv', formattedValue);
    };

    const handleChangePhoneNumber = (event: any) => {
        const rawValue = event.target.value;
        const formattedValue = formatNumber(rawValue);
        formik.setFieldValue('phoneNumber', formattedValue);
    };

    const handleDecrease = () => {
        if (guestCount > 1) {
            setGuestCount(prevCount => prevCount - 1);
        }
    };

    const handleIncrease = () => {
        const maxGuests = Number(product?.guests ?? 1);
        if (guestCount < maxGuests) {
            setGuestCount(prevCount => prevCount + 1);
        }
    };

    const handleEditClick = () => {
        setIsEditingGuest(prev => !prev);
    };

    const handleDateEditClick = () => {
        setIsEditingDate(prev => !prev);
    };

    const updateDateRange = (ranges: any) => {
        const { selection } = ranges;
        setDateRangeSelection({
            startDate: selection.startDate,
            endDate: selection.endDate,
            key: 'selection',
        });
    };

    const disabledDates = schedules
        .filter((schedule) => schedule.status === 'accept')
        .reduce<Date[]>((dates, schedule) => {
            const start = parse(schedule.startDate, 'dd/MM/yyyy', new Date());
            const end = parse(schedule.endDate, 'dd/MM/yyyy', new Date());
            const interval = eachDayOfInterval({ start, end });
            return dates.concat(interval);
        }, []);

    const mutation = useMutation({
        mutationFn: (data: typeof initialFormData) => createNewSchedule(data as any),
        onSuccess: (data: any) => {
            if (data.status === 0) {
                toast.success('Đặt lịch thành công!');
                setTimeout(() => {
                    window.location.href = ROUTE.TRIP;
                }, 1500);
            } else if (data.status === 1) {
                toast.error('Đặt lịch thất bại!');
            }
        },
        onError: (error: any) => {
            console.log('Book failed', error.response?.data);
        },
    });

    const formik = useFormik({
        initialValues: initialFormData,
        validationSchema,
        onSubmit: (values) => {
            mutation.mutate(values);
        },
    });

    if (product) {
        return (
            <>
                <div className="py-8 flex flex-col">
                    <div className="flex items-center mb-4">
                        <ChevronLeft
                            size={30}
                            className='cursor-pointer'
                            onClick={handleBackClick}
                        />
                        <div className='text-2xl sm:text-3xl font-semibold pl-5 sm:pl-10'>Xác nhận và thanh toán</div>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="sm:pl-[70px] mb-4">
                            <div className="flex flex-col sm:flex-row sm:space-x-16 w-full mb-4">
                                <div className="sm:w-2/4">
                                    <div className='text-xl sm:text-2xl font-semibold mb-2'>Chuyến đi của bạn</div>
                                    <div className="flex justify-between mb-2 text-base sm:text-lg">
                                        <span>Ngày {displayStartDate} - {displayEndDate}</span>
                                        <div
                                            className="font-semibold underline cursor-pointer"
                                            onClick={handleDateEditClick}
                                        >
                                            {isEditingDate ? 'Xong' : 'Chỉnh sửa'}
                                        </div>
                                    </div>
                                    {isEditingDate && (
                                        <DateRange
                                            locale={vi}
                                            ranges={[dateRangeSelection]}
                                            onChange={updateDateRange}
                                            months={1}
                                            direction="horizontal"
                                            minDate={addDays(new Date(), 1)}
                                            className='custom-date-range'
                                            disabledDates={disabledDates}
                                        />
                                    )}
                                    <div className="flex justify-between mb-2 text-base sm:text-lg">
                                        {isEditingGuest ? (
                                            <div className="flex items-center">
                                                <div className="text-base sm:text-lg pr-5">Khách</div>
                                                <div className="flex flex-1 justify-end items-center">
                                                    <div
                                                        className={`p-2 rounded-full transition-colors duration-200 ${guestCount <= 1 ? 'bg-[#EFF2F7] cursor-not-allowed' : 'bg-[#EFF2F7] hover:bg-gray-300'}`}
                                                        onClick={guestCount > 1 ? handleDecrease : undefined}
                                                    >
                                                        <CircleMinus className={`${guestCount <= 1 ? 'text-gray-500' : 'text-black'}`} />
                                                    </div>
                                                    <div className="text-base sm:text-lg mx-6">{guestCount}</div>
                                                    <div
                                                        className={`p-2 rounded-full transition-colors duration-200 ${guestCount >= Number(product?.guests ?? 1) ? 'bg-[#EFF2F7] cursor-not-allowed' : 'bg-[#EFF2F7] hover:bg-gray-300'}`}
                                                        onClick={guestCount < Number(product?.guests ?? 1) ? handleIncrease : undefined}
                                                    >
                                                        <CirclePlus className={`${guestCount >= Number(product?.guests ?? 1) ? 'text-gray-500' : 'text-black'}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span>Khách {guestCount} người</span>
                                        )}
                                        <div
                                            className="font-semibold underline cursor-pointer"
                                            onClick={handleEditClick}
                                        >
                                            {isEditingGuest ? 'Xong' : 'Chỉnh sửa'}
                                        </div>
                                    </div>
                                    <div className="text-base sm:text-lg mb-2">
                                        <span>Nhận phòng sau {checkInLabel}</span>
                                    </div>
                                    <div className="text-base sm:text-lg mb-2">
                                        <span>Trả phòng trước {checkOutLabel}</span>
                                    </div>
                                    {previewImgURLs[0] && (
                                        <div
                                            className="h-[300px] w-full bg-no-repeat bg-center bg-cover rounded-xl mb-2 mr-2"
                                            style={{ backgroundImage: `url(${previewImgURLs[0]})` }}
                                        >
                                        </div>
                                    )}
                                    <div className='text-base sm:text-lg font-semibold mb-4'>{product?.title}</div>
                                    <div className='text-xl sm:text-2xl font-semibold mb-2'>Chi tiết giá</div>
                                    <div className="flex justify-between text-base sm:text-lg">
                                        <span>{product?.price} VND x {numberOfDays} đêm</span>
                                        <span>{formattedProvisional} VND</span>
                                    </div>
                                    <div className="text-base sm:text-lg py-4 flex justify-between">
                                        <span> Phí ứng dụng</span>
                                        <span>{formattedServiceCharge} VND</span>
                                    </div>
                                    <div className="text-base sm:text-lg border-t py-4 font-semibold flex justify-between">
                                        <span>Tổng dịch vụ</span>
                                        <span>{formattedTotalAmount} VND</span>
                                    </div>
                                </div>
                                <div className="sm:w-2/4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className='text-xl sm:text-2xl font-semibold'>Thanh toán</div>
                                        <div className="flex flex-1 justify-end">
                                            {IMAGE_PAYMENT.map((payment) => {
                                                return (
                                                    <div key={payment.alt}>
                                                        <img src={payment.src} alt={payment.alt} className='w-10 h-10 mx-2' />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="mb-4">
                                            <label htmlFor='cardNumber' className="block text-base sm:text-lg text-gray-700">Số thẻ</label>
                                            <input
                                                id='cardNumber'
                                                name='cardNumber'
                                                type="text"
                                                value={formatNumber(formik.values.cardNumber)}
                                                onChange={handleChangeCardNumber}
                                                onBlur={formik.handleBlur}
                                                maxLength={19}
                                                placeholder="1234 5678 9012 3456"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-lg"
                                            />
                                            {formik.touched.cardNumber && formik.errors.cardNumber ? (
                                                <div className="text-primary">{formik.errors.cardNumber}</div>
                                            ) : null}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor='cardHolder' className="block text-base sm:text-lg text-gray-700">Tên chủ thẻ</label>
                                            <input
                                                id='cardHolder'
                                                name='cardHolder'
                                                type="text"
                                                value={formik.values.cardHolder}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="John Doe"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-lg"
                                            />
                                            {formik.touched.cardHolder && formik.errors.cardHolder ? (
                                                <div className="text-primary">{formik.errors.cardHolder}</div>
                                            ) : null}
                                        </div>
                                        <div className="flex space-x-4 mb-4">
                                            <div className="w-1/2">
                                                <label htmlFor='expiryDate' className="block text-base sm:text-lg text-gray-700">Ngày hết hạn</label>
                                                <input
                                                    id='expiryDate'
                                                    name='expiryDate'
                                                    type="text"
                                                    value={formik.values.expiryDate}
                                                    onChange={handleChangeExpiryDate}
                                                    onBlur={formik.handleBlur}
                                                    maxLength={5}
                                                    placeholder="MM/YY"
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-lg"
                                                />
                                                {formik.touched.expiryDate && formik.errors.expiryDate ? (
                                                    <div className="text-primary">{formik.errors.expiryDate}</div>
                                                ) : null}
                                            </div>
                                            <div className="w-1/2">
                                                <label htmlFor='cvv' className="block text-base sm:text-lg text-gray-700">CVV</label>
                                                <input
                                                    id='cvv'
                                                    name='cvv'
                                                    type="text"
                                                    value={formatNumber(formik.values.cvv)}
                                                    onChange={handleChangeCVV}
                                                    onBlur={formik.handleBlur}
                                                    maxLength={4}
                                                    placeholder="123"
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-lg"
                                                />
                                                {formik.touched.cvv && formik.errors.cvv ? (
                                                    <div className="text-primary">{formik.errors.cvv}</div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='text-xl sm:text-2xl font-semibold mb-2'>Bắt buộc cho chuyến đi của bạn</div>
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center text-base sm:text-lg">
                                            <div className="flex flex-col">
                                                <span>Người đại diện</span>
                                                <span className=' text-sm sm:text-base'>(Chủ nhà muốn biết mặt của bạn)</span>
                                            </div>
                                            {formik.values.previewImgURL ? (
                                                <img src={formik.values.previewImgURL} alt='Avatar' className='h-20 w-20 rounded' />
                                            ) : (
                                                <div>{!formik.values.previewImgURL && <div className="hidden"></div>}</div>
                                            )}
                                            <label htmlFor='previewImg' className='font-semibold p-2 border rounded-xl hover:bg-gray-200 cursor-pointer'>
                                                Thêm
                                            </label>
                                            <input
                                                id='previewImg'
                                                type='file'
                                                hidden
                                                onChange={handleOnchangeImage}
                                            />
                                        </div>
                                        {formik.touched.image && formik.errors.image ? (
                                            <div className="text-primary">{formik.errors.image}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center">
                                            <div className="">
                                                <label htmlFor='phoneNumber' className="block text-base sm:text-lg text-gray-700">Số điện thoại</label>
                                                <span className=' text-sm sm:text-base'>(Chủ nhà sẽ gọi điện cho bạn)</span>
                                            </div>
                                            <input
                                                id='phoneNumber'
                                                name='phoneNumber'
                                                type="text"
                                                value={formatNumber(formik.values.phoneNumber)}
                                                onChange={handleChangePhoneNumber}
                                                onBlur={formik.handleBlur}
                                                className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-lg"
                                            />
                                        </div>
                                        {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                            <div className="text-primary">{formik.errors.phoneNumber}</div>
                                        ) : null}
                                    </div>
                                    <div className='text-xl sm:text-2xl font-semibold mb-2'>Chính sách hủy</div>
                                    <div className="flex flex-col text-base sm:text-lg">
                                        <span>Trước {displayStartDate} Hoàn tiền đầy đủ</span>
                                        <span>Trước {displayEndDate} Hoàn tiền một phần</span>
                                        <span>Sau {displayEndDate} Không hoàn tiền</span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <div className='text-xl sm:text-2xl font-semibold mb-2'>Quy chuẩn chung</div>
                                <div className="text-base sm:text-lg">
                                    <span>Chúng tôi yêu cầu tất cả khách phải ghi nhớ một số quy chuẩn đơn giản để làm một vị khách tuyệt vời.</span>
                                    <ul className="list-disc ml-5">
                                        <li>Tuân thủ nội quy nhà</li>
                                        <li>Giữ gìn ngôi nhà như thể đó là nhà bạn</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-center'>
                            <button
                                className='block rounded-md border-[1px] border-gray-300 py-2 px-4 bg-primary text-white text-xl sm:text-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                type='submit'
                            >
                                Xác nhận và thanh toán
                            </button>
                        </div>
                    </form>
                </div>
            </>
        );
    }
}

export default InfoBook;