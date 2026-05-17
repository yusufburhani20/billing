import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, FormEventHandler } from 'react';
import { KeyRound, CheckCircle } from 'lucide-react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Kata Sandi Saat Ini</label>
                        <input
                            type="password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amber-500 dark:text-white"
                        />
                        <InputError message={errors.current_password} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Kata Sandi Baru</label>
                            <input
                                type="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amber-500 dark:text-white"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Konfirmasi Kata Sandi Baru</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amber-500 dark:text-white"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <button 
                        disabled={processing}
                        className="flex items-center gap-3 bg-amber-600 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-700 dark:transition-all disabled:opacity-50"
                    >
                        <KeyRound className="w-4 h-4" /> {processing ? 'Memproses...' : 'Perbarui Kata Sandi'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-2 text-emerald-600">
                            <CheckCircle className="w-4 h-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Sandi berhasil diubah</p>
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
