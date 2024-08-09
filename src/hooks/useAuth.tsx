import { getMeApi, logoutApi } from "@/api/user";
import { ROUTE } from "@/constants/enum";
import { UserModel } from "@/models/user";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

const useAuth = () => {

    const [user, setUser] = useState<UserModel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getMeApi();
                if (response.status === 0) {
                    setUser(response.data);
                }
            } catch (error) {
                setUser(null);
                console.error('Failed to get me', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const logout = async () => {
        try {
            const response = await logoutApi({});

            if (response.status === 0) {
                toast.success('Đăng xuất thành công!');
                setUser(null);
                setTimeout(() => {
                    window.location.href = ROUTE.HOME;
                }, 2000);
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    }

    return { user, loading, logout };
}

export default useAuth;