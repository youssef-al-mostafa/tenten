import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/*dismissible : to allow user to close the offer*/
const OfferBanner = ({
    message = 'and get 20% off to your first order.',
    buttonText = 'Sign Up',
    buttonUrl = '/register',
    dismissible = true,
    expiryDays = 7,
    cookieName = 'offer_banner_dismissed',
    isLoggedIn = false
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const isDismissed = localStorage.getItem(cookieName);
        if (isDismissed || isLoggedIn) {
            setIsVisible(false);
        }
    }, [cookieName, isLoggedIn]);

    const handleDismiss = () => {
        setIsVisible(false);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryDays);
        localStorage.setItem(cookieName, expiryDate.toISOString());
    };

    if (!isVisible) return null;

    return (
        <div
            className="flex items-center justify-center bg-black text-white text-center py-3 relative "
            data-testid="offer-banner">
            <a
                href={buttonUrl}
                className="text-white underline mr-2"
                onClick={(e) => {
                    console.log('Offer banner CTA clicked');
                }}>
                {buttonText}
            </a>
            <span>{message}</span>
            {dismissible && (
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="absolute right-[25px] text-white text-[32px] ml-8"
                    aria-label="Dismiss offer">
                    &times;
                </button>
            )}
        </div>
    );
};

OfferBanner.propTypes = {
    message: PropTypes.string,
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
    dismissible: PropTypes.bool,
    expiryDays: PropTypes.number,
    cookieName: PropTypes.string,
    isLoggedIn: PropTypes.bool
};

export default OfferBanner;
