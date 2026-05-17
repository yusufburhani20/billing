import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Wifi, WifiOff, RefreshCw, ShieldAlert, Key, Search, User, Globe } from 'lucide-react';
import { useState } from 'react';

interface Router {
    id: number;
    name: string;
}

interface Package {
    id: number;
    name: string;
    mikrotik_profile: string;
}

interface Customer {
    id: number;
    customer_code: string;
    pppoe_username: string;
    pppoe_password?: string;
    status: 'active' | 'isolated' | 'inactive';
    user: { name: string; email: string };
    package?: Package;
    router?: Router;
}

interface Props {
    customers: Customer[];
}

export default function PppoeIndex({ customers }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const { post, processing } = useForm();

    const filteredCustomers = customers.filter(c => 
        c.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customer_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.pppoe_username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAction = (action: string, customerId: number, confirmMsg?: string) => {
        if (confirmMsg && !confirm(confirmMsg)) return;
        post(route(`admin.pppoe.${action}`, customerId), {
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-xl text-gray-800 leading-tight">Manajemen PPPoE & Isolir</h2>}
        >
            <Head title="Manajemen PPPoE" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="bg-white p-6 rounded-xl border border-gray-100 mb-6 flex items-center justify-between">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Cari ID, Nama, atau Username PPPoE..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden sm:rounded-xl border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-bold tracking-wider">Pelanggan</th>
                                        <th scope="col" className="px-6 py-4 font-bold tracking-wider">Kredensial PPPoE</th>
                                        <th scope="col" className="px-6 py-4 font-bold tracking-wider">Paket & Router</th>
                                        <th scope="col" className="px-6 py-4 font-bold tracking-wider text-center">Status</th>
                                        <th scope="col" className="px-6 py-4 font-bold tracking-wider text-right">Aksi Manual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                                Tidak ada data pelanggan PPPoE yang ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCustomers.map((customer) => (
                                            <tr key={customer.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{customer.user.name}</div>
                                                            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-0.5">{customer.customer_code || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <Globe className="w-3.5 h-3.5 text-gray-400" />
                                                            <span className="font-mono text-xs text-gray-700 font-medium">{customer.pppoe_username}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Key className="w-3.5 h-3.5 text-gray-400" />
                                                            <span className="font-mono text-xs text-gray-500">******</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {customer.package ? (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-medium text-gray-900">{customer.package.name}</span>
                                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                                {customer.router?.name || 'Belum ada Router'}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-amber-500 text-xs font-medium bg-amber-50 px-2 py-1 rounded-md">Belum Pilih Paket</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {customer.status === 'active' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                                                            <Wifi className="w-3.5 h-3.5" /> Aktif
                                                        </span>
                                                    ) : customer.status === 'isolated' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600">
                                                            <ShieldAlert className="w-3.5 h-3.5" /> Terisolir
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                                                            <WifiOff className="w-3.5 h-3.5" /> Inaktif
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleAction('sync', customer.id, 'Peringatan: Ini akan mengupdate password & profil user di Mikrotik sesuai database. Lanjutkan?')}
                                                            disabled={processing || !customer.router}
                                                            title="Sinkronisasi ke Mikrotik"
                                                            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </button>
                                                        
                                                        {customer.status !== 'isolated' ? (
                                                            <button
                                                                onClick={() => handleAction('isolate', customer.id, 'Yakin ingin MENGISOLIR pelanggan ini?')}
                                                                disabled={processing || !customer.router}
                                                                title="Isolir Pelanggan"
                                                                className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50"
                                                            >
                                                                <ShieldAlert className="w-4 h-4" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleAction('reconnect', customer.id, 'Yakin ingin MEMULIHKAN koneksi pelanggan ini?')}
                                                                disabled={processing || !customer.router}
                                                                title="Pulihkan Koneksi"
                                                                className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
                                                            >
                                                                <Wifi className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
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
