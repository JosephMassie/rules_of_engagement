import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
    variable: '--font-roboto',
});

export const metadata: Metadata = {
    title: 'Rules of Engagement',
    description:
        "An open source web app designed to make the current ITS Season Tournament rules for Corvus Beli's wargame Infinity.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${roboto.variable} antialiased`}>{children}</body>
        </html>
    );
}
