import Header from "@/components/navigation/Header";
import DetailProduct from "@/components/prroduct/DetailProduct";
import Footer from "@/components/navigation/Footer";

export default function DetailProductPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <Header isHidden={true} />
            </div>
            <div className="container mx-auto px-4 grow">
                <DetailProduct />
            </div>
            <Footer />
        </div>
    );
}