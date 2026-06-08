import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Password" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Forgot Password</h2>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Reset Kata Sandi Anda</p>
            </div>

            <div className="mb-6 text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-center">
                Lupa kata sandi? Tidak masalah. Berikan alamat email Anda dan kami akan mengirimkan tautan untuk mereset kata sandi Anda.
            </div>

            {status && (
                <div className="mb-6 text-xs font-bold text-[#166534] bg-green-50 dark:bg-green-950/20 p-3.5 rounded-xl text-center border border-green-200 dark:border-green-800">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Email Field */}
                <div className="group">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block ml-1 group-focus-within:text-[#166534] transition-colors">
                        Alamat Email Terdaftar
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#166534] transition-colors" />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#166534] focus:border-[#166534] transition-all dark:text-white shadow-sm"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nama@email.com"
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="pt-2">
                    <button
                        disabled={processing}
                        className="w-full bg-[#166534] hover:bg-green-900 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-green-800/10"
                    >
                        {processing ? 'Memproses...' : 'Kirim Link Reset'} <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    <div className="text-center mt-6">
                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#166534] transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Halaman Login
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
