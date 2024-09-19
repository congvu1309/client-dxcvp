'use client';

import { FaStar } from "react-icons/fa";
import { useFormik } from 'formik';
import { useMutation } from "react-query";
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { createNewEvaluation, getEvaluation, getEvaluationById, updateEvaluation } from "@/api/evaluation";
import { EvaluationModel } from "@/models/evaluation";

interface EvaluationComponentProps {
    productId: number;
    showAt: string;
}

const EvaluationComponent: React.FC<EvaluationComponentProps> = ({ productId, showAt }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState<number | null>(null);
    const { user } = useAuth();
    const [evaluations, setEvaluations] = useState<EvaluationModel[]>([]);
    const [editingEvaluation, setEditingEvaluation] = useState<EvaluationModel | null>(null);
    const userId = String(user?.id);
    console.log(showAt)

    useEffect(() => {
        if (user) {
            formik.setValues({
                ...initialFormData,
                userId: Number(user.id),
                productId: productId,
            });
        }

        const fetchEvaluationData = async () => {
            try {
                const response = await getEvaluation(productId);
                setEvaluations(response.data);
            } catch (error) {
                console.error('Failed to fetch evaluation data', error);
            }
        };

        fetchEvaluationData();
    }, [user, productId]);

    const initialFormData = {
        id: 0,
        userId: 0,
        productId: 0,
        reviewText: '',
        rating: 0,
    };

    const validationSchema = Yup.object({
        reviewText: Yup.string().required('Vui lòng nhập thông tin!'),
    });

    const handleRating = (star: number) => {
        setRating(star);
        formik.setFieldValue('rating', star);
    };

    const handleHover = (star: number) => {
        setHover(star);
    };

    const createMutation = useMutation({
        mutationFn: (data: typeof initialFormData) => createNewEvaluation(data as any),
        onSuccess: (data: any) => {
            if (data.status === 0) {
                toast.success('Thành công!');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else if (data.status === 1) {
                toast.error('Thất bại!');
            }
        },
        onError: (error: any) => {
            console.log('Update failed', error.response?.data);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: typeof initialFormData) => updateEvaluation(data as any),
        onSuccess: (data: any) => {
            if (data.status === 0) {
                toast.success('Cập nhật thành công!');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else if (data.status === 1) {
                toast.error('Cập nhật thất bại!');
            }
        },
        onError: (error: any) => {
            console.error('Update failed', error.response?.data);
        },
    });

    const formik = useFormik({
        initialValues: initialFormData,
        validationSchema,
        onSubmit: (values) => {
            if (editingEvaluation) {
                updateMutation.mutate(values);
            } else {
                createMutation.mutate(values);
            }
        },
    });

    // Check if the user has already submitted an evaluation
    const userEvaluation = !evaluations.find((evaluation) => String(evaluation.userId) === userId);


    const renderEvaluations = () => {
        if (!editingEvaluation && evaluations.length > 0) {
            const evaluationsToRender = showAt === 'DetailProduct' ? evaluations.slice(0, 4) : evaluations;

            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {evaluationsToRender.map((evaluation) => {
                        let imageBase64 = '';
                        if (evaluation.userEvaluationData.avatar) {
                            imageBase64 = Buffer.from(evaluation.userEvaluationData.avatar, 'base64').toString('binary');
                        }

                        return (
                            <div key={evaluation.id} className="border p-4 rounded-md">
                                <div className="flex items-center space-x-4 pb-2">
                                    <div className='h-16 w-16 ring-1 ring-inset ring-gray-300 rounded-full flex items-center justify-center bg-slate-100'>
                                        {imageBase64 ? (
                                            <img src={imageBase64} alt='Avatar' className='h-full w-full rounded-full object-cover' />
                                        ) : (
                                            <span className='text-2xl font-semibold'>{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <span className="text-lg">{evaluation.userEvaluationData.name}</span>
                                        <span className="text-base text-gray-400">{evaluation.userEvaluationData.address}</span>
                                        <div className="flex items-center mb-2">
                                            {[...Array(Math.floor(evaluation.rating))].map((_, i) => (
                                                <FaStar key={i} className="text-yellow-500" />
                                            ))}
                                            {evaluation.rating % 1 !== 0 && <FaStar className="text-yellow-500 half-star" />}
                                            {[...Array(5 - Math.ceil(evaluation.rating))].map((_, i) => (
                                                <FaStar key={i} className="text-gray-300" />
                                            ))}
                                        </div>
                                    </div>
                                    {String(evaluation.userId) === userId && (
                                        <div className="flex flex-col items-center">
                                            <button
                                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-foreground"
                                                onClick={async () => {
                                                    try {
                                                        const response = await getEvaluationById(evaluation.id);
                                                        const fetchedEvaluation = response.data;
                                                        formik.setValues({
                                                            id: fetchedEvaluation.id,
                                                            userId: fetchedEvaluation.userId,
                                                            productId: fetchedEvaluation.productId,
                                                            reviewText: fetchedEvaluation.text,
                                                            rating: fetchedEvaluation.rating,
                                                        });
                                                        setRating(fetchedEvaluation.rating);
                                                        setEditingEvaluation(fetchedEvaluation);
                                                    } catch (error) {
                                                        console.error('Failed to fetch evaluation data', error);
                                                    }
                                                }}
                                            >
                                                Sửa
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="text-gray-800 break-words overflow-hidden text-ellipsis">
                                    {evaluation.text}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }
        return null;
    };


    return (
        <>
            <div className="text-xl sm:text-3xl font-semibold mb-4">Đánh giá</div>
            {/* Show form only if user is adding or editing */}
            {user && (userEvaluation || editingEvaluation) && (
                <form onSubmit={formik.handleSubmit} className="mb-4">
                    <div className="flex items-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`cursor-pointer text-2xl ${rating >= star || hover! >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                onClick={() => handleRating(star)}
                                onMouseEnter={() => handleHover(star)}
                                onMouseLeave={() => setHover(null)}
                            />
                        ))}
                    </div>
                    <textarea
                        id="reviewText"
                        name="reviewText"
                        rows={5}
                        style={{ resize: 'none' }}
                        className="block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={formik.values.reviewText}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.reviewText && formik.errors.reviewText ? (
                        <div className="text-primary">{formik.errors.reviewText}</div>
                    ) : null}

                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-foreground"
                        >
                            {editingEvaluation ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
                        </button>

                        {/* Cancel button to close the form */}
                        {editingEvaluation && (
                            <button
                                type="button"
                                onClick={() => {
                                    formik.resetForm(); // Reset form values
                                    setEditingEvaluation(null); // Close form
                                    setRating(0); // Reset rating stars
                                }}
                                className="mt-4 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </form>
            )}

            {/* Display evaluations if not editing */}
            {renderEvaluations()}

            {!editingEvaluation && evaluations.length === 0 && (
                <p>Chưa có đánh giá nào</p>
            )}
        </>
    );
};

export default EvaluationComponent;