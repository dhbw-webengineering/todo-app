import { useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface LoginData {
    email: string;
    password: string;
}

export const useLogin = () => {
    const { login } = useAuth();

    return useMutation({
        mutationFn: ({ email, password }: LoginData) => login(email, password),
        onSuccess: () => {
            toast.success('Erfolgreich angemeldet!');
        },
        onError: (error: any) => {
            toast.error('Anmeldung fehlgeschlagen');
            console.error('Login error:', error);
        },
    });
};
