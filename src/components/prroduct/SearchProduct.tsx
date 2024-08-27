'user client';

import { ROUTE } from "@/constants/enum";
import { useRouter } from "next/navigation";

interface SearchProductProps {
    searchProduct: string;
    setSearchProduct: React.Dispatch<React.SetStateAction<string>>;
}

const SearchProduct: React.FC<SearchProductProps> = ({ searchProduct, setSearchProduct }) => {
    
    return (
        <>
            <div className='flex items-center pb-14'>
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <label htmlFor='searchInput' className='sr-only'>Tìm kiếm theo tên</label>
                        <input
                            id='searchInput'
                            type='text'
                            placeholder='Tìm kiếm theo tên...'
                            value={searchProduct}
                            onChange={(e) => setSearchProduct(e.target.value)}
                            className='block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                    </div>
                </div>
               
            </div>
        </>
    );
}

export default SearchProduct;