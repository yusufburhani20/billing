import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    MessageSquare, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    ChevronRight,
    Search,
    Filter,
    User
} from 'lucide-react';
import { useState } from 'react';

interface Ticket {
    id: number;
    ticket_number?: string;
    subject: string;
    description: string;
    status: 'open' | 'proses' | 'pending' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    created_at: string;
    updated_at: string;
    customer: { user: { name: string } };
    messages_count: number;
}

interface Props {
    tickets: Ticket[];
}

export default function Index({ tickets }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTickets = tickets.filter(t => 
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customer.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                        Customer <span className="text-indigo-600">Support</span>
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search Tickets / Name..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Admin Support Tickets" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 gap-4">
                        {filteredTickets.length > 0 ? (
                            filteredTickets.map((ticket) => (
                                <Link
                                    key={ticket.id}
                                    href={route('admin.tickets.show', ticket.id)}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 dark:flex flex-col md:flex-row md:items-center justify-between hover:border-indigo-200 dark:hover:border-indigo-500 transition-all group"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl ${
                                            ticket.status === 'open' ? 'bg-blue-50 text-blue-600' :
                                            ticket.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                            'bg-gray-50 text-gray-400'
                                        }`}>
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-lg">{ticket.subject}</div>
                                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded">ID: #{ticket.ticket_number || ticket.id}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                                                    <User className="w-3 h-3" /> {ticket.customer.user.name}
                                                </span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                                    ticket.priority === 'high' ? 'bg-red-50 text-red-500' :
                                                    ticket.priority === 'medium' ? 'bg-amber-50 text-amber-500' :
                                                    'bg-green-50 text-green-500'
                                                }`}>
                                                    {ticket.priority.toUpperCase()} PRIORITY
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 border-l dark:border-gray-700 pl-3">
                                                    <Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0 border-t md:border-none pt-4 md:pt-0 dark:border-gray-700">
                                        <div className="text-center">
                                            {ticket.status === 'open' && <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Baru</span>}
                                            {ticket.status === 'pending' && <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">Diproses</span>}
                                            {ticket.status === 'resolved' && <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">Selesai</span>}
                                            {ticket.status === 'closed' && <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">Ditutup</span>}
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-20 border border-gray-100 dark:border-gray-700 dark:text-center">
                                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-6">
                                    <MessageSquare className="w-12 h-12" />
                                </div>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Tidak Ada Tiket</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 leading-relaxed max-w-xs mx-auto">
                                    Saat ini belum ada laporan atau permintaan bantuan dari pelanggan Anda.
                                </p>
                            </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
