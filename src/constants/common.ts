import Img1 from '@/public/payment/visa.svg';
import Img2 from '@/public/payment/amex.svg';
import Img3 from '@/public/payment/discovel.svg';

export type ImageLabel = {
    src: string;
    alt: string;
    link?: string;
};

export const IMAGE_PAYMENT: ImageLabel[] = [
    { src: Img1.src, alt: 'Visa Payment', link: '' },
    { src: Img2.src, alt: 'Amex Payment', link: '' },
    { src: Img3.src, alt: 'Discover Payment', link: '' },
];