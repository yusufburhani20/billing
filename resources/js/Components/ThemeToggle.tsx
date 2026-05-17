import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (theme === 'dark' || (!theme && systemTheme)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-transparent dark:border-gray-700 "
            aria-label="Toggle Theme"
        >
            {isDark ? (
                <Sun className="w-5 h-5 transition-all animate-in spin-in-180 duration-500" />
            ) : (
                <Moon className="w-5 h-5 transition-all animate-in spin-in-180 duration-500" />
            )}
        </button>
    );
}
