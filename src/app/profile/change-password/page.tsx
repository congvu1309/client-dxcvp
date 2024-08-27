import Header from "@/components/navigation/Header";
import ChangePassword from "@/components/profile/ChangePassword";
import Footer from "@/components/navigation/Footer";

export default function ChangePasswordPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <Header isHidden={false} />
            </div>
            <div className="container mx-auto px-4 grow">
                <ChangePassword />
            </div>
            <Footer />
        </div>
    );
}
