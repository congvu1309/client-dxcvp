import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import ProductByCategory from "@/components/category/ProductByCategory";
import ListCategory from "@/components/category/ListCategory";

export default function CategoryPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <Header isHidden={true} />
            </div>
            <div className="container mx-auto px-4 grow">
                <ListCategory />
                <ProductByCategory />
            </div>
            <Footer />
        </div>
    );
}