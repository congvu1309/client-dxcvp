
import Footer from "@/components/navigation/Footer";
import Header from "@/components/navigation/Header";
import Link from "next/link";

export default function SearchResult() {

    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <Header isHidden={true} />
            </div>
            <div className="container mx-auto px-4 grow">
                <div className="flex flex-col items-center justify-center py-20 sm:pt-20">
                    <div className="text-lg sm:text-2xl font-semibold pb-4">Bạn đã đặt lịch thành công</div>
                    <div className="text-lg sm:text-2xl font-semibold pb-8">Chủ nhà sẽ liên lạc với bạn</div>
                    <Link href="/">
                        <span className="text-lg sm:text-xl font-semibold text-primary">Quay lại trang chủ để thêm hành trình mới</span>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}