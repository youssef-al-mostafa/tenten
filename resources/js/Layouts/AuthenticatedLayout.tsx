import NavBar from '@/Components/App/NavBar';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';

export default function AuthenticatedLayout({
    children,
    showNavBar = true,
}: PropsWithChildren<{ header?: ReactNode; showNavBar?: boolean }>) {
    const { props } = usePage();

    const [successMessages, setSuccessMessages] = useState<{ id: number; message: string }[]>([]);
    const timeoutRefs = useRef<{ [key: number]: ReturnType<typeof setTimeout> }>({});

    useEffect(() => {
        if (props.success.message) {
            const newMessage = {
                ...props.success,
                id: props.success.time,
            };

            setSuccessMessages((prevMessages) => [newMessage, ...prevMessages]);

            const timeoutId = setTimeout(() => {
                setSuccessMessages((prevMessages) =>
                    prevMessages.filter((msg) => msg.id !== newMessage.id)
                );
                delete timeoutRefs.current[newMessage.id];
            }, 5000);

            timeoutRefs.current[newMessage.id] = timeoutId;
        }
    }, [props.success]);

    return (
        <div className="min-h-screen bg-gray-100">
            {showNavBar && <NavBar />}
            {props.error && <div className="text-red-500">{props.error}</div>}

            {successMessages.length > 0 && (
                <div className="toast toast-top toast-end z-[1000] mt-16">
                    {successMessages.map((msg) => (
                        <div className="alert alert-success" key={msg.id}>
                            <span>{msg.message}</span>
                        </div>
                    ))}
                </div>
            )}
            <main>{children}</main>
        </div>
    );
}
