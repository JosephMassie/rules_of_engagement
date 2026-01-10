import type { Metadata } from 'next';
import { Audiowide, Quantico } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { DisplayModeToggle } from '@/components/ui/display_mode_toggle';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ServiceWorkerProvider from '@/components/sw_provider';

const audiowide = Audiowide({
    variable: '--font-audiowide',
    weight: '400',
    subsets: ['latin'],
    style: 'normal',
});

const orbitron = Quantico({
    variable: '--font-quantico',
    weight: '400',
    subsets: ['latin'],
    style: 'normal',
});

export const metadata: Metadata = {
    title: 'Rules of Engagement',
    description:
        "An open source web app designed to make the current ITS Season Tournament rules for Corvus Beli's wargame Infinity.",
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link
                    rel="icon"
                    type="image/x-icon"
                    href="/icons/favicon.ico"
                />
            </head>
            <body
                className={`${audiowide.variable} ${orbitron.variable} antialiased bg-background`}>
                <ServiceWorkerProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange>
                        <div className="min-h-screen mx-auto relative max-w-7xl font-main">
                            <div className="z-10 sticky top-0 left-0 w-full min-h-4 p-4 flex justify-start items-center bg-card">
                                <Button asChild variant="ghost">
                                    <Link
                                        className="font-decorative leading-none text-xl"
                                        href="/">
                                        {' '}
                                        RoE
                                    </Link>
                                </Button>
                                <Button asChild variant="secondary">
                                    <Link
                                        className="ml-4 text-sm"
                                        href="/seasons">
                                        Seasons
                                    </Link>
                                </Button>
                                <div className="ml-auto">
                                    <DisplayModeToggle />
                                </div>
                            </div>

                            <main className="w-full flex flex-col gap-4 py-10 px-6 sm:px-10 lg:px-12 text-center">
                                {children}
                            </main>
                        </div>
                    </ThemeProvider>
                </ServiceWorkerProvider>
            </body>
        </html>
    );
}
