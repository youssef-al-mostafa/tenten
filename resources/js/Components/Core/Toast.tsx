import React, { useEffect, useState } from 'react'

interface ToastProps {
    message: string
    type: 'success' | 'error' | 'info'
    duration?: number
    onClose: () => void
}

const Toast = ({ message, type, duration = 4000, onClose }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    const getToastClasses = () => {
        const baseClasses = "alert transition-all duration-300 ease-in-out transform"
        const typeClasses = {
            success: "alert-success text-green-800",
            error: "alert-error text-red-800", 
            info: "alert-info text-blue-800"
        }
        const visibilityClasses = isVisible 
            ? "translate-x-0 opacity-100" 
            : "translate-x-full opacity-0"
        
        return `${baseClasses} ${typeClasses[type]} ${visibilityClasses}`
    }

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            case 'error':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            case 'info':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
        }
    }

    return (
        <div className={getToastClasses()}>
            {getIcon()}
            <span>{message}</span>
            <button 
                onClick={() => setIsVisible(false)}
                className="btn btn-sm btn-ghost"
            >
                ✕
            </button>
        </div>
    )
}

export default Toast