import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { 
    Wifi, 
    ArrowRight,
    CheckCircle,
    Package as PackageIcon,
    Zap,
    ShieldCheck,
    X,
    Info,
    CreditCard
} from 'lucide-react';
import { useState } from 'react';

interface IPackage {
    id: number;
    name: string;
    price: number;
    speed: string;
}

interface Props {
    customer: {
        id: number;
        package?: IPackage;
    };
    availablePackages: IPackage[];
}

export default function Index({ customer, availablePackages }: Props) {
    const { flash } = usePage<any>().props;
    const { post, processing } = useForm();
    const [selectedPackage, setSelectedPackage] = useState<IPackage | null>(null);

    const handleConfirmSelection = () => {
        if (!selectedPackage) return;
        post(route('customer.select-package', { package_id: selectedPackage.id }), {
            onSuccess: () => setSelectedPackage(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                    Pilihan <span className="text-indigo-600">Paket Internet</span>
                </h2>
            }
        >
            <Head title="Pilihan Paket Internet" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Success Flash Message */}
                    {flash?.message && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 p-6 rounded-[2rem] flex gap-4 items-center animate-in fade-in slide-in-from-top-4 duration-500 mb-8">
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-widest mb-0.5">Informasi Sistem</h4>
                                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{flash?.message}</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-700 mb-8">
                        <div className="max-w-2xl">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
                                {customer.package ? 'Upgrade Layanan Anda' : 'Pilih Paket Pertama Anda'}
                            </h3>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                Nikmati koneksi internet super cepat dan stabil dengan pilihan paket fiber optic terbaik kami. Pilih paket yang sesuai dengan kebutuhan Anda.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {availablePackages.map((pkg) => (
                            <div key={pkg.id} className={`bg-white dark:bg-gray-800 p-10 rounded-[3rem] border-2 transition-all relative overflow-hidden group ${
                                customer.package?.id === pkg.id 
                                ? 'border-indigo-600 ring-4 ring-indigo-500/10' 
                                : 'border-gray-100 dark:border-gray-700 hover:border-indigo-400 '
                            }`}>
                                {customer.package?.id === pkg.id && (
                                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-bl-[1.5rem] flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3" /> Aktif
                                    </div>
                                )}

                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500 ${
                                    customer.package?.id === pkg.id 
                                    ? 'bg-indigo-600 text-white dark:' 
                                    : 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600'
                                }`}>
                                    <Wifi className="w-8 h-8" />
                                </div>

                                <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-1">{pkg.name}</h4>
                                <div className="flex items-center gap-2 mb-8">
                                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{pkg.speed} Speed</span>
                                </div>

                                <ul className="space-y-4 mb-10 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                    <li className="flex items-center gap-3">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> Unlimited Quota
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> 24/7 Support
                                    </li>
                                </ul>

                                <div className="mt-auto pt-8 border-t border-gray-50 dark:border-gray-700">
                                    <div className="flex items-baseline gap-1 mb-6 whitespace-nowrap">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rp</span>
                                        <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{Number(pkg.price).toLocaleString('id-ID')}</span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">/ Bln</span>
                                    </div>

                                    <button
                                        onClick={() => setSelectedPackage(pkg)}
                                        disabled={processing || customer.package?.id === pkg.id}
                                        className={`w-full py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                                            customer.package?.id === pkg.id
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:'
                                        }`}
                                    >
                                        {customer.package?.id === pkg.id ? 'Paket Aktif' : (customer.package ? 'Ganti Paket' : 'Pilih Paket')} <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Checkout Confirmation Modal */}
            {selectedPackage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedPackage(null)} />
                    
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[3rem] relative z-10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
                        <div className="p-8 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Konfirmasi Pesanan</h3>
                            <button onClick={() => setSelectedPackage(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-[2rem] flex gap-4">
                                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                                    <Wifi className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{selectedPackage.name}</h4>
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{selectedPackage.speed} Speed Unlimited</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Biaya Paket</span>
                                    <span className="text-sm font-black text-gray-900 dark:text-white whitespace-nowrap">Rp {Number(selectedPackage.price).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Biaya Registrasi</span>
                                    <span className="text-sm font-black text-emerald-600">Gratis</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center px-2">
                                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">Total Tagihan</span>
                                    <span className="text-xl font-black text-indigo-600 whitespace-nowrap">Rp {Number(selectedPackage.price).toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl flex gap-3 border border-amber-100 dark:border-amber-800/30">
                                <Info className="w-5 h-5 text-amber-600 shrink-0" />
                                <p className="text-[9px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed uppercase tracking-wider">
                                    Tagihan akan segera diterbitkan setelah konfirmasi. Layanan akan aktif setelah pembayaran diverifikasi.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={() => setSelectedPackage(null)}
                                className="flex-1 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-gray-700 transition-colors"
                            >
                                Batalkan
                            </button>
                            <button 
                                onClick={handleConfirmSelection}
                                disabled={processing}
                                className="flex-2 bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all dark:flex items-center justify-center gap-2"
                            >
                                <CreditCard className="w-4 h-4" /> {processing ? 'Memproses...' : 'Konfirmasi & Buat Tagihan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
