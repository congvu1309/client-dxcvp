import { FaGithub, FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative pt-8 pb-2 bg-slate-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap text-left lg:text-left">
                    <div className="w-full lg:w-6/12 px-4">
                        <h4 className="text-3xl fonat-semibold">
                            Hành trình của bạn bắt đầu từ đây!
                        </h4>
                        <h5 className="text-lg mt-0 mb-2">
                            Đặt phòng với chúng tôi và đi du lịch thật phong cách.
                        </h5>
                        <h5 className="text-lg mt-0 mb-2">
                            Liên hệ với chúng tôi nếu bạn muốn trở thành nhà cung cấp dịch vụ!
                        </h5>
                        <div className="mt-6 lg:mb-0 mb-6 flex">
                            <button className="bg-white shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2 flex" type="button">
                                <FaGithub />
                            </button>
                            <button className="bg-white shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2 flex" type="button">
                                <FaFacebook />
                            </button>
                            <button className="bg-white font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2 flex" type="button">
                                <FaYoutube />
                            </button>
                            <button className="bg-white shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2 flex" type="button">
                                <FaTiktok />
                            </button>
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                        <div className="flex flex-wrap items-top mb-6">
                            <div className="w-full lg:w-4/12 px-4 ml-auto">
                                <span className="block uppercase text-base font-bold mb-2">
                                    Về dxcvp
                                </span>
                                <ul className="list-unstyled">
                                    <li className="font-semibold block pb-2 text-sm">
                                        Trang tin tức
                                    </li>
                                    <li className="font-semibold block pb-2 text-sm">
                                        Tính năng mới
                                    </li>
                                    <li className="font-semibold block pb-2 text-sm">
                                        Cơ hội nghề nghiệp
                                    </li>
                                    <li className="font-semibold block pb-2 text-sm">
                                        Nhà đầu tư
                                    </li>
                                </ul>
                            </div>
                            <div className="w-full lg:w-4/12 px-4 ml-auto">
                                <span className="block uppercase text-base font-bold mb-2">
                                    Hỗ trợ
                                </span>
                                <ul className="list-unstyled">
                                    <li className="font-semibold block pb-2 text-sm">
                                        Trung tâm trợ giúp
                                    </li>
                                    <li className="font-semibold block pb-2 text-sm">
                                        Liên hệ chúng tôi
                                    </li>
                                    <li className="font-semibold block pb-2 text-sm">
                                        Trợ giúp
                                    </li>
                                    <li className="font-semibold block pb-2 text-sm">
                                        Về chúng tôi
                                    </li>
                                    <li className="font-semibold block pb-2 text-sm">
                                        Tính năng mới ra mắt
                                    </li>
                                </ul>
                            </div>
                            <div className="w-full lg:w-4/12 px-4">
                                <span className="block uppercase text-base font-bold mb-2">Khác</span>
                                <ul className="list-unstyled">
                                    <li className="font-semibold block pb-2 text-sm">
                                        Chính Sách Quyền Riêng
                                    </li>
                                    <li className="font-semibold block pb-2 text-sm">
                                        Điều khoản & Điều kiện
                                    </li>
                                    <li className="font-semibold block pb-2 text-sm">
                                        Quy chế hoạt động
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="my-2" />
            <div className="flex flex-wrap items-center md:justify-between justify-center">
                <div className="w-full md:w-4/12 px-4 mx-auto text-center">
                    <div className="text-sm font-semibold py-1">
                        Copyright © <span id="get-current-year">2024</span>
                        <Link href={'/'} className="px-1">
                            dxcvp by
                        </Link>
                        <Link href={'/'} className="">
                            Cong Vu
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}