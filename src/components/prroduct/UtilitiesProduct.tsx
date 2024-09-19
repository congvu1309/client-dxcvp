'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import useScrollLock from '@/hooks/useScrollLock';

interface UtilitiesProductProps {
    showModalUtilitiesProduct: boolean;
    setShowModalUtilitiesProduct: React.Dispatch<React.SetStateAction<boolean>>;
    utilityDetails: Array<{ id: string, label: string; image: string }>;
}

const UtilitiesProduct: React.FC<UtilitiesProductProps> = ({ showModalUtilitiesProduct, setShowModalUtilitiesProduct, utilityDetails }) => {

    useScrollLock(showModalUtilitiesProduct);

    return (
        <Dialog open={showModalUtilitiesProduct} onClose={() => setShowModalUtilitiesProduct(false)} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />
            <div className="fixed inset-0 z-50 w-screen overflow-hidden">
                <div className="flex sm:min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-6xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 max-h-[80vh] overflow-y-auto">
                            <div className="mt-3 sm:mt-0 sm:text-left">
                                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 flex items-center">
                                    <button
                                        type="button"
                                        className="flex flex-1 justify-end"
                                        data-autofocus
                                        onClick={() => setShowModalUtilitiesProduct(false)}
                                    >
                                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                                    </button>
                                </DialogTitle>
                                <div>
                                    <div className="text-3xl font-semibold mb-2">Các tiện ích ở đây</div>
                                    <div className="grid grid-cols-2 grid-rows-2 gap-4">
                                        {utilityDetails.map((utility) => {
                                            let imageBase64 = '';
                                            if (utility.image) {
                                                imageBase64 = Buffer.from(utility.image, 'base64').toString('binary');
                                            }

                                            return (
                                                <div className="flex items-center" key={utility.id}>
                                                    <img
                                                        src={imageBase64}
                                                        alt={utility.label}
                                                        className='mt-2 rounded-md mr-2 sm:mr-7 h-8 w-8 sm:h-12 sm:w-12'
                                                    />
                                                    <span className='text-base sm:text-xl'>{utility.label}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default UtilitiesProduct;