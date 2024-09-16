'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { loginApi } from '@/api/user';
import GoogleLogo from '@/public/google-logo.png';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

interface LoginProps {
    showModalLogin: boolean;
    setShowModalLogin: React.Dispatch<React.SetStateAction<boolean>>;
    setShowModalRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ showModalLogin, setShowModalLogin, setShowModalRegister }) => {
    const [showPassword, setShowPassword] = useState(false);

    const initialFormData = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Email không hợp lệ!').required('Vui lòng nhập thông tin!'),
        password: Yup.string().min(8, 'Mật khẩu cần dài ít nhất 8 ký tự!').required('Vui lòng nhập thông tin!'),
    });

    const mutation = useMutation({
        mutationFn: (data: typeof initialFormData) => loginApi(data),
        onSuccess: (data: any) => {
            if (data.status === 0) {
                toast.success('Đăng nhập thành công!');
                setShowModalLogin(false);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else if (data.status === 1) {
                toast.error('Thiếu thông số!');
            } else if (data.status === 2) {
                toast.error('Không tìm thấy người dùng!');
            } else if (data.status === 3) {
                toast.error('Sai mật khẩu!');
            } else if (data.status === 4) {
                toast.error('Người dùng bị chặn, liên hệ để tìm hiểu!');
            }
        },
        onError: (error: any) => {
            console.log('Login failed', error.response?.data);
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
        <Dialog open={showModalLogin} onClose={() => setShowModalLogin(false)} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                <div className="block pt-28 sm:flex min-h-full items-end justify-center sm:p-4 text-center sm:items-center">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-0">
                            <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 flex  items-center">
                                    <span className='flex flex-1 justify-center text-2xl'>
                                        Đăng nhập
                                    </span>
                                    <button
                                        type="button"
                                        data-autofocus
                                        onClick={() => setShowModalLogin(false)}
                                    >
                                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                                    </button>
                                </DialogTitle>
                                <div className="mt-1">
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className='pb-2'>
                                            <label htmlFor='email' className='text-xl font-medium flex'>Email</label>
                                            <div className='mt-2'>
                                                <input
                                                    id='email'
                                                    name='email'
                                                    type='email'
                                                    className='w-full border-2 py-2 px-4 rounded-lg outline-none'
                                                    value={formik.values.email}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.email && formik.errors.email ? (
                                                    <div className='text-primary'>{formik.errors.email}</div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor='password' className='text-xl font-medium flex'>Mật khẩu</label>
                                            <div className='mt-2'>
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
                                        </div>
                                        <div className='text-center text-xl font-semibold py-5'>
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
                        <div className="flex justify-center text-xl">hoặc</div>
                        <div className='text-center text-xl font-semibold px-6 py-2 cursor-pointer'>
                            <div
                                className='w-full border-2 p-1.5 rounded-lg outline-none bg-white text-black hover:bg-gray-200 flex items-center justify-center'
                                onClick={() => signIn('google')}
                            >
                                <img alt="Logo" src={GoogleLogo.src} className="h-7 w-auto" />
                                <span className='pl-2'>Đăng nhập với Google</span>
                            </div>
                        </div>
                        <div className="px-6 py-4">
                            Bạn chưa có tài khoản?
                            <Link
                                href="#"
                                onClick={() => {
                                    setShowModalRegister(true);
                                    setShowModalLogin(false);
                                }}
                                className='pl-2 text-primary hover:underline cursor-pointer'>
                                Đăng ký
                            </Link>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default Login;