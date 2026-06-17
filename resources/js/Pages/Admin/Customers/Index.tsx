import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Plus, 
    Users, 
    Trash2, 
    Edit, 
    User as UserIcon,
    MapPin,
    Calendar,
    Wifi,
    CheckCircle,
    AlertTriangle,
    ShieldOff,
    Phone
} from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Package {
    id: number;
    name: string;
}

interface Router {
    id: number;
    name: string;
}

interface Customer {
    id: number;
    user_id: number;
    package_id: number;
    router_id: number;
    pppoe_username: string;
    pppoe_password: string;
    address: string;
    phone: string;
    billing_date: number;
    status: 'active' | 'isolated' | 'inactive';
    user: User;
    package: Package;
    router: Router;
}

interface Props {
    customers: Customer[];
    available_users: User[];
    packages: Package[];
    routers: Router[];
}

export default function Index({ customers, available_users, packages, routers }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        user_id: '',
        package_id: '',
        router_id: '',
        pppoe_username: '',
        pppoe_password: '',
        address: '',
        phone: '',
        billing_date: 5,
        status: 'active',
    });

    const openCreateModal = () => {
        setEditingCustomer(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (customer: Customer) => {
        setEditingCustomer(customer);
        setData({
            user_id: customer.user_id.toString(),
            package_id: customer.package_id ? customer.package_id.toString() : '',
            router_id: customer.router_id ? customer.router_id.toString() : '',
            pppoe_username: customer.pppoe_username,
            pppoe_password: customer.pppoe_password,
            address: customer.address || '',
            phone: customer.phone || '',
            billing_date: customer.billing_date,
            status: customer.status,
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCustomer) {
            put(route('admin.customers.update', editingCustomer.id), {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            post(route('admin.customers.store'), {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                    Data Pelanggan
                </h2>
            }
        >
            <Head title="Customers" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Action Bar */}
                    <div className="flex justify-between items-center mb-6 px-4 md:px-0">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pelanggan: {customers.length}</p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                        >
                            <Plus className="w-4 h-4" /> Tambah Pelanggan
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-700/50">
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Customer / PPPoE</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Package & Router</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Billing Info</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                    {customers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-700/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center font-black">
                                                        {customer.user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{customer.user.name}</div>
                                                        <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                                            <Wifi className="w-3 h-3" /> {customer.pppoe_username}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{customer.package?.name}</div>
                                                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 w-fit px-2 py-0.5 rounded-md">
                                                        Router: {customer.router?.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm">
                                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                                    <Calendar className="w-4 h-4" /> Tgl {customer.billing_date}
                                                </div>
                                                <div className="text-[11px] text-gray-400 mt-1 truncate max-w-[150px]">
                                                    <MapPin className="inline w-3 h-3 mr-1" /> {customer.address}
                                                </div>
                                                {customer.phone && (
                                                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-bold">
                                                        <Phone className="w-3 h-3" /> {customer.phone}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                {customer.status === 'active' && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-tighter">
                                                        <CheckCircle className="w-3 h-3" /> Active
                                                    </span>
                                                )}
                                                {customer.status === 'isolated' && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-black uppercase tracking-tighter">
                                                        <AlertTriangle className="w-3 h-3" /> Isolated
                                                    </span>
                                                )}
                                                {customer.status === 'inactive' && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-black uppercase tracking-tighter">
                                                        <ShieldOff className="w-3 h-3" /> Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openEditModal(customer)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => confirm('Hapus pelanggan?') && destroy(route('admin.customers.destroy', customer.id))} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {customers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No Customers Found</p>
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
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-[2.5rem] overflow-hidden">
                        <div className="p-8 sm:p-10">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8">
                                {editingCustomer ? 'Edit' : 'Provision'} <span className="text-indigo-600">Customer</span>
                            </h3>
                            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Select User</label>
                                        {editingCustomer ? (
                                            <div className="mt-1 p-3 bg-gray-100 rounded-xl font-bold text-gray-600">{editingCustomer.user.name}</div>
                                        ) : (
                                            <select value={data.user_id} onChange={e => setData('user_id', e.target.value)} className="w-full mt-1 bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500">
                                                <option value="">-- Choose User --</option>
                                                {available_users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                                            </select>
                                        )}
                                        {errors.user_id && <div className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.user_id}</div>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Package</label>
                                            <select value={data.package_id} onChange={e => setData('package_id', e.target.value)} className="w-full mt-1 bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500">
                                                <option value="">-- Select --</option>
                                                {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Router</label>
                                            <select value={data.router_id} onChange={e => setData('router_id', e.target.value)} className="w-full mt-1 bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500">
                                                <option value="">-- Select --</option>
                                                {routers.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Bill Day</label>
                                            <input value={data.billing_date} onChange={e => setData('billing_date', parseInt(e.target.value))} type="number" min="1" max="31" className="w-full mt-1 bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Status</label>
                                            <select value={data.status} onChange={e => setData('status', e.target.value as any)} className="w-full mt-1 bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500">
                                                <option value="active">Active</option>
                                                <option value="isolated">Isolated</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Connection Info */}
                                <div className="space-y-4">
                                    <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Wifi className="w-3 h-3" /> Mikrotik Credentials
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PPPoE Username</label>
                                                <input value={data.pppoe_username} onChange={e => setData('pppoe_username', e.target.value)} type="text" className="w-full mt-1 bg-white border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 text-sm font-bold" placeholder="idris-01" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PPPoE Password</label>
                                                <input value={data.pppoe_password} onChange={e => setData('pppoe_password', e.target.value)} type="text" className="w-full mt-1 bg-white border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 text-sm font-bold" placeholder="secret123" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Address & Phone</label>
                                        <textarea value={data.address} onChange={e => setData('address', e.target.value)} className="w-full mt-1 bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 text-sm h-24" placeholder="Alamat lengkap..."></textarea>
                                        <input value={data.phone} onChange={e => setData('phone', e.target.value)} type="text" className="w-full mt-2 bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="No. HP" />
                                    </div>
                                </div>

                                <div className="col-span-full pt-4 flex gap-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-gray-600">Cancel</button>
                                    <button type="submit" disabled={processing} className="flex-[2] py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                        <CheckCircle className="w-5 h-5" /> {editingCustomer ? 'Update & Sync' : 'Provision Customer'}
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
