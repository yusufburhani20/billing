import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Plus, 
    Package as PackageIcon, 
    Trash2, 
    Edit, 
    Zap, 
    DollarSign,
    ShieldCheck,
    ToggleLeft,
    ToggleRight,
    Activity,
    Router as RouterIcon
} from 'lucide-react';
import { useState } from 'react';

interface Package {
    id: number;
    name: string;
    price: number;
    registration_fee: number;
    mikrotik_profile_id: number | null;
    mikrotik_profile?: {
        id: number;
        name: string;
        rate_limit?: string;
        pool_range?: string;
    };
    router_id: number | null;
    router?: {
        id: number;
        name: string;
    };
    description: string;
    is_active: boolean;
}

interface Router {
    id: number;
    name: string;
}

interface MikrotikProfile {
    id: number;
    name: string;
    router_id: number;
    rate_limit?: string;
    local_address?: string;
    pool_range?: string;
}

interface Props {
    packages: Package[];
    mikrotikProfiles: MikrotikProfile[];
    routers: Router[];
}

export default function Index({ packages, mikrotikProfiles, routers }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        price: 0,
        registration_fee: 0,
        mikrotik_profile_id: null as number | null,
        description: '',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingPackage(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (pkg: Package) => {
        setEditingPackage(pkg);
        setData({
            name: pkg.name,
            price: pkg.price,
            registration_fee: pkg.registration_fee,
            mikrotik_profile_id: pkg.mikrotik_profile_id || null,
            description: pkg.description || '',
            is_active: pkg.is_active,
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPackage) {
            put(route('admin.packages.update', editingPackage.id), {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            post(route('admin.packages.store'), {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                    Paket Internet
                </h2>
            }
        >
            <Head title="Packages" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Action Bar */}
                    <div className="flex justify-between items-center mb-6 px-4 md:px-0">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Paket: {packages.length}</p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                        >
                            <Plus className="w-4 h-4" /> Tambah Paket
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-700/50">
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Package Name</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Mikrotik Config</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                    {packages.map((pkg) => (
                                        <tr key={pkg.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-700/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center">
                                                        <Zap className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{pkg.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-black text-indigo-600">Rp {new Intl.NumberFormat('id-ID').format(pkg.price)}<span className="text-[10px] text-gray-400 font-bold uppercase ml-1">/bln</span></div>
                                                <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-1">
                                                    <DollarSign className="w-3 h-3" /> Reg: Rp {new Intl.NumberFormat('id-ID').format(pkg.registration_fee)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                        <Activity className="w-3 h-3 text-gray-400" /> {pkg.mikrotik_profile?.name || 'No Profile'} 
                                                        {pkg.mikrotik_profile?.rate_limit && <span className="text-[9px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded ml-1">{pkg.mikrotik_profile.rate_limit}</span>}
                                                    </div>
                                                    {pkg.mikrotik_profile?.pool_range && (
                                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                            Pool: {pkg.mikrotik_profile.pool_range}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                {pkg.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-tighter">
                                                        <ToggleRight className="w-4 h-4" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-xs font-black uppercase tracking-tighter">
                                                        <ToggleLeft className="w-4 h-4" /> Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openEditModal(pkg)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => confirm('Hapus Paket?') && destroy(route('admin.packages.destroy', pkg.id))} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {packages.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <Zap className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No Packages Available</p>
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
                                {editingPackage ? 'Edit' : 'Create'} <span className="text-indigo-600">Package</span>
                            </h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Package Name</label>
                                    <input value={data.name} onChange={e => setData('name', e.target.value)} type="text" className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="Fiber 50Mbps" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Monthly Price</label>
                                        <input value={data.price} onChange={e => setData('price', parseFloat(e.target.value))} type="number" className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="250000" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Reg. Fee</label>
                                        <input value={data.registration_fee} onChange={e => setData('registration_fee', parseFloat(e.target.value))} type="number" className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="150000" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Profil Mikrotik</label>
                                    <select 
                                        value={data.mikrotik_profile_id || ''} 
                                        onChange={e => setData('mikrotik_profile_id', e.target.value ? parseInt(e.target.value) : null)} 
                                        className="w-full mt-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="" disabled>-- Pilih Profil Mikrotik --</option>
                                        {mikrotikProfiles.map(profile => (
                                            <option key={profile.id} value={profile.id}>{profile.name} {profile.rate_limit ? `(${profile.rate_limit})` : ''}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Package is Active</span>
                                    </label>
                                </div>
                                <div className="pt-6 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                                    <button type="submit" disabled={processing} className="flex-[2] py-3 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                                        Save Package
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
