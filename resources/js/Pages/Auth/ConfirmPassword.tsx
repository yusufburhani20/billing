import { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Lock, ArrowRight } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Confirm Password</h2>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Konfirmasi Kata Sandi Anda</p>
            </div>

            <div className="mb-6 text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-center">
                Ini adalah area aman aplikasi. Silakan konfirmasi kata sandi Anda sebelum melanjutkan.
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Password Field */}
                <div className="group">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block group-focus-within:text-[#166534] transition-colors">
                        Password
                    </label>
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

                <div className="pt-2">
                    <button
                        disabled={processing}
                        className="w-full bg-[#166534] hover:bg-green-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-green-800/10"
                    >
                        {processing ? 'Processing...' : 'Confirm'} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
