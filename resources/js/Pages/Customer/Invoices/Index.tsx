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
}

interface Props {
    invoices: Invoice[];
}

declare global {
    interface Window {
        snap: any;
    }
}

export default function Index({ invoices }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [paying, setPaying] = useState<number | null>(null);
    const [selectingMethod, setSelectingMethod] = useState<Invoice | null>(null);
    const { post } = useForm();

    const PAYMENT_METHODS = [
        { id: 'bca_va', name: 'BCA Virtual Account', icon: '🏦', base: 4000, vat: 440, type: 'flat' },
        { id: 'mandiri_va', name: 'Mandiri Virtual Account', icon: '🏦', base: 4000, vat: 440, type: 'flat' },
        { id: 'bni_va', name: 'BNI Virtual Account', icon: '🏦', base: 4000, vat: 440, type: 'flat' },
        { id: 'bri_va', name: 'BRI Virtual Account', icon: '🏦', base: 4000, vat: 440, type: 'flat' },
        { id: 'qris', name: 'QRIS', icon: '📱', base: 0.007, vat: 0.00077, type: 'percent' },
        { id: 'gopay', name: 'GoPay', icon: '📱', base: 0.02, vat: 0.0022, type: 'percent' },
        { id: 'shopeepay', name: 'ShopeePay', icon: '📱', base: 0.02, vat: 0.0022, type: 'percent' },
        { id: 'alfamart', name: 'Alfamart', icon: '🏪', base: 5000, vat: 550, type: 'flat' },
        { id: 'indomaret', name: 'Indomaret', icon: '🏪', base: 5000, vat: 550, type: 'flat' },
    ];

    const calculateFee = (invoice: Invoice, method: typeof PAYMENT_METHODS[0]) => {
        const amount = Number(invoice.amount);
        if (method.type === 'percent') {
            const base = Math.ceil(amount * method.base);
            const vat = Math.ceil(amount * method.vat);
            return { base, vat, total: base + vat };
        }
        return { base: method.base, vat: method.vat, total: method.base + method.vat };
    };

    const handlePay = async (invoice: Invoice, methodId: string) => {
        const method = PAYMENT_METHODS.find(m => m.id === methodId);
        if (!method) return;

        const fee = calculateFee(invoice, method);
        setPaying(invoice.id);
        setSelectingMethod(null);
        
        try {
            const response = await fetch(route('customer.payment.snap-token', invoice.id), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    payment_method: methodId,
                    admin_fee: fee.total
                })
            });
            const data = await response.json();
            
            if (data.token) {
                window.snap.pay(data.token, {
                    onSuccess: function(result: any) {
                        alert("Pembayaran Berhasil!");
                        location.reload();
                    },
                    onPending: function(result: any) {
                        alert("Menunggu Pembayaran...");
                    },
                    onError: function(result: any) {
                        alert("Pembayaran Gagal!");
                    },
                    onClose: function() {
                        setPaying(null);
                    }
                });
            }
        } catch (error) {
            console.error(error);
            setPaying(null);
        }
    };

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
                                                        invoice.status === 'unpaid' ? 'bg-amber-50 text-amber-600' : 
                                                        'bg-rose-50 text-rose-600'
                                                    }`}>
                                                        {invoice.status === 'paid' ? 'Lunas' : invoice.status === 'unpaid' ? 'Belum Bayar' : 'Kadaluarsa'}
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
                                            {invoice.status === 'unpaid' && (
                                                <button 
                                                    onClick={() => setSelectingMethod(invoice)}
                                                    disabled={paying === invoice.id}
                                                    className="mt-4 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                                                >
                                                    {paying === invoice.id ? 'Memproses...' : 'Bayar Sekarang'} <ArrowRight className="w-3 h-3" />
                                                </button>
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

            {/* Payment Method Selection Modal */}
            {selectingMethod && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectingMethod(null)} />
                    
                    <div className="bg-white dark:bg-gray-800 w-full max-lg rounded-[3rem] relative z-10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
                        <div className="p-8 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Pilih Metode Pembayaran</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Invoice #{selectingMethod.invoice_number}</p>
                            </div>
                            <button onClick={() => setSelectingMethod(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-3">
                                {PAYMENT_METHODS.map((method) => {
                                    const fee = calculateFee(selectingMethod, method);
                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => handlePay(selectingMethod, method.id)}
                                            className="w-full p-5 rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                    {method.icon}
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{method.name}</h4>
                                                    <div className="flex flex-col gap-0.5 mt-1">
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Admin Dasar: Rp {fee.base.toLocaleString('id-ID')}</p>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">PPN (11%): Rp {fee.vat.toLocaleString('id-ID')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total</p>
                                                <p className="text-sm font-black text-indigo-600">Rp {(Number(selectingMethod.amount) + fee.total).toLocaleString('id-ID')}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                                <Info className="w-5 h-5" />
                            </div>
                            <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider">
                                Biaya admin dibebankan sesuai kebijakan penyedia jasa pembayaran. Silakan pilih metode yang paling nyaman bagi Anda.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
