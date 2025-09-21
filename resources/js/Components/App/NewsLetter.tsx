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
            <div className="newsletter w-[90%] sm:w-[85%] flex flex-col lg:flex-row mx-auto bg-black rounded-2xl sm:rounded-3xl h-fit px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 gap-6 lg:gap-8">
                {content?.title && (
                    <div className="w-full lg:w-[50%] flex items-center justify-center lg:justify-start">
                        <h1 className="text-white font-integral_cf font-extrabold
                                             text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-center lg:text-left leading-tight">
                            {content.title}
                        </h1>
                    </div>
                )}
                <div className='flex flex-col w-full lg:w-[50%] h-fit my-auto items-center justify-center gap-4 sm:gap-5'>
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm">
                            <div className="flex items-center justify-center w-full rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 sm:p-4">
                                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-white font-medium text-sm sm:text-base">Successfully subscribed!</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit} className='w-full max-w-sm'>
                                <label className={`input validator flex justify-center align-middle items-center
                                                   h-fit w-full rounded-2xl sm:rounded-3xl
                                                   ${errors?.email ? 'border-red-500' : 'border-white/20'}`}>
                                    <svg className="h-[1em] opacity-50 border-transparent flex-shrink-0 mr-2
                                                   sm:mr-3"
                                         xmlns="http://www.w3.org/2000/svg"
                                         viewBox="0 0 24 24">
                                            <g strokeLinejoin="round"
                                               strokeLinecap="round"
                                               strokeWidth="2.5"
                                               fill="none"
                                               stroke="currentColor">
                                                <rect width="20"
                                                      height="16" x="2" y="4" rx="2">
                                                </rect>
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7">
                                                </path>
                                            </g>
                                    </svg>
                                    <input
                                        className='border-transparent bg-transparent w-full focus:border-transparent
                                                   focus:shadow-none focus:ring-transparent text-sm sm:text-base'
                                        type="email"
                                        placeholder={content?.placeholder_text || "Enter your email"}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </label>
                                {errors?.email && (
                                    <div className="text-red-400 text-xs sm:text-sm mt-2 text-center px-2">
                                        {errors.email}
                                    </div>
                                )}
                            </form>
                            <button
                                type="submit"
                                onClick={() => handleSubmit()}
                                className="btn btn-primary rounded-2xl sm:rounded-3xl w-full max-w-sm bg-white text-black hover:bg-gray-100 border-0 font-satoshi font-medium text-sm sm:text-base py-3 sm:py-4 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Subscribing...
                                    </>
                                ) : (
                                    content?.button_text || 'Subscribe'
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NewsLetter
