import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Plus, 
    Wifi, 
    Trash2, 
    Edit, 
    CheckCircle, 
    XCircle,
    Activity,
    Settings,
    Server,
    ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Router {
    id: number;
    name: string;
    ip_address: string;
    api_port: number;
    username: string;
    description: string;
}

interface Props {
    routers: Router[];
}

export default function Index({ routers }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRouter, setEditingRouter] = useState<Router | null>(null);
    const [testStatus, setTestStatus] = useState<{[key: number]: 'loading' | 'success' | 'error' | null}>({});

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        ip_address: '',
        api_port: 8728,
        username: '',
        password: '',
        description: '',
    });

    useEffect(() => {
        // Automatically test all routers in the background on load
        routers.forEach(router => {
            testConnection(router.id);
        });
    }, []);

    const openCreateModal = () => {
        setEditingRouter(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (router: Router) => {
        setEditingRouter(router);
        setData({
            name: router.name,
            ip_address: router.ip_address,
            api_port: router.api_port,
            username: router.username,
            password: '', // Password hidden for security
            description: router.description || '',
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRouter) {
            put(route('admin.routers.update', editingRouter.id), {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            post(route('admin.routers.store'), {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const testConnection = async (id: number) => {
        setTestStatus(prev => ({ ...prev, [id]: 'loading' }));
        try {
            const response = await fetch(route('admin.routers.test', id), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                setTestStatus(prev => ({ ...prev, [id]: 'success' }));
            } else {
                setTestStatus(prev => ({ ...prev, [id]: 'error' }));
            }
        } catch (error) {
            setTestStatus(prev => ({ ...prev, [id]: 'error' }));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                        Router <span className="text-indigo-600">Management</span>
                    </h2>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all "
                    >
                        <Plus className="w-4 h-4" /> Add Router
                    </button>
                </div>
            }
        >
            <Head title="Routers" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {routers.map((router) => (
                            <div key={router.id} className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between group hover:border-indigo-200 transition-all">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">
                                            <Server className="w-6 h-6" />
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditModal(router)} className="p-2 text-gray-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => confirm('Delete?') && destroy(route('admin.routers.destroy', router.id))} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">{router.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{router.ip_address}:{router.api_port}</p>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                                            <Activity className="w-4 h-4" />
                                            <span>Status: </span>
                                            {testStatus[router.id] === 'success' && <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Online</span>}
                                            {testStatus[router.id] === 'error' && <span className="text-red-600 font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Offline</span>}
                                            {testStatus[router.id] === 'loading' && <span className="text-gray-400 italic">Testing...</span>}
                                            {!testStatus[router.id] && <span className="text-gray-400">Untested</span>}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => testConnection(router.id)}
                                    className="mt-6 w-full py-3 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                                >
                                    <Wifi className="w-4 h-4" /> Test Connection
                                </button>
                            </div>
                        ))}
                        
                        {routers.length === 0 && (
                            <div className="col-span-full py-20 bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                <Server className="w-12 h-12 text-gray-200 mb-4" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest">No Routers Configured</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Simple Modal Scaffolding - Ideally use a HeadlessUI Modal component */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden">
                        <div className="p-8">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">
                                {editingRouter ? 'Edit' : 'Add'} <span className="text-indigo-600">Router</span>
                            </h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Router Name</label>
                                    <input value={data.name} onChange={e => setData('name', e.target.value)} type="text" className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="Mikrotik Core" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">IP Address</label>
                                        <input value={data.ip_address} onChange={e => setData('ip_address', e.target.value)} type="text" className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="192.168.1.1" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">API Port</label>
                                        <input value={data.api_port} onChange={e => setData('api_port', parseInt(e.target.value))} type="number" className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="8728" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                                        <input value={data.username} onChange={e => setData('username', e.target.value)} type="text" className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="admin" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                                        <input value={data.password} onChange={e => setData('password', e.target.value)} type="password" className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
                                    </div>
                                </div>
                                <div className="pt-6 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                                    <button type="submit" disabled={processing} className="flex-[2] py-3 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                                        Save Configuration
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
