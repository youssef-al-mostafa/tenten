import React from 'react'

export default function Head({ children }: { children: React.ReactNode }) {
    return (
        <title>{children}</title>
    );
}
