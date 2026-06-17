import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { 
    FileText, 
    CreditCard, 
    Clock, 
    CheckCircle2, 
    Search,
    X,
    Info,
    ArrowRight
} from 'lucide-react';
import { useState } from 'react';

interface Invoice {
    id: number;
    invoice_number: string;
    amount: number;
    due_date: string;
    status: 'unpaid' | 'paid' | 'expired';
    paid_at: string | null;
    payment_proof?: string | null;
}

interface Props {
    invoices: Invoice[];
}

export default function Index({ invoices }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectingMethod, setSelectingMethod] = useState<Invoice | null>(null);
    const { post } = useForm();
    const uploadForm = useForm({
        payment_proof: null as File | null,
    });

    const filteredInvoices = invoices.filter(inv => 
        inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                            Riwayat <span className="text-indigo-600">Tagihan</span>
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Kelola dan bayar tagihan internet Anda</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Cari nomor tagihan..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        />
                    </div>
                </div>
            }
        >
            <Head title="Tagihan Saya" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {invoices.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-20 rounded-[3rem] border border-gray-100 dark:border-gray-700 text-center">
                            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Belum Ada Tagihan</h3>
                            <p className="text-gray-400 text-sm font-medium">Tagihan pertama Anda akan muncul di sini setelah diterbitkan oleh sistem.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredInvoices.map((invoice) => (
                                <div key={invoice.id} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 hover:hover:transition-all group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                                                invoice.status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 
                                                invoice.status === 'unpaid' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 
                                                'bg-rose-50 dark:bg-rose-900/20 text-rose-600'
                                            }`}>
                                                <CreditCard className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nomor Tagihan</div>
                                                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">#{invoice.invoice_number}</h3>
                                                <div className="flex items-center gap-3 mt-2">
                                                     <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                         invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 
                                                         invoice.payment_proof ? 'bg-cyan-50 text-cyan-600' : 
                                                         invoice.status === 'unpaid' ? 'bg-amber-50 text-amber-600' : 
                                                         'bg-rose-50 text-rose-600'
                                                     }`}>
                                                         {invoice.status === 'paid' ? 'Lunas' : invoice.payment_proof ? 'Menunggu Verifikasi' : invoice.status === 'unpaid' ? 'Belum Bayar' : 'Kadaluarsa'}
                                                     </span>
                                                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> Jatuh Tempo: {new Date(invoice.due_date).toLocaleDateString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:items-end gap-2">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Bayar</div>
                                            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
                                                Rp {Number(invoice.amount).toLocaleString('id-ID')}
                                            </div>
                                             {invoice.status === 'unpaid' && !invoice.payment_proof && (
                                                 <button 
                                                     onClick={() => setSelectingMethod(invoice)}
                                                     className="mt-4 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all"
                                                 >
                                                     Bayar Sekarang <ArrowRight className="w-3 h-3" />
                                                 </button>
                                             )}
                                             {invoice.status === 'unpaid' && invoice.payment_proof && (
                                                 <div className="mt-4 flex items-center gap-2 px-6 py-3 bg-cyan-50 text-cyan-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
                                                     Bukti Transfer Diunggah
                                                 </div>
                                             )}
                                            {invoice.status === 'paid' && (
                                                <div className="mt-4 flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
                                                    Dibayar pada {new Date(invoice.paid_at!).toLocaleDateString('id-ID')} <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                uploadForm.post(route('customer.invoices.upload-proof', selectingMethod.id), {
                                    onSuccess: () => {
                                        setSelectingMethod(null);
                                        uploadForm.reset();
                                        alert('Bukti transfer berhasil dikirim. Menunggu verifikasi admin.');
                                    }
                                });
                            }} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Unggah Bukti Transfer</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => uploadForm.setData('payment_proof', e.target.files?.[0] || null)}
                                        required
                                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 dark:file:bg-gray-700 dark:file:text-white cursor-pointer"
                                    />
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 leading-normal">
                                        Format: JPG, JPEG, PNG. Maksimal 2MB.
                                    </p>
                                    {uploadForm.errors.payment_proof && (
                                        <span className="text-xs text-red-500 font-bold block mt-1">{uploadForm.errors.payment_proof}</span>
                                    )}
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectingMethod(null)}
                                        className="flex-1 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-300 transition-all border-none"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploadForm.processing}
                                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 border-none shadow-md shadow-indigo-100 dark:shadow-none"
                                    >
                                        {uploadForm.processing ? 'Mengirim...' : 'Kirim Bukti'}
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
