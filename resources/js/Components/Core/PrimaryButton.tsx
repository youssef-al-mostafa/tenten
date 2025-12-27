import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent px-4 py-2 text-xs
                font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out
                bg-gray-800
                ${disabled && 'opacity-25'} ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
