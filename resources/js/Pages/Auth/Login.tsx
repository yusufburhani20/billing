import { useEffect, FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import Guest from '@/Layouts/GuestLayout';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword?: boolean }) {
    const { flash } = usePage<any>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <Guest>
            <Head title="Secure Client Login" />

            {/* Success Notification from Registration */}
            {(flash?.success || status) && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 rounded-xl flex gap-3 items-start animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center text-green-700 shrink-0">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-green-900 dark:text-green-400 uppercase tracking-widest mb-0.5">Berhasil!</h4>
                        <p className="text-[11px] font-bold text-green-850 dark:text-green-300 leading-relaxed uppercase tracking-tight">
                            {flash?.success || status}
                        </p>
                    </div>
                </div>
            )}

            <div className="mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Secure Client Login</h2>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Email Field */}
                <div className="group">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block group-focus-within:text-[#166534] transition-colors">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#166534] transition-colors" />
                        <input
                            type="email"
                            placeholder="nama@email.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#166534] focus:border-[#166534] transition-all dark:text-white shadow-sm"
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                {/* Password Field */}
                <div className="group">
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-focus-within:text-[#166534] transition-colors">
                            Password
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-semibold text-[#166534] hover:text-green-950 transition-colors"
                            >
                                Forgot?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#166534] transition-colors" />
                        <input
                            type="password"
                            placeholder="••••••••••••"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#166534] focus:border-[#166534] transition-all dark:text-white shadow-sm"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                    <input
                        id="remember"
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#166534] focus:ring-[#166534] cursor-pointer"
                    />
                    <label htmlFor="remember" className="ml-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                        Remember Me
                    </label>
                </div>

                {/* Buttons and Links */}
                <div className="pt-2">
                    <button
                        disabled={processing}
                        className="w-full bg-[#166534] hover:bg-green-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-green-800/10"
                    >
                        {processing ? 'Processing...' : 'Login'}
                    </button>

                    <div className="relative flex py-4 items-center">
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                        <span className="flex-shrink mx-4 text-xs font-medium text-gray-400">or</span>
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                    </div>

                    <a
                        href={route('auth.google')}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 py-3 rounded-xl text-xs font-bold text-gray-700 dark:text-white flex items-center justify-center gap-3 transition-colors shadow-sm"
                    >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Log in with Google
                    </a>
                    
                    <div className="text-center mt-6">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Not a member yet? </span>
                        <Link
                            href={route('register')}
                            className="text-xs font-bold text-[#166534] hover:text-green-950 transition-colors"
                        >
                            Create a New Account
                        </Link>
                    </div>
                </div>
            </form>
        </Guest>
    );
}
