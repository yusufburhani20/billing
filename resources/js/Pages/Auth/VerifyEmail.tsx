import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, LogOut, Send } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Verify Email</h2>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Verifikasi Alamat Email Anda</p>
            </div>

            <div className="mb-6 text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-center">
                Terima kasih telah mendaftar! Sebelum memulai, harap verifikasi alamat email Anda dengan mengeklik tautan yang baru saja kami kirimkan ke email Anda. Jika Anda tidak menerima email tersebut, kami dengan senang hati akan mengirimkan yang baru.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 p-3.5 rounded-xl text-center border border-green-200 dark:border-green-800">
                    Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="pt-2 flex flex-col gap-3">
                    <button
                        disabled={processing}
                        className="w-full bg-[#166534] hover:bg-green-900 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-green-800/10"
                    >
                        {processing ? 'Memproses...' : 'Kirim Ulang Email Verifikasi'} <Send className="w-4 h-4" />
                    </button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 py-3 rounded-xl text-xs font-bold text-gray-500 dark:text-white flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <LogOut className="w-4 h-4" /> Keluar (Log Out)
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
