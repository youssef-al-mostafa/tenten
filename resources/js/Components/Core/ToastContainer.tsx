import React, { useState, useEffect } from 'react'
import Toast from './Toast'

interface ToastData {
    id: string
    message: string
    type: 'success' | 'error' | 'info'
    duration?: number
}

interface ToastContainerProps {
    toasts: ToastData[]
    onRemoveToast: (id: string) => void
}

const ToastContainer = ({ toasts, onRemoveToast }: ToastContainerProps) => {
    return (
        <div className="toast toast-top toast-end z-[1000] mt-16">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => onRemoveToast(toast.id)}
                />
            ))}
        </div>
    )
}

export default ToastContainer