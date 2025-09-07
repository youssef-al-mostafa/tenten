import React, { useState, useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'

interface NewsLetterProps {
    content?: {
        title?: string;
        placeholder_text?: string;
        button_text?: string;
        is_active?: boolean;
        sort_order?: number;
    };
}

const NewsLetter = ({ content }: NewsLetterProps) => {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isHidden, setIsHidden] = useState(false)

    const { props } = usePage()
    const { errors } = props as any

    useEffect(() => {
        if (props.success?.message) {
            setEmail('')
            setIsSuccess(true)
            setTimeout(() => {
                setIsHidden(true)
            }, 7000)
        }
    }, [props.success])

    if (isHidden) {
        return null
    }

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        setIsSubmitting(true)

        router.post(route('newsletter.subscribe'), { email }, {
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
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center gap-3 w-full max-w-72">
                            <div className="flex items-center justify-center w-full rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
                                <svg className="h-6 w-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-white font-medium">Successfully subscribed!</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit} className='w-full max-w-72'>
                                <label className={`input validator flex justify-center align-middle items-center h-fit w-full rounded-3xl ${errors?.email ? 'border-red-500' : ''}`}>
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
                                {errors?.email && (
                                    <div className="text-red-500 text-sm mt-1 text-center">
                                        {errors.email}
                                    </div>
                                )}
                            </form>
                            <button
                                type="submit"
                                onClick={() => handleSubmit()}
                                className="btn rounded-3xl w-full max-w-72"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Subscribing...' : content?.button_text || 'Submit'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NewsLetter
