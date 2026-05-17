import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/AuthenticatedLayout'; // Wait, it should use GuestLayout
import InputError from '@/Components/InputError';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Mail, Lock, LogIn, ArrowRight, CheckCircle } from 'lucide-react';
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
            <Head title="Login Portal" />

            {/* Success Notification from Registration */}
            {(flash?.success || status) && (
                <div className="mb-8 p-5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-3xl flex gap-4 items-start animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-widest mb-1">Berhasil!</h4>
                        <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 leading-relaxed uppercase tracking-tight">
                            {flash?.success || status}
                        </p>
                    </div>
                </div>
            )}

            <div className="mb-6 text-center">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Masuk dengan akun anda</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Email Field */}
                <div className="group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1 group-focus-within:text-indigo-600 transition-colors">Alamat Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="email"
                            placeholder="nama@email.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent rounded-xl text-xs font-bold focus:ring-0 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white"
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                {/* Password Field */}
                <div className="group">
                    <div className="flex items-center justify-between mb-1.5 px-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">Kata Sandi</label>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent rounded-xl text-xs font-bold focus:ring-0 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                {/* Remember Me */}
                <div className="flex items-center px-1">
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="ml-3 text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">Ingat Saya</span>
                    </label>
                </div>

                <div className="pt-2">
                    <button
                        disabled={processing}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl text-xs font-black uppercase tracking-[0.3em] hover:bg-indigo-700 dark:transition-all flex items-center justify-center gap-3 disabled:opacity-50 mb-5"
                    >
                        {processing ? 'Memproses...' : 'Login Ke Portal'} <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    <div className="flex flex-col gap-2 text-center">
                        {canResetPassword && (
                            <div>
                                <span className="text-[11px] font-bold text-gray-400">Lupa Password? </span>
                                <Link
                                    href={route('password.request')}
                                    className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 transition-colors"
                                >
                                    Klik disini
                                </Link>
                            </div>
                        )}
                        
                        <div>
                            <span className="text-[11px] font-bold text-gray-400">Belum memiliki akun? </span>
                            <Link
                                href={route('register')}
                                className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                Daftar disini
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </Guest>
    );
}
