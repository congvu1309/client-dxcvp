export class ProductModel {
    id: number = 0;
    userId: number = 0;
    title: string = '';
    provinces: string = '';
    districts: string = '';
    price: string = '';
    categoryId: string = '';
    guests: string = '';
    bedrooms: string = '';
    beds: string = '';
    bathrooms: string = '';
    checkIn: string = '';
    checkOut: string = '';
    imageProductData: any = null;
    utilityProductData: any = null;
    description: string = '';
    userProductData: any = null;
    status: string = ''

    constructor(auth?: ProductModel) {
        if (auth) {
            Object.assign(this, auth);
        }
    }
}