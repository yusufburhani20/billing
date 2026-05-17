import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { 
    Send, 
    ArrowLeft, 
    Clock, 
    User, 
    ShieldCheck,
    MessageSquare,
    CheckCircle,
    XCircle,
    RefreshCw
} from 'lucide-react';

interface TicketMessage {
    id: number;
    user_id: number;
    message: string;
    created_at: string;
    user: { name: string; role: string };
}

interface Ticket {
    id: number;
    ticket_number?: string;
    subject: string;
    description: string;
    status: 'open' | 'proses' | 'pending' | 'resolved' | 'closed';
    priority: string;
    created_at: string;
    messages: TicketMessage[];
    customer: { user: { name: string } };
}

interface Props {
    ticket: Ticket;
}

export default function Show({ ticket }: Props) {
    const { auth } = usePage<any>().props;
    const { data, setData, post, processing: replyProcessing, reset } = useForm({
        message: '',
    });

    const { patch, processing: statusProcessing } = useForm();

    const submitReply = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.tickets.reply', ticket.id), {
            onSuccess: () => reset(),
        });
    };

    const updateStatus = (status: string) => {
        patch(route('admin.tickets.status', { ticket: ticket.id, status }));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.tickets.index')} className="p-2 bg-white rounded-xl hover:bg-gray-50 transition-all">
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </Link>
                        <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                            Manage Ticket <span className="text-indigo-600">#{ticket.ticket_number || ticket.id}</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {ticket.status === 'open' && (
                            <button onClick={() => updateStatus('proses')} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-100 transition-all">
                                <RefreshCw className="w-4 h-4" /> Mark Proses
                            </button>
                        )}
                        {ticket.status !== 'resolved' && (
                            <button onClick={() => updateStatus('resolved')} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-100 transition-all">
                                <CheckCircle className="w-4 h-4" /> Mark Resolved
                            </button>
                        )}
                        {ticket.status !== 'closed' && (
                            <button onClick={() => updateStatus('closed')} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all">
                                <XCircle className="w-4 h-4" /> Close Ticket
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Manage Ticket #${ticket.ticket_number || ticket.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Conversation Side */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 ">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Customer Request</span>
                                </div>
                                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">{ticket.subject}</h1>
                                <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border-l-4 border-indigo-500 leading-relaxed">
                                    {ticket.description}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {ticket.messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.user_id === auth.user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-6 rounded-[2rem] ${
                                            msg.user_id === auth.user.id 
                                            ? 'bg-gray-900 text-white rounded-tr-none' 
                                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                        }`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-70 flex items-center gap-1">
                                                    {msg.user.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                    {msg.user.name}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                                            <div className="mt-2 text-[9px] font-bold opacity-40 text-right">
                                                {new Date(msg.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={submitReply} className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 ">
                                <div className="flex gap-4">
                                    <textarea 
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        placeholder="Ketik balasan untuk pelanggan..."
                                        className="flex-1 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 text-sm h-14 resize-none"
                                        required
                                    />
                                    <button 
                                        disabled={replyProcessing}
                                        className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 ">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Ticket Information</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer</div>
                                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-black">
                                                {ticket.customer.user.name.charAt(0)}
                                            </div>
                                            {ticket.customer.user.name}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Priority</div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                            ticket.priority === 'high' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                                        }`}>
                                            {ticket.priority} Priority
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                            ticket.status === 'open' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-500'
                                        }`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="pt-6 border-t border-gray-50 flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                        <Clock className="w-4 h-4" /> Created: {new Date(ticket.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
