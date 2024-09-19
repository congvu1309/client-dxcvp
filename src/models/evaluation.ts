export class EvaluationModel {
    id: number = 0;
    userId: number = 0;
    productId: number = 0;
    rating: number = 0;
    text: string = '';
    userEvaluationData: any = null;

    constructor(auth?: EvaluationModel) {
        if (auth) {
            Object.assign(this, auth);
        }
    }
}
