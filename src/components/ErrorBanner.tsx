import { useContext } from 'react';
import { ErrorContext } from '../state/ErrorContext';
import { toast } from 'sonner';

export default function ErrorBanner() {
    const { error } = useContext(ErrorContext);
    if (!error) return null;

    return (
        toast.error(error, { duration: 5000, position: 'bottom-right' })
    )
}
