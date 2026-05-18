import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

export default function Register() {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Pendaftaran Pelanggan" />

            <div className="mb-2 text-center">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Lengkapi data diri Anda di bawah ini
                </p>
            </div>

            <form onSubmit={submit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    {/* Name Field */}
                    <div className="group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1 group-focus-within:text-indigo-600 transition-colors">Nama Lengkap</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Ahmad Subarjo"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent rounded-lg text-xs font-bold focus:ring-0 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white"
                            />
                        </div>
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    {/* Email Field */}
                    <div className="group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1 group-focus-within:text-indigo-600 transition-colors">Alamat Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="email"
                                placeholder="nama@email.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent rounded-lg text-xs font-bold focus:ring-0 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white"
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    {/* WhatsApp Field */}
                    <div className="group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1 group-focus-within:text-indigo-600 transition-colors">Nomor WhatsApp</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="08xxxxxxxxx"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                                className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent rounded-lg text-xs font-bold focus:ring-0 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white"
                            />
                        </div>
                        <InputError message={errors.phone} className="mt-1" />
                    </div>

                    {/* Address Field */}
                    <div className="group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1 group-focus-within:text-indigo-600 transition-colors">Alamat Lengkap</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Alamat pemasangan"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                required
                                className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent rounded-lg text-xs font-bold focus:ring-0 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white"
                            />
                        </div>
                        <InputError message={errors.address} className="mt-1" />
                    </div>

                    {/* Password Field */}
                    <div className="group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1 group-focus-within:text-indigo-600 transition-colors">Kata Sandi</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent rounded-lg text-xs font-bold focus:ring-0 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white"
                            />
                        </div>
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1 group-focus-within:text-indigo-600 transition-colors">Ulangi Sandi</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent rounded-lg text-xs font-bold focus:ring-0 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white"
                            />
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-1" />
                    </div>
                </div>

                <div className="pt-0">
                    <button
                        disabled={processing}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-xs font-black uppercase tracking-[0.3em] hover:bg-indigo-700 dark:transition-all flex items-center justify-center gap-2 disabled:opacity-50 mb-2"
                    >
                        {processing ? 'Memproses...' : 'Buat Akun Sekarang'} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">atau</span>
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                </div>

                <a
                    href={route('auth.google')}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 py-2.5 rounded-lg text-xs font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all dark:text-white text-center shadow-sm"
                >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Daftar dengan Google
                </a>

                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                    Sudah jadi bagian dari kami?{' '}
                    <Link
                        href={route('login')}
                        className="text-indigo-600 hover:text-indigo-700 font-black"
                    >
                        Login Masuk
                    </Link>
                </p>
            </form>

            {flash?.success && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in" />
                    <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[3rem] relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden text-center p-10">
                        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
                            Registrasi <span className="text-green-500">Berhasil!</span>
                        </h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 leading-relaxed">
                            {flash.success}
                        </p>
                        <Link
                            href={route('login')}
                            className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.3em] hover:bg-indigo-700 dark:transition-all flex items-center justify-center"
                        >
                            Lanjut ke Login
                        </Link>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
