import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setError, setLoading, setUser } from "../state/auth.slice";
import type { UserRole } from "../state/auth.slice";
import { getErrorMessage, registerUser } from "../services/auth.api";

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, loading, error } = useAppSelector((state) => state.auth);

    // Returns true when the account was created, false when it failed
    async function handleRegister(
        email: string,
        contact: string,
        password: string,
        fullname: string,
        role: UserRole = "buyer",
    ): Promise<boolean> {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const data = await registerUser({ email, contact, password, fullname, role });
            dispatch(setUser(data));
            return true;
        } catch (err) {
            dispatch(setError(getErrorMessage(err)));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { user, loading, error, handleRegister };
};
