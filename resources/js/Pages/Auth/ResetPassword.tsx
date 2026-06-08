import { useEffect, FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
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
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Reset Password</h2>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Buat Kata Sandi Baru Anda</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Email Field */}
                <div className="group">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block group-focus-within:text-[#166534] transition-colors">
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
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block group-focus-within:text-[#166534] transition-colors">
                        New Password
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

                {/* Confirm Password Field */}
                <div className="group">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block group-focus-within:text-[#166534] transition-colors">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#166534] transition-colors" />
                        <input
                            type="password"
                            placeholder="••••••••••••"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#166534] focus:border-[#166534] transition-all dark:text-white shadow-sm"
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                <div className="pt-2">
                    <button
                        disabled={processing}
                        className="w-full bg-[#166534] hover:bg-green-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-green-800/10"
                    >
                        {processing ? 'Processing...' : 'Reset Password'} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
