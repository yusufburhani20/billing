import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { 
    Send, 
    ArrowLeft, 
    Clock, 
    User, 
    ShieldCheck,
    MessageSquare
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
    status: string;
    priority: string;
    created_at: string;
    messages: TicketMessage[];
}

interface Props {
    ticket: Ticket;
}

export default function Show({ ticket }: Props) {
    const { auth } = usePage<any>().props;
    const { data, setData, post, processing, reset } = useForm({
        message: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('customer.tickets.reply', ticket.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <a href={route('customer.tickets.index')} className="p-2 bg-white rounded-xl hover:bg-gray-50 transition-all">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </a>
                    <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                        Ticket <span className="text-indigo-600">#{ticket.ticket_number || ticket.id}</span>
                    </h2>
                </div>
            }
        >
            <Head title={`Ticket #${ticket.ticket_number || ticket.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Ticket Header Card */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 ">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 w-fit ${
                                    ticket.status === 'open' ? 'bg-blue-50 text-blue-600' :
                                    ticket.status === 'resolved' ? 'bg-green-50 text-green-600' :
                                    'bg-amber-50 text-amber-600'
                                }`}>
                                    Status: {ticket.status}
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{ticket.subject}</h1>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-gray-400 flex items-center gap-1 justify-end">
                                    <Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border-l-4 border-indigo-500">
                            {ticket.description}
                        </p>
                    </div>

                    {/* Messages Conversation */}
                    <div className="space-y-4">
                        {ticket.messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.user_id === auth.user.id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-6 rounded-[2rem] ${
                                    msg.user_id === auth.user.id 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                            {msg.user.role === 'admin' ? <ShieldCheck className="w-3 h-3 inline mr-1" /> : <User className="w-3 h-3 inline mr-1" />}
                                            {msg.user.name}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                                    <div className="mt-2 text-[9px] font-bold opacity-50 text-right">
                                        {new Date(msg.created_at).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reply Form */}
                    {ticket.status !== 'closed' && (
                        <form onSubmit={submit} className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 sticky bottom-8">
                            <div className="flex gap-4">
                                <textarea 
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    placeholder="Ketik balasan Anda di sini..."
                                    className="flex-1 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 text-sm h-14 resize-none"
                                    required
                                />
                                <button 
                                    disabled={processing}
                                    className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
