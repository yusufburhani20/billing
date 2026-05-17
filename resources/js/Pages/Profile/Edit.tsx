import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, ShieldCheck, Mail, Fingerprint } from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                        Pengaturan <span className="text-indigo-600">Profil</span>
                    </h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Kelola informasi akun dan keamanan kata sandi Anda</p>
                </div>
            }
        >
            <Head title="Pengaturan Profil" />

            <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Profile Info Section */}
                <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-700 dark:">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Informasi Profil</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Perbarui nama dan alamat email akun Anda</p>
                        </div>
                    </div>
                    
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-2xl"
                    />
                </div>

                {/* Password Section */}
                <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-700 dark:">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Keamanan Akun</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Pastikan akun Anda menggunakan kata sandi yang kuat</p>
                        </div>
                    </div>

                    <UpdatePasswordForm className="max-w-2xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
