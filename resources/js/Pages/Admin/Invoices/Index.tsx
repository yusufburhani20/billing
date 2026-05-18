import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import { 
    FileText, 
    Trash2, 
    CheckCircle, 
    Clock, 
    CreditCard,
    Calendar,
    Download,
    Eye,
    Plus,
    Search,
    MessageSquare,
    Mail
} from 'lucide-react';
import { useState } from 'react';

interface User {
    name: string;
}

interface Package {
    id: number;
    name: string;
    speed: string;
}

interface Router {
    id: number;
    name: string;
}

interface Payment {
    id: number;
    amount: number;
    payment_method: string;
    status: string;
    reference: string;
    created_at: string;
}

interface Customer {
    id: number;
    customer_code: string;
    phone: string;
    address: string;
    pppoe_username: string;
    user: User;
    package?: Package;
    router?: Router;
}

interface Invoice {
    id: number;
    invoice_number: string;
    customer_id: number;
    amount: number;
    status: 'unpaid' | 'paid' | 'expired';
    due_date: string;
    paid_at: string | null;
    created_at: string;
    customer: Customer;
    payments?: Payment[];
}

interface ActiveCustomer {
    id: number;
    name: string;
    customer_code: string;
    package_name: string;
    price: number;
}

interface Props {
    invoices: Invoice[];
    activeCustomers?: ActiveCustomer[];
}

export default function Index({ invoices, activeCustomers = [] }: Props) {
    const { post, delete: destroy, processing } = useForm();
    const { flash } = usePage<any>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [sendingWaId, setSendingWaId] = useState<number | null>(null);
    const [sendingEmailId, setSendingEmailId] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isBulkSendingWa, setIsBulkSendingWa] = useState(false);
    const [isBulkSendingEmail, setIsBulkSendingEmail] = useState(false);

    // Generator States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isBulkGenerating, setIsBulkGenerating] = useState(false);

    const createForm = useForm({
        customer_id: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const handleCreateInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.invoices.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            }
        });
    };

    const handleBulkGenerate = () => {
        if (confirm('Generate tagihan baru secara masal untuk seluruh pelanggan aktif pada bulan ini? Pelanggan yang sudah memiliki tagihan bulan ini tidak akan terduplikasi.')) {
            setIsBulkGenerating(true);
            router.post(route('admin.invoices.bulk-generate'), {}, {
                onFinish: () => setIsBulkGenerating(false),
                preserveScroll: true,
            });
        }
    };

    const filteredInvoices = invoices.filter(inv => 
        inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredInvoices.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredInvoices.map(inv => inv.id));
        }
    };

    const markAsPaid = (id: number) => {
        if (confirm('Konfirmasi pembayaran manual?')) {
            post(route('admin.invoices.pay', id));
        }
    };

    const sendWhatsapp = (id: number) => {
        if (confirm('Kirim notifikasi WhatsApp manual ke pelanggan?')) {
            setSendingWaId(id);
            router.post(route('admin.invoices.whatsapp', id), {}, {
                onFinish: () => setSendingWaId(null),
                preserveScroll: true,
            });
        }
    };

    const sendEmail = (id: number) => {
        if (confirm('Kirim notifikasi email manual ke pelanggan?')) {
            setSendingEmailId(id);
            router.post(route('admin.invoices.email', id), {}, {
                onFinish: () => setSendingEmailId(null),
                preserveScroll: true,
            });
        }
    };

    const bulkSendWhatsapp = () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Kirim notifikasi WhatsApp masal ke ${selectedIds.length} pelanggan terpilih?`)) {
            setIsBulkSendingWa(true);
            router.post(route('admin.invoices.bulk-whatsapp'), { ids: selectedIds }, {
                onFinish: () => {
                    setIsBulkSendingWa(false);
                    setSelectedIds([]);
                },
                preserveScroll: true,
            });
        }
    };

    const bulkSendEmail = () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Kirim notifikasi email masal ke ${selectedIds.length} pelanggan terpilih?`)) {
            setIsBulkSendingEmail(true);
            router.post(route('admin.invoices.bulk-email'), { ids: selectedIds }, {
                onFinish: () => {
                    setIsBulkSendingEmail(false);
                    setSelectedIds([]);
                },
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                    Billing <span className="text-indigo-600">Invoices</span>
                </h2>
            }
        >
            <Head title="Invoices" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Success Flash Message */}
                    {flash?.message && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 p-6 rounded-[2rem] flex gap-4 items-center animate-in fade-in slide-in-from-top-4 duration-500 mb-8">
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-widest mb-0.5">Berhasil</h4>
                                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{flash?.message}</p>
                            </div>
                        </div>
                    )}

                    {/* Error/Warning Flash Message */}
                    {flash?.error && (
                        <div className="bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 p-6 rounded-[2rem] flex gap-4 items-center animate-in fade-in slide-in-from-top-4 duration-500 mb-8">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
                                <Trash2 className="w-6 h-6" stroke="currentColor" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-red-900 dark:text-red-400 uppercase tracking-widest mb-0.5">Gagal / Peringatan</h4>
                                <p className="text-xs font-bold text-red-700 dark:text-red-300">{flash?.error}</p>
                            </div>
                        </div>
                    )}

                    {/* Action Bar (Search & Buttons) */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-1">
                        {/* Search Input on the Left */}
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Cari nomor tagihan atau nama pelanggan..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/30 transition-all dark:text-white shadow-sm"
                            />
                        </div>

                        {/* Action Buttons on the Right */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={handleBulkGenerate}
                                disabled={isBulkGenerating}
                                className="flex items-center gap-2 px-5 py-3 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-all disabled:opacity-50 border border-transparent shadow-sm"
                            >
                                {isBulkGenerating ? (
                                    <>
                                        <svg className="animate-spin w-3 h-3 text-cyan-600" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Masal'
                                )}
                            </button>
                            
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-md shadow-indigo-100 dark:shadow-none border border-transparent"
                            >
                                <Plus className="w-4 h-4" /> Buat Tagihan
                            </button>

                            <a 
                                href={route('admin.reports.excel')} 
                                className="flex items-center gap-2 px-5 py-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all border border-transparent shadow-sm"
                            >
                                <Download className="w-4 h-4" /> Excel
                            </a>

                            <a 
                                href={route('admin.reports.pdf')} 
                                className="flex items-center gap-2 px-5 py-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all border border-transparent shadow-sm"
                            >
                                <FileText className="w-4 h-4" /> PDF
                            </a>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-700/50">
                                        <th className="px-6 py-5 w-12 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={filteredInvoices.length > 0 && selectedIds.length === filteredInvoices.length}
                                                onChange={toggleSelectAll}
                                                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />
                                        </th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Invoice</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                    {filteredInvoices.map((inv) => (
                                        <tr key={inv.id} className={`hover:bg-gray-50/30 transition-colors group ${selectedIds.includes(inv.id) ? 'bg-indigo-50/20 dark:bg-indigo-900/10' : ''}`}>
                                            <td className="px-6 py-5 w-12 text-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedIds.includes(inv.id)}
                                                    onChange={() => toggleSelect(inv.id)}
                                                    className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{inv.invoice_number}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" /> {new Date(inv.created_at).toLocaleDateString('id-ID')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 font-bold text-gray-700 dark:text-gray-300">
                                                {inv.customer.user.name}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-black text-gray-900 dark:text-white">
                                                    Rp {new Intl.NumberFormat('id-ID').format(inv.amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                {inv.status === 'paid' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-tighter">
                                                        <CheckCircle className="w-3 h-3" /> Paid
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase tracking-tighter">
                                                        <Clock className="w-3 h-3" /> Unpaid
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {inv.status === 'unpaid' && (
                                                         <button 
                                                             onClick={() => markAsPaid(inv.id)}
                                                             className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                                                             disabled={sendingWaId !== null || sendingEmailId !== null}
                                                         >
                                                             <CreditCard className="w-3 h-3" /> Pay
                                                         </button>
                                                     )}
                                                    <a href={route('admin.invoices.print', inv.id)} target="_blank" className="p-2.5 text-gray-400 hover:text-indigo-600 transition-all"><Eye className="w-4 h-4" /></a>
                                                    <button 
                                                        onClick={() => sendWhatsapp(inv.id)} 
                                                        className="p-2.5 text-gray-400 hover:text-emerald-600 transition-all disabled:opacity-50"
                                                        title="Kirim Notifikasi WA"
                                                        disabled={sendingWaId !== null || sendingEmailId !== null}
                                                    >
                                                        {sendingWaId === inv.id ? (
                                                            <svg className="animate-spin w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                            </svg>
                                                        ) : (
                                                            <MessageSquare className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button 
                                                        onClick={() => sendEmail(inv.id)} 
                                                        className="p-2.5 text-gray-400 hover:text-indigo-600 transition-all disabled:opacity-50"
                                                        title="Kirim Notifikasi Email"
                                                        disabled={sendingWaId !== null || sendingEmailId !== null}
                                                    >
                                                        {sendingEmailId === inv.id ? (
                                                            <svg className="animate-spin w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                            </svg>
                                                        ) : (
                                                            <Mail className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button 
                                                        onClick={() => confirm('Hapus invoice?') && destroy(route('admin.invoices.destroy', inv.id))} 
                                                        className="p-2.5 text-gray-400 hover:text-red-600 transition-all disabled:opacity-50"
                                                        disabled={sendingWaId !== null || sendingEmailId !== null}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {filteredInvoices.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-20 text-center">
                                                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No Invoices Found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
             {/* Glassmorphic Sticky Bulk Action Panel */}
             {selectedIds.length > 0 && (
                 <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
                     <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur border border-gray-100 dark:border-gray-700 shadow-2xl p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                                 <CheckCircle className="w-5 h-5" stroke="currentColor" />
                             </div>
                             <div>
                                 <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                     Aksi Masal Tagihan
                                 </h4>
                                 <p className="text-[10px] font-bold text-gray-400">
                                     <span className="text-indigo-600 font-extrabold">{selectedIds.length}</span> tagihan terpilih untuk dikirimi notifikasi.
                                 </p>
                             </div>
                         </div>
                         
                         <div className="flex items-center gap-2 w-full md:w-auto">
                             <button
                                 onClick={bulkSendWhatsapp}
                                 disabled={isBulkSendingWa || isBulkSendingEmail}
                                 className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all disabled:opacity-50"
                             >
                                 {isBulkSendingWa ? (
                                     <>
                                         <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                         </svg>
                                         Mengirim...
                                     </>
                                 ) : (
                                     <>
                                         <MessageSquare className="w-4 h-4" /> WA Masal
                                     </>
                                 )}
                             </button>

                             <button
                                 onClick={bulkSendEmail}
                                 disabled={isBulkSendingWa || isBulkSendingEmail}
                                 className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                             >
                                 {isBulkSendingEmail ? (
                                     <>
                                         <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                         </svg>
                                         Mengirim...
                                     </>
                                 ) : (
                                     <>
                                         <Mail className="w-4 h-4" /> Email Masal
                                     </>
                                 )}
                             </button>

                             <button
                                 onClick={() => setSelectedIds([])}
                                 disabled={isBulkSendingWa || isBulkSendingEmail}
                                 className="px-4 py-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all"
                             >
                                 Batal
                             </button>
                         </div>
                     </div>
                 </div>
             )}

            {/* Modal Buat Tagihan Baru */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in"
                        onClick={() => setShowCreateModal(false)}
                    />
                    
                    {/* Modal Card */}
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[2rem] relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
                        <div className="p-8">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-1">
                                Buat <span className="text-indigo-600">Tagihan Baru</span>
                            </h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                                Terbitkan tagihan manual untuk perorangan
                            </p>

                            <form onSubmit={handleCreateInvoice} className="space-y-5">
                                {/* Pelanggan */}
                                <div className="group">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1 group-focus-within:text-indigo-600 transition-colors">Pelanggan Aktif</label>
                                    <select
                                        value={createForm.data.customer_id}
                                        onChange={(e) => createForm.setData('customer_id', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent rounded-xl text-xs font-bold focus:ring-0 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white"
                                    >
                                        <option value="" disabled className="dark:bg-gray-800">-- Pilih Pelanggan --</option>
                                        {activeCustomers.map(cust => (
                                            <option key={cust.id} value={cust.id} className="dark:bg-gray-800">
                                                {cust.name} ({cust.customer_code}) - {cust.package_name} [Rp {Number(cust.price).toLocaleString('id-ID')}]
                                            </option>
                                        ))}
                                    </select>
                                    {createForm.errors.customer_id && (
                                        <span className="text-xs text-red-500 font-bold block mt-1">{createForm.errors.customer_id}</span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Bulan */}
                                    <div className="group">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1 group-focus-within:text-indigo-600 transition-colors">Bulan</label>
                                        <select
                                            value={createForm.data.month}
                                            onChange={(e) => createForm.setData('month', parseInt(e.target.value))}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent rounded-xl text-xs font-bold focus:ring-0 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white"
                                        >
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                                <option key={m} value={m} className="dark:bg-gray-800">
                                                    {new Date(2000, m - 1).toLocaleString('id-ID', { month: 'long' })}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Tahun */}
                                    <div className="group">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1 group-focus-within:text-indigo-600 transition-colors">Tahun</label>
                                        <select
                                            value={createForm.data.year}
                                            onChange={(e) => createForm.setData('year', parseInt(e.target.value))}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/30 border-2 border-transparent rounded-xl text-xs font-bold focus:ring-0 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white"
                                        >
                                            {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map(y => (
                                                <option key={y} value={y} className="dark:bg-gray-800">
                                                    {y}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {flash?.error && (
                                    <span className="text-xs text-red-500 font-bold block mt-1 text-center">{flash.error}</span>
                                )}

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-300 transition-all border-none"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 border-none"
                                    >
                                        {createForm.processing ? 'Memproses...' : 'Terbitkan'}
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
