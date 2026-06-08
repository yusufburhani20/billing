import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

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
        <GuestLayout maxWidth="max-w-xl">
            <Head title="Pendaftaran Pelanggan" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create a New Account</h2>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Lengkapi data diri Anda di bawah ini</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div className="group">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block ml-1 group-focus-within:text-[#166534] transition-colors">Nama Lengkap</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#166534] transition-colors" />
                            <input
                                type="text"
                                placeholder="Nama Pelanggan"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                className="w-full pl-9 pr-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#166534] focus:border-[#166534] transition-all dark:text-white shadow-sm"
                            />
                        </div>
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    {/* Email Field */}
                    <div className="group">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block ml-1 group-focus-within:text-[#166534] transition-colors">Alamat Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#166534] transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Aktif Pelanggan"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                className="w-full pl-9 pr-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#166534] focus:border-[#166534] transition-all dark:text-white shadow-sm"
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    {/* WhatsApp Field */}
                    <div className="group col-span-2">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block ml-1 group-focus-within:text-[#166534] transition-colors">Nomor WhatsApp</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#166534] transition-colors" />
                            <input
                                type="text"
                                placeholder="08xxxxxxxxx"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#166534] focus:border-[#166534] transition-all dark:text-white shadow-sm"
                            />
                        </div>
                        <InputError message={errors.phone} className="mt-1" />
                    </div>

                    {/* Address Field (Textarea) */}
                    <div className="group col-span-2">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block ml-1 group-focus-within:text-[#166534] transition-colors">Alamat Lengkap</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-[14px] w-4 h-4 text-gray-400 group-focus-within:text-[#166534] transition-colors" />
                            <textarea
                                placeholder="Alamat lengkap tempat pemasangan..."
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                required
                                rows={3}
                                className="w-full !pl-11 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#166534] focus:border-[#166534] transition-all dark:text-white shadow-sm resize-none"
                            />
                        </div>
                        <InputError message={errors.address} className="mt-1" />
                    </div>

                    {/* Password Field */}
                    <div className="group">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block ml-1 group-focus-within:text-[#166534] transition-colors">Kata Sandi</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#166534] transition-colors" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                className="w-full pl-9 pr-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#166534] focus:border-[#166534] transition-all dark:text-white shadow-sm"
                            />
                        </div>
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="group">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block ml-1 group-focus-within:text-[#166534] transition-colors">Ulangi Sandi</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#166534] transition-colors" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                className="w-full pl-9 pr-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#166534] focus:border-[#166534] transition-all dark:text-white shadow-sm"
                            />
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-1" />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        disabled={processing}
                        className="w-full bg-[#166534] hover:bg-green-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-green-800/10"
                    >
                        {processing ? 'Memproses...' : 'Buat Akun Sekarang'} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="relative flex py-2 items-center">
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
                    Daftar dengan Google
                </a>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                    Sudah jadi bagian dari kami?{' '}
                    <Link
                        href={route('login')}
                        className="font-bold text-[#166534] hover:text-green-950 transition-colors"
                    >
                        Login Masuk
                    </Link>
                </p>
            </form>

            {flash?.success && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in" />
                    <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden text-center p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
                        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                            Registrasi <span className="text-[#166534]">Berhasil!</span>
                        </h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 leading-relaxed">
                            {flash.success}
                        </p>
                        <Link
                            href={route('login')}
                            className="w-full bg-[#166534] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-900 transition-colors flex items-center justify-center"
                        >
                            Lanjut ke Login
                        </Link>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
