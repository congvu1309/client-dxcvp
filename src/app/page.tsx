import Footer from "@/components/navigation/Footer";
import Header from "@/components/navigation/Header";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 grow">
        <Header />
      </div>
      <Footer />
    </main>
  );
}
