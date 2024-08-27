import Footer from "@/components/navigation/Footer";
import Header from "@/components/navigation/Header";
import Profile from "@/components/profile/Profile";

export default function ProfilePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <Header isHidden={false} />
            </div>
            <div className="container mx-auto px-4 grow">
                <Profile />
            </div>
            <Footer />
        </div>
    );
}
