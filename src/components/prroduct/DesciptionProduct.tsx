'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import MDEditor from '@uiw/react-md-editor';

interface DescriptionProductProps {
    showModalDescriptionProduct: boolean;
    setShowModalDescriptionProduct: React.Dispatch<React.SetStateAction<boolean>>;
    description: string;
}

const DescriptionProduct: React.FC<DescriptionProductProps> = ({ showModalDescriptionProduct, setShowModalDescriptionProduct, description }) => {

    return (
        <Dialog open={showModalDescriptionProduct} onClose={() => setShowModalDescriptionProduct(false)} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />
            <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-6xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
                            <div className="mt-3 sm:mt-0 sm:text-left">
                                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 flex  items-center">
                                    <button
                                        type="button"
                                        className='flex flex-1 justify-end'
                                        data-autofocus
                                        onClick={() => setShowModalDescriptionProduct(false)}
                                    >
                                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                                    </button>
                                </DialogTitle>
                                <div data-color-mode="light">
                                    <div className="text-3xl font-semibold mb-2">Giới thiệu về chỗ ở này</div>
                                    <MDEditor.Markdown
                                        source={description || ''}
                                        style={{ whiteSpace: 'pre-wrap', fontSize: '20px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default DescriptionProduct;