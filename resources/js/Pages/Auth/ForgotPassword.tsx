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
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Reset Kata Sandi Anda</p>
            </div>

            <div className="mb-6 text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-center">
                Lupa kata sandi? Tidak masalah. Berikan alamat email Anda dan kami akan mengirimkan tautan untuk mereset kata sandi Anda.
            </div>

            {status && (
                <div className="mb-6 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg text-center border border-emerald-200 dark:border-emerald-800">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Email Field */}
                <div className="group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1 group-focus-within:text-indigo-600 transition-colors">Alamat Email Terdaftar</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent rounded-xl text-xs font-bold focus:ring-0 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white"
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
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl text-xs font-black uppercase tracking-[0.3em] hover:bg-indigo-700 dark:transition-all flex items-center justify-center gap-3 disabled:opacity-50 mb-4"
                    >
                        {processing ? 'Memproses...' : 'Kirim Link Reset'} <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    <div className="text-center mt-6">
                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-2 text-[11px] font-black text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="w-3 h-3" /> Kembali ke Halaman Login
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
