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

interface Props {
    invoices: Invoice[];
}

export default function Index({ invoices }: Props) {
    const { post, delete: destroy, processing } = useForm();
    const { flash } = usePage<any>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [sendingWaId, setSendingWaId] = useState<number | null>(null);
    const [sendingEmailId, setSendingEmailId] = useState<number | null>(null);

    const filteredInvoices = invoices.filter(inv => 
        inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                        Billing <span className="text-indigo-600">Invoices</span>
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <a 
                                href={route('admin.reports.excel')} 
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-all"
                            >
                                <Download className="w-4 h-4" /> Excel
                            </a>
                            <a 
                                href={route('admin.reports.pdf')} 
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-red-100 transition-all"
                            >
                                <FileText className="w-4 h-4" /> PDF
                            </a>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search INV / Customer..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 border-none "
                            />
                        </div>
                    </div>
                </div>
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

                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-700/50">
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Invoice</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                    {filteredInvoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-gray-50/30 transition-colors group">
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
                                            <td colSpan={5} className="py-20 text-center">
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
                    </AuthenticatedLayout>
    );
}
