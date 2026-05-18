import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Plus, 
    Trash2, 
    Edit, 
    Network,
    Server,
    Activity
} from 'lucide-react';
import { useState } from 'react';

interface Router {
    id: number;
    name: string;
}

interface MikrotikPool {
    id: number;
    name: string;
    ranges: string;
    router_id: number;
    router?: Router;
}

interface Props {
    pools: MikrotikPool[];
    routers: Router[];
}

export default function MikrotikPoolsIndex({ pools, routers }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPool, setEditingPool] = useState<MikrotikPool | null>(null);

    const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
        name: '',
        ranges: '',
        router_id: null as number | null,
    });

    const openCreateModal = () => {
        setEditingPool(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (pool: MikrotikPool) => {
        setEditingPool(pool);
        setData({
            name: pool.name,
            ranges: pool.ranges,
            router_id: pool.router_id,
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPool) {
            put(route('admin.mikrotik-pools.update', editingPool.id), {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            post(route('admin.mikrotik-pools.store'), {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                    IP Pool Mikrotik
                </h2>
            }
        >
            <Head title="IP Pool Mikrotik" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Action Bar */}
                    <div className="flex justify-between items-center mb-6 px-4 md:px-0">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total IP Pool: {pools.length}</p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                        >
                            <Plus className="w-4 h-4" /> Tambah IP Pool
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-700/50">
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Nama Pool</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Rentang IP (Ranges)</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Router</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                    {pools.map((pool) => (
                                        <tr key={pool.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-700/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center">
                                                        <Network className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{pool.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-bold text-gray-600 dark:text-gray-300">
                                                    {pool.ranges}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    {pool.router?.name || 'Unassigned'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openEditModal(pool)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => confirm('Hapus IP Pool?') && destroy(route('admin.mikrotik-pools.destroy', pool.id))} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {pools.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center">
                                                <Network className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Tidak Ada Data IP Pool</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-8 overflow-y-auto flex-1">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">
                                {editingPool ? 'Edit' : 'Tambah'} <span className="text-indigo-600">IP Pool</span>
                            </h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nama IP Pool</label>
                                    <input value={data.name} onChange={e => setData('name', e.target.value)} type="text" className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="pool-10M" required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Rentang IP (Ranges)</label>
                                    <input value={data.ranges} onChange={e => setData('ranges', e.target.value)} type="text" className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="10.10.10.2-10.10.10.254" required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Pilih Router</label>
                                    <select 
                                        value={data.router_id || ''} 
                                        onChange={e => setData('router_id', e.target.value ? parseInt(e.target.value) : null)} 
                                        className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="" disabled>-- Pilih Router --</option>
                                        {routers.map(router => (
                                            <option key={router.id} value={router.id}>{router.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pt-6 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-700">Batal</button>
                                    <button type="submit" disabled={processing} className="flex-[2] py-3 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                                        Simpan
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
