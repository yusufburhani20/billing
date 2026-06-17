import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    Wifi, 
    CreditCard, 
    Clock, 
    CheckCircle, 
    Package as PackageIcon, 
    Calendar,
    Activity,
    ShieldCheck,
    AlertCircle,
    ArrowRight,
    Zap,
    X,
    ImageIcon,
    Loader2,
} from 'lucide-react';
import { useState, useRef } from 'react';

interface Invoice {
    id: number;
    invoice_number: string;
    amount: number;
    status: 'unpaid' | 'paid' | 'expired';
    due_date: string;
    payment_proof?: string | null;
}

interface IPackage {
    id: number;
    name: string;
    price: number;
    speed: string;
}

interface Props {
    customer: {
        id: number;
        status: string;
        billing_date: number;
        package?: IPackage;
        router?: { name: string };
    };
    invoices: Invoice[];
}

declare global {
    interface Window {
        snap: any;
    }
}

/**
 * Kompres gambar di sisi browser sebelum upload ke server.
 * Mengurangi ukuran dari 3-8MB menjadi ~100-300KB.
 */
function compressImage(file: File, maxWidthPx = 1280, quality = 0.75): Promise<File> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                if (width > maxWidthPx) {
                    height = Math.round((height * maxWidthPx) / width);
                    width = maxWidthPx;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => {
                        if (!blob) { resolve(file); return; }
                        resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        }));
                    },
                    'image/jpeg',
                    quality,
                );
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
}

export default function Dashboard({ customer, invoices }: Props) {
    const { flash } = usePage<any>().props;
    const [selectingMethod, setSelectingMethod] = useState<Invoice | null>(null);
    const [compressing, setCompressing]         = useState(false);
    const [previewInfo, setPreviewInfo]         = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { post } = useForm();
    const uploadForm = useForm({
        payment_proof: null as File | null,
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.files?.[0];
        if (!raw) return;
        const originalKB = (raw.size / 1024).toFixed(0);
        setCompressing(true);
        setPreviewInfo(null);
        const compressed = await compressImage(raw);
        const compressedKB = (compressed.size / 1024).toFixed(0);
        uploadForm.setData('payment_proof', compressed);
        setPreviewInfo(`${originalKB} KB → ${compressedKB} KB`);
        setCompressing(false);
    };

    const currentInvoice = invoices.find(inv => inv.status === 'unpaid');
    const dueDateDisplay = currentInvoice 
        ? new Date(currentInvoice.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : `Tgl 20 Setiap Bulan`;

    const handleSelectPackage = (packageId: number) => {
        if (confirm('Konfirmasi pilihan paket ini? Anda akan langsung mendapatkan invoice untuk aktivasi.')) {
            post(route('customer.select-package', { package_id: packageId }));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                    Customer <span className="text-indigo-600">Portal</span>
                </h2>
            }
        >
            <Head title="Customer Dashboard" />

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
                    
                    {/* Welcome Banner if No Package */}
                    {!customer.package && (
                        <div className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="relative z-10 max-w-2xl">
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Selamat Datang di Idrisiyyah Net!</h3>
                                <p className="text-indigo-100 font-bold text-sm leading-relaxed mb-6">Akun Anda sudah terdaftar. Silakan pilih paket internet Anda untuk memulai pengalaman internet cepat tanpa batas.</p>
                                <Link 
                                    href={route('customer.packages')}
                                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] bg-white text-indigo-600 w-fit px-8 py-4 rounded-[1.5rem] hover:bg-indigo-50 transition-all "
                                >
                                    <Zap className="w-3 h-3 fill-indigo-600" /> Pilih Paket Sekarang <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <PackageIcon className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12" />
                        </div>
                    )}

                    {/* Status Overview Card (Only if has package) */}
                    {customer.package && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
                                <div>
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 rounded-xl w-fit mb-4">
                                        <Wifi className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Layanan</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                            {customer.status === 'active' ? 'AKTIF' : 'NON-AKTIF'}
                                        </span>
                                        {customer.status === 'active' ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-orange-500" />
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <Activity className="w-3 h-3" /> {customer.router?.name || 'Menunggu Aktivasi'}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
                                <div>
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 rounded-xl w-fit mb-4">
                                        <PackageIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Paket Internet</h3>
                                    <div className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                        {customer.package?.name}
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3" /> {customer.package?.speed}
                                    </span>
                                    <Link 
                                        href={route('customer.packages')}
                                        className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                                    >
                                        Ganti Paket
                                    </Link>
                                </div>
                            </div>

                            <Link href={route('customer.invoices.index')} className="bg-indigo-600 p-6 rounded-3xl flex flex-col justify-between hover:bg-indigo-700 transition-colors group cursor-pointer">
                                <div>
                                    <div className="p-3 bg-white/10 text-white rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">Tagihan Bulan Ini</h3>
                                    <div className="text-xl font-black text-white tracking-tighter">
                                        Rp {currentInvoice ? Number(currentInvoice.amount).toLocaleString('id-ID') : '0'}
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/10 text-[10px] font-bold text-indigo-100 uppercase tracking-widest flex items-center justify-between">
                                    <span><Calendar className="w-3 h-3 inline mr-1" /> Jatuh Tempo: {dueDateDisplay}</span>
                                    {!currentInvoice && <span className="px-2 py-1 bg-white/20 rounded text-[8px] font-black tracking-widest uppercase">LUNAS</span>}
                                </div>
                            </Link>

                            <Link href={route('customer.tickets.index')} className="bg-rose-600 p-6 rounded-3xl flex flex-col justify-between hover:bg-rose-700 transition-colors group cursor-pointer">
                                <div>
                                    <div className="p-3 bg-white/10 text-white rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-rose-100 uppercase tracking-widest mb-1">Pusat Bantuan</h3>
                                    <div className="text-xl font-black text-white tracking-tighter leading-tight">
                                        Laporan Gangguan
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/10 text-[10px] font-bold text-rose-100 uppercase tracking-widest flex items-center justify-between">
                                    <span>Buat Tiket Baru</span>
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Invoice History (Only if has invoices) */}
                    {customer.package && (
                        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                                <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">Riwayat Tagihan</h3>
                                <Clock className="w-5 h-5 text-gray-300" />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-gray-700/50">
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">No. Invoice</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Jumlah</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Status</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                        {invoices.map((inv) => (
                                            <tr key={inv.id}>
                                                <td className="px-8 py-6 font-bold text-gray-700 dark:text-gray-300">{inv.invoice_number}</td>
                                                <td className="px-8 py-6 font-black text-gray-900 dark:text-white">Rp {Number(inv.amount).toLocaleString('id-ID')}</td>
                                                <td className="px-8 py-6 text-center">
                                                     {inv.status === 'paid' ? (
                                                         <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">Lunas</span>
                                                     ) : inv.payment_proof ? (
                                                         <span className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest">Menunggu Verifikasi</span>
                                                     ) : (
                                                         <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">Belum Bayar</span>
                                                     )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                     {inv.status === 'unpaid' && !inv.payment_proof && (
                                                         <button 
                                                             onClick={() => setSelectingMethod(inv)}
                                                             className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all"
                                                         >
                                                             Bayar Sekarang
                                                         </button>
                                                     )}
                                                     {inv.status === 'unpaid' && inv.payment_proof && (
                                                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bukti Diunggah</span>
                                                     )}
                                                </td>
                                            </tr>
                                        ))}
                                        {invoices.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="py-12 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">Belum ada riwayat tagihan</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Bank Transfer Payment Modal */}
            {selectingMethod && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectingMethod(null)} />
                    
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[3rem] relative z-10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
                        <div className="p-8 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Transfer Bank</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Invoice #{selectingMethod.invoice_number}</p>
                            </div>
                            <button onClick={() => setSelectingMethod(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 p-6 rounded-3xl">
                                <h4 className="text-[10px] font-black text-indigo-950 dark:text-indigo-400 uppercase tracking-widest mb-3">Informasi Rekening</h4>
                                <div className="space-y-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Bank:</span>
                                        <span className="text-gray-900 dark:text-white font-black">BNI</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">No. Rekening:</span>
                                        <span className="text-gray-900 dark:text-white font-black text-sm">2007507509</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Atas Nama:</span>
                                        <span className="text-gray-900 dark:text-white font-black">Yayasan Idrisiyyah</span>
                                    </div>
                                    <div className="flex justify-between border-t border-indigo-100/50 dark:border-indigo-900/30 pt-2 mt-2">
                                        <span className="text-gray-400">Jumlah Transfer:</span>
                                        <span className="text-indigo-600 dark:text-indigo-400 font-black text-base">
                                            Rp {Number(selectingMethod.amount).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (compressing) return;
                                setPreviewInfo(null);
                                uploadForm.post(route('customer.invoices.upload-proof', selectingMethod.id), {
                                    onSuccess: () => {
                                        setSelectingMethod(null);
                                        uploadForm.reset();
                                        setPreviewInfo(null);
                                    }
                                });
                            }} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Unggah Bukti Transfer</label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 dark:file:bg-gray-700 dark:file:text-white cursor-pointer"
                                    />
                                    {compressing && (
                                        <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Mengompres gambar...
                                        </div>
                                    )}
                                    {previewInfo && !compressing && (
                                        <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                            <ImageIcon className="w-3 h-3" />
                                            Ukuran dioptimalkan: {previewInfo}
                                        </div>
                                    )}
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 leading-normal">
                                        Gambar akan dikompres otomatis untuk mempercepat upload.
                                    </p>
                                    {uploadForm.errors.payment_proof && (
                                        <span className="text-xs text-red-500 font-bold block mt-1">{uploadForm.errors.payment_proof}</span>
                                    )}
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setSelectingMethod(null); setPreviewInfo(null); }}
                                        className="flex-1 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-300 transition-all border-none"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploadForm.processing || compressing || !uploadForm.data.payment_proof}
                                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 border-none shadow-md shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2"
                                    >
                                        {uploadForm.processing
                                            ? <><Loader2 className="w-3 h-3 animate-spin" /> Mengirim...</>
                                            : compressing
                                                ? <><Loader2 className="w-3 h-3 animate-spin" /> Memproses...</>
                                                : 'Kirim Bukti'
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
