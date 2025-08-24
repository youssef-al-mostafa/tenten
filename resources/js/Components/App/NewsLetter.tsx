import React from 'react'

const NewsLetter = () => {
    return (
        <div className="newsletters-wrapper bg-gradient-to-b from-transparent from-0% via-transparent via-50% to-base-200 to-50%">
            <div className="newsletter w-[85%] flex mx-auto bg-black rounded-3xl h-fit px-5 py-7">
                <h1 className="text-white font-integral_cf font-extrabold
                                     text-3xl w-[50%] flex h-fit my-auto">
                    STAY UP TO DATE ABOUT OUR LATEST OFFERS
                </h1>
                <div className='flex flex-col w-[50%] h-fit my-auto items-center justify-center gap-3'>
                    <div className='w-full max-w-72'>
                        <label className="input validator flex justify-center align-middle items-center h-fit w-full rounded-3xl">
                            <svg className="h-[1em] opacity-50 border-transparent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
                            <input className='border-transparent w-full focus:border-transparent focus:shadow-none focus:ring-transparent' type="email" placeholder="mail@site.com" required />
                        </label>
                        <div className="validator-hint hidden">Enter valid email address</div>
                    </div>
                    <button className="btn rounded-3xl w-full max-w-72">Subscribe to Newsletter</button>
                </div>
            </div>
        </div>
    )
}

export default NewsLetter
