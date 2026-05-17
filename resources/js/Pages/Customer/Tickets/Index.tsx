import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    MessageSquare, 
    Plus, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    ChevronRight,
    Search
} from 'lucide-react';
import { useState } from 'react';

interface Ticket {
    id: number;
    ticket_number?: string;
    subject: string;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'proses' | 'pending' | 'resolved' | 'closed';
    created_at: string;
}

interface Props {
    tickets: Ticket[];
}

export default function Index({ tickets }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        priority: 'medium',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('customer.tickets.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                        Support <span className="text-indigo-600">Tickets</span>
                    </h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all "
                    >
                        <Plus className="w-4 h-4" /> New Ticket
                    </button>
                </div>
            }
        >
            <Head title="Support Tickets" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4">
                        {tickets.map((ticket) => (
                            <Link
                                key={ticket.id}
                                href={route('customer.tickets.show', ticket.id)}
                                className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:border-indigo-200 transition-all group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-lg">{ticket.subject}</div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID: #{ticket.ticket_number || ticket.id}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                                ticket.priority === 'high' ? 'bg-red-50 text-red-500' :
                                                ticket.priority === 'medium' ? 'bg-amber-50 text-amber-500' :
                                                'bg-green-50 text-green-500'
                                            }`}>
                                                {ticket.priority} Priority
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        {ticket.status === 'open' && <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Open</span>}
                                        {ticket.status === 'pending' && <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">Pending</span>}
                                        {ticket.status === 'resolved' && <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">Resolved</span>}
                                        {ticket.status === 'closed' && <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">Closed</span>}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}

                        {tickets.length === 0 && (
                            <div className="py-20 bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                <MessageSquare className="w-12 h-12 text-gray-200 mb-4" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest">No Support Tickets Yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Ticket Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden">
                        <div className="p-8">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">
                                Create Support <span className="text-indigo-600">Ticket</span>
                            </h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                                    <input value={data.subject} onChange={e => setData('subject', e.target.value)} type="text" className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="Koneksi Lemot / Internet Mati" />
                                    {errors.subject && <div className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.subject}</div>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Priority</label>
                                    <select value={data.priority} onChange={e => setData('priority', e.target.value as any)} className="w-full mt-1 bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500">
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Message Detail</label>
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="w-full mt-1 bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 h-32" placeholder="Jelaskan masalah Anda secara detail..."></textarea>
                                    {errors.description && <div className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.description}</div>}
                                </div>
                                <div className="pt-6 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                                    <button type="submit" disabled={processing} className="flex-[2] py-3 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                                        Submit Ticket
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
