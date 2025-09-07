import React, { useState, useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'
import ToastContainer from '../Core/ToastContainer'

interface NewsLetterProps {
    content?: {
        title?: string;
        placeholder_text?: string;
        button_text?: string;
        is_active?: boolean;
        sort_order?: number;
    };
}

interface ToastData {
    id: string
    message: string
    type: 'success' | 'error' | 'info'
    duration?: number
}

const NewsLetter = ({ content }: NewsLetterProps) => {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toasts, setToasts] = useState<ToastData[]>([])

    const { props } = usePage()
    const { errors, flash } = props as any

    const addToast = (message: string, type: 'success' | 'error' | 'info', duration = 4000) => {
        const id = Date.now().toString()
        setToasts(prev => [...prev, { id, message, type, duration }])
    }

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }

    useEffect(() => {
        if (flash?.newsletter_success) {
            addToast(flash.newsletter_success, 'success')
            setEmail('')
        } else if (errors?.email) {
            addToast(errors.email, 'error')
        }
    }, [flash, errors])

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        if (!email || !email.includes('@')) {
            addToast('Please enter a valid email address', 'error')
            return
        }

        setIsSubmitting(true)

        router.post('/newsletter/subscribe', { email }, {
            preserveScroll: true,
            onFinish: () => {
                setIsSubmitting(false)
            }
        })
    }

    return (
        <div className="newsletters-wrapper bg-gradient-to-b from-transparent from-0% via-transparent via-50% to-base-200 to-50%">
            <div className="newsletter w-[85%] flex mx-auto bg-black rounded-3xl h-fit px-5 py-7">
                {content?.title && (
                    <h1 className="text-white font-integral_cf font-extrabold
                                         text-3xl w-[50%] flex h-fit my-auto">
                        {content.title}
                    </h1>
                )}
                <div className='flex flex-col w-[50%] h-fit my-auto items-center justify-center gap-3'>
                    <form onSubmit={handleSubmit} className='w-full max-w-72'>
                        <label className="input validator flex justify-center align-middle items-center h-fit w-full rounded-3xl">
                            <svg className="h-[1em] opacity-50 border-transparent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
                            <input
                                className='border-transparent w-full focus:border-transparent focus:shadow-none focus:ring-transparent'
                                type="email"
                                placeholder={content?.placeholder_text || ""}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </label>
                    </form>
                        <button
                            type="submit"
                            onClick={() => handleSubmit()}
                            className="btn rounded-3xl w-full max-w-72"
                        >
                            {isSubmitting ? 'Subscribing...' : content?.button_text || 'Submit'}
                        </button>
                </div>
            </div>
            <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
        </div>
    )
}

export default NewsLetter
