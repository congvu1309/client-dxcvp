'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { createNewUser } from '@/api/user';
import Link from 'next/link';
import useScrollLock from '@/hooks/useScrollLock';

interface RegisterProps {
    showModalRegister: boolean;
    setShowModalRegister: React.Dispatch<React.SetStateAction<boolean>>;
    setShowModalLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: React.FC<RegisterProps> = ({ showModalRegister, setShowModalRegister, setShowModalLogin }) => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    useScrollLock(showModalRegister);

    const initialFormData = {
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phoneNumber: '',
        address: '',
        avatar: '',
        previewImgURL: '',
        roleCheck: 'R3',
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Email không hợp lệ!').required('Vui lòng nhập thông tin!'),
        password: Yup.string().min(8, 'Mật khẩu cần dài ít nhất 8 ký tự').required('Vui lòng nhập thông tin!'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Mật khẩu phải trùng khớp!')
            .required('Vui lòng nhập thông tin!'),
        name: Yup.string().required('Vui lòng nhập thông tin!'),
        phoneNumber: Yup.string().min(10, 'Số điện thoại cần dài ít nhất 10 ký tự!').max(10, 'Đã thừa ký tự!').required('Vui lòng nhập thông tin!'),
        address: Yup.string().required('Vui lòng nhập thông tin!'),
    });

    const mutation = useMutation({
        mutationFn: (data: typeof initialFormData) => createNewUser(data as any),
        onSuccess: (data: any) => {
            if (data.status === 0) {
                toast.success('Đăng ký thành công!');
                setShowModalRegister(false);
                setTimeout(() => {
                    setShowModalLogin(true);
                    formik.setValues(initialFormData);
                }, 1500);
            } else if (data.status === 1) {
                toast.error('Tài khoản đã tồn tại!');
            }
        },
        onError: (error: any) => {
            toast.error('Đăng ký thất bại!');
            console.error('Đăng ký thất bại!', error);
        },
    });

    const formik = useFormik({
        initialValues: initialFormData,
        validationSchema,
        onSubmit: (values) => {
            mutation.mutate(values);
        },
    });

    return (
        <>
            <Dialog open={showModalRegister} onClose={() => setShowModalRegister(false)} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                    <div className="block sm:flex min-h-full items-end justify-center sm:p-4 text-center sm:items-center">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                        >
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-0">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 flex  items-center">
                                        <span className='flex flex-1 justify-center text-2xl'>
                                            Đăng ký
                                        </span>
                                        <button
                                            type="button"
                                            data-autofocus
                                            onClick={() => setShowModalRegister(false)}
                                        >
                                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                                        </button>
                                    </DialogTitle>
                                    <div className="mt-1">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className='pb-2'>
                                                <label htmlFor='email' className='text- font-medium flex'>Email</label>
                                                <input
                                                    id='email'
                                                    name='email'
                                                    type='email'
                                                    className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                                    value={formik.values.email}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.email && formik.errors.email ? (
                                                    <div className='text-primary'>{formik.errors.email}</div>
                                                ) : null}
                                            </div>
                                            <div className='pb-2'>
                                                <label htmlFor='password' className='text- font-medium flex'>Mật khẩu</label>
                                                <div className='relative'>
                                                    <input
                                                        id='password'
                                                        name='password'
                                                        type={showPassword ? 'text' : 'password'}
                                                        className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                                        value={formik.values.password}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    <div
                                                        className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                                                    </div>
                                                </div>
                                                {formik.touched.password && formik.errors.password ? (
                                                    <div className='text-primary'>{formik.errors.password}</div>
                                                ) : null}
                                            </div>
                                            <div className="pb-2">
                                                <label htmlFor='confirmPassword' className='text- font-medium flex'>Nhập lại mật khẩu</label>
                                                <div className='relative'>
                                                    <input
                                                        id='confirmPassword'
                                                        name='confirmPassword'
                                                        type={showConfirm ? 'text' : 'password'}
                                                        className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                                        value={formik.values.confirmPassword}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    <div
                                                        className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                                        onClick={() => setShowConfirm(!showConfirm)}
                                                    >
                                                        {showConfirm ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                                                    </div>
                                                </div>
                                                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                                    <div className='text-primary'>{formik.errors.confirmPassword}</div>
                                                ) : null}
                                            </div>
                                            <div className="pb-2">
                                                <label htmlFor='name' className='text- font-medium flex'>Họ và tên</label>
                                                <input
                                                    id='name'
                                                    name='name'
                                                    type='text'
                                                    className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.name && formik.errors.name ? (
                                                    <div className='text-primary'>{formik.errors.name}</div>
                                                ) : null}
                                            </div>
                                            <div className="pb-2">
                                                <label htmlFor='phoneNumber' className='text- font-medium flex'>Số điện thoại</label>
                                                <input
                                                    id='phoneNumber'
                                                    name='phoneNumber'
                                                    type='text'
                                                    className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                                    value={formik.values.phoneNumber}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                                    <div className='text-primary'>{formik.errors.phoneNumber}</div>
                                                ) : null}
                                            </div>
                                            <div className="pb-2">
                                                <label htmlFor='address' className='text- font-medium flex'>Địa chỉ</label>
                                                <input
                                                    id='address'
                                                    name='address'
                                                    type='text'
                                                    className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                                    value={formik.values.address}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.address && formik.errors.address ? (
                                                    <div className='text-primary'>{formik.errors.address}</div>
                                                ) : null}
                                            </div>
                                            <div className='text-center text- font-semibold py-2 sm:py-5'>
                                                <button
                                                    type='submit'
                                                    className='w-full border-2 p-1.5 rounded-lg outline-none bg-primary text-white'
                                                >
                                                    Tiếp tục
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-1 sm:px-6 sm:py-4">
                                Bạn đã có tài khoản!
                                <Link
                                    href="#"
                                    onClick={() => {
                                        setShowModalLogin(true);
                                        setShowModalRegister(false);
                                    }}
                                    className='pl-2 text-primary hover:underline cursor-pointer'>
                                    Đăng nhập
                                </Link>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default Register;