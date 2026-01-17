'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import clsx from 'clsx';
import posthog from 'posthog-js';

export function DisplayModeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    className={clsx({
                        'underline font-bold': theme === 'light',
                    })}
                    onClick={() => {
                        setTheme('light');
                        posthog.capture('theme_changed', {
                            new_theme: 'light',
                            previous_theme: theme,
                        });
                    }}
                >
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={clsx({
                        'underline font-bold': theme === 'dark',
                    })}
                    onClick={() => {
                        setTheme('dark');
                        posthog.capture('theme_changed', {
                            new_theme: 'dark',
                            previous_theme: theme,
                        });
                    }}
                >
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={clsx({
                        'underline font-bold': theme === 'system',
                    })}
                    onClick={() => {
                        setTheme('system');
                        posthog.capture('theme_changed', {
                            new_theme: 'system',
                            previous_theme: theme,
                        });
                    }}
                >
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
