'use client';

import Link from 'next/link';
import Logo from '@/public/favicon.ico';
import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogPanel, PopoverGroup, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import useAuth from '@/hooks/useAuth';
import Login from '../auth/Login';
import Register from '../auth/Register';
import { ROUTE } from '@/constants/enum';
import { getAllProductApi } from '@/api/product';
import { useRouter } from 'next/navigation';
import { ProductModel } from '@/models/product';
import { provincesWithDistricts } from '@/constants/location';
import Select from 'react-select';

interface HeaderProps {
    isHidden: boolean;
}

const Header: React.FC<HeaderProps> = ({ isHidden }) => {

    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showModalRegister, setShowModalRegister] = useState(false);
    const [showModalLogin, setShowModalLogin] = useState(false);
    const router = useRouter();
    const [selectedProvince, setSelectedProvince] = useState<{ value: string; label: string } | null>(null);

    let imageBase64 = '';
    if (user?.avatar) {
        imageBase64 = Buffer.from(user.avatar, 'base64').toString('binary');
    }
    type OptionType = { value: string; label: string };

    const provincesOptions = provincesWithDistricts.map(province => ({
        value: province.id.toString(),
        label: province.name,
        districts: province.districts
    }));

    const handleProvincesChange = (selectedOption: OptionType | null) => {
        setSelectedProvince(selectedOption);
    };

    const handleSearchSubmit = () => {
        if (selectedProvince) {
            router.push(`${ROUTE.SEARCH_RESULTS}?address=${encodeURIComponent(selectedProvince.label)}`);
        } else {
            console.warn('No province selected');
        }
    };

    return (
        <>
            <header className="bg-white border-b">
                <div className="container mx-auto px-4">
                    <nav aria-label="Global" className="mx-auto flex items-center justify-between py-6">
                        <div className="flex lg:flex-1">
                            <Link href="/" className="p-1.5 flex items-center">
                                <img alt="Logo" src={Logo.src} className="h-14 w-auto" />
                                <span className="text-xl text-primary">dxcvp</span>
                            </Link>
                        </div>
                        <div className="flex lg:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(true)}
                                className="px-3 py-2.5 inline-flex items-center justify-center text-gray-700 rounded-3xl ring-1 ring-inset ring-gray-300"
                            >
                                <Bars3Icon aria-hidden="true" className="h-7 w-7" />
                                {user
                                    ?
                                    <div className='h-7 w-7 ring-1 ring-inset ring-gray-300 rounded-full flex items-center justify-center text-2xl font-semibold bg-slate-100'>
                                        {user?.avatar && imageBase64 ? (
                                            <img src={imageBase64} alt='Avatar' className='h-full w-full rounded-full' />
                                        ) : (
                                            <span className='text-base'>{user?.name.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    :
                                    <UserCircleIcon aria-hidden="true" className="h-7 w-7" />
                                }
                            </button>
                        </div>
                        {isHidden === true && (
                            <PopoverGroup className="hidden lg:flex lg:gap-x-12 rounded-3xl ring-1 ring-inset ring-gray-300 pl-8 pr-3 py-2 items-center">
                                <div className='w-96'>
                                    {/* <label
                                        htmlFor="provinces"
                                        className="hidden text-sm font-medium leading-6 text-gray-900 cursor-pointer pl-2"
                                    >
                                        Địa điểm
                                    </label> */}
                                    <Select
                                        id='provinces'
                                        value={selectedProvince}
                                        onChange={handleProvincesChange}
                                        options={provincesOptions}
                                        placeholder='Địa diểm bạn muốn đến'
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                border: "none",
                                                boxShadow: "none",
                                                "&:hover": {
                                                    border: "none",
                                                },
                                            }),
                                        }}
                                    />
                                </div>
                                {/* <div className="w-20">
                                    <label
                                        htmlFor="check-in"
                                        className="block text-sm font-medium leading-6 text-gray-900 cursor-pointer"
                                    >
                                        Nhận phòng
                                    </label>
                                    <input
                                        id="check-in"
                                        name="check-in"
                                        type="text"
                                        placeholder="Thêm ngày"
                                        className="block w-full rounded-md border-0 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none border-none"
                                    />
                                </div>
                                <div className="w-20">
                                    <label
                                        htmlFor="check-out"
                                        className="block text-sm font-medium leading-6 text-gray-900 cursor-pointer"
                                    >
                                        Trả phòng
                                    </label>
                                    <input
                                        id="check-out"
                                        name="check-out"
                                        type="text"
                                        placeholder="Thêm ngày"
                                        className="block w-full rounded-md border-0 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none border-none"
                                    />
                                </div> */}
                                {/* <div className="w-20">
                                    <label
                                        htmlFor="user"
                                        className="block text-sm font-medium leading-6 text-gray-900 cursor-pointer"
                                    >
                                        Khách
                                    </label>
                                    <input
                                        id="user"
                                        name="user"
                                        type="text"
                                        placeholder="Số lượng"
                                        className="block w-full rounded-md border-0 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none border-none"
                                    />
                                </div> */}
                                <div
                                    onClick={handleSearchSubmit}
                                    className="text-white ring-1 ring-inset ring-gray-300 rounded-full p-1.5 cursor-pointer bg-primary"
                                >
                                    <MagnifyingGlassIcon aria-hidden="true" className="h-7 w-7" />
                                </div>
                            </PopoverGroup>
                        )}
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                            <Menu as="div" className="relative inline-block text-left">
                                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-3xl bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 items-center">
                                    <Bars3Icon aria-hidden="true" className="h-8 w-8" />
                                    {user
                                        ?
                                        <div className='h-10 w-10 ring-1 ring-inset ring-gray-300 rounded-full flex items-center justify-center text-2xl font-semibold bg-slate-100'>
                                            {user?.avatar && imageBase64 ? (
                                                <img src={imageBase64} alt='Avatar' className='h-full w-full rounded-full' />
                                            ) : (
                                                <span className='text-base'>{user?.name.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        :
                                        <UserCircleIcon aria-hidden="true" className="h-8 w-8" />
                                    }
                                </MenuButton>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-4 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    {user
                                        ?
                                        <div className="py-1">
                                            <MenuItem>
                                                <Link
                                                    href={ROUTE.TRIP}
                                                    className="block px-4 py-2 text-base text-gray-700 font-semibold data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                                >
                                                    Chuyến đi
                                                </Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link
                                                    href={ROUTE.PROFILE}
                                                    className="block px-4 py-2 text-base text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                                >
                                                    Trang cá nhân
                                                </Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link
                                                    href="#"
                                                    className="block px-4 py-2 text-base text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                                    onClick={logout}
                                                >
                                                    Đăng xuất
                                                </Link>
                                            </MenuItem>
                                        </div>
                                        :
                                        <div className="py-1">
                                            <MenuItem>
                                                <Link
                                                    href="#"
                                                    className="block px-4 py-2 text-base text-gray-700 font-semibold data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                                    onClick={() => setShowModalLogin(true)}
                                                >
                                                    Đăng nhập
                                                </Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link
                                                    href="#"
                                                    className="block px-4 py-2 text-base text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                                    onClick={() => setShowModalRegister(true)}
                                                >
                                                    Đăng ký
                                                </Link>
                                            </MenuItem>
                                        </div>
                                    }
                                </MenuItems>
                            </Menu>
                        </div>
                    </nav>
                    <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                        <div className="fixed inset-0 z-10" />
                        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex items-center justify-between">
                                <Link href="/" className="flex items-center">
                                    <img alt="Logo" src={Logo.src} className="h-14 w-auto" />
                                    <span className="text-xl text-primary">dxcvp</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="mt-6 flow-root">
                                {user
                                    ?
                                    <div className="-my-6 divide-y divide-gray-500/10">
                                        <div className="space-y-2 pt-6">
                                            <Link
                                                href={ROUTE.TRIP}
                                                className="block pt-6 pb-3 text-base text-gray-700 font-semibold data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                            >
                                                Chuyến đi
                                            </Link>
                                        </div>
                                        <div>
                                            <Link
                                                href={ROUTE.PROFILE}
                                                className="block py-3 text-base text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                            >
                                                Trang cá nhân
                                            </Link>
                                        </div>
                                        <div>
                                            <Link
                                                href="#"
                                                className="block py-3 text-base text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                                onClick={logout}
                                            >
                                                Đăng xuất
                                            </Link>
                                        </div>
                                    </div>
                                    :
                                    <div className="-my-6 divide-y divide-gray-500/10">
                                        <div className="space-y-2 pt-6">
                                            <Link
                                                href="#"
                                                className="block py-3 text-base text-gray-700 font-semibold data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                                onClick={() => setShowModalLogin(true)}
                                            >
                                                Đăng nhập
                                            </Link>
                                        </div>
                                        <div>
                                            <Link
                                                href="#"
                                                className="block py-3 text-base text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                                onClick={() => setShowModalRegister(true)}
                                            >
                                                Đăng ký
                                            </Link>
                                        </div>
                                    </div>
                                }
                            </div>
                        </DialogPanel>
                    </Dialog>
                </div>
            </header>
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

export default Header;