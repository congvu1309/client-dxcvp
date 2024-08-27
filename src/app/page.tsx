import ListCategory from "@/components/category/ListCategory";
import Footer from "@/components/navigation/Footer";
import Header from "@/components/navigation/Header";
import ListProduct from "@/components/prroduct/ListProduct";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-40">
        <Header isHidden={true} />
      </div>
      <div className="container mx-auto px-4 grow">
        <ListCategory />
        <ListProduct />
      </div>
      <Footer />
    </main>
  );
}
