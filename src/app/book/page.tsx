'use client';

import InfoBook from "@/components/book/InfoBook";
import Footer from "@/components/navigation/Footer";
import Header from "@/components/navigation/Header";
import { useSearchParams } from "next/navigation";

export default function BookPage() {

    const searchParams = useSearchParams();
    const productId = parseInt(searchParams.get('productId') ?? '0', 10);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const numberOfDays = parseInt(searchParams.get('numberOfDays') ?? '0', 10);
    const guestCount = parseInt(searchParams.get('guestCount') ?? '0', 10);


    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <Header isHidden={false} />
            </div>
            <div className="container mx-auto px-4 grow">
                <InfoBook
                    productId={productId}
                    startDate={startDate}
                    endDate={endDate}
                    numberOfDays={numberOfDays}
                    guestCount={guestCount}
                />
            </div>
            <Footer />
        </div>
    );
}