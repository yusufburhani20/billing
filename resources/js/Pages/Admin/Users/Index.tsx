import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    UserPlus, 
    Search, 
    MoreVertical, 
    Edit2, 
    Trash2, 
    ShieldCheck, 
    User as UserIcon,
    X,
    Lock,
    Mail
} from 'lucide-react';
import { useState, FormEvent } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'customer';
    created_at: string;
}

interface Props {
    users: User[];
}

export default function Index({ users }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'customer' as 'admin' | 'customer',
    });

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(route('admin.users.update', editingUser.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            destroy(route('admin.users.destroy', id));
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                            Manajemen <span className="text-indigo-600">User</span>
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Kelola Admin dan Pelanggan sistem</p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 dark:transition-all active:scale-95"
                    >
                        <UserPlus className="w-4 h-4" /> Tambah User
                    </button>
                </div>
            }
        >
            <Head title="Manajemen User" />

            <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Cari nama atau email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-none rounded-[1.5rem] text-xs font-bold dark:focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                    />
                </div>

                {/* User List */}
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-700/50">
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">User Details</th>
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Joined Date</th>
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-700/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {user.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{user.name}</div>
                                                    <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-bold text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(user)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(user.id)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center">
                                            <UserIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No Users Found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[3rem] relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                    {editingUser ? 'Edit User' : 'Tambah User Baru'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-gray-400 transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Nama Lengkap</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input 
                                            type="text" 
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                            placeholder="Masukkan nama..."
                                        />
                                    </div>
                                    {errors.name && <p className="text-[9px] text-rose-500 font-bold mt-2 ml-1 uppercase">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Alamat Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input 
                                            type="email" 
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                            placeholder="email@contoh.com"
                                        />
                                    </div>
                                    {errors.email && <p className="text-[9px] text-rose-500 font-bold mt-2 ml-1 uppercase">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Password {editingUser && '(Kosongkan jika tidak diubah)'}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input 
                                            type="password" 
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.password && <p className="text-[9px] text-rose-500 font-bold mt-2 ml-1 uppercase">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Peran / Role</label>
                                    <select 
                                        value={data.role}
                                        onChange={e => setData('role', e.target.value as 'admin' | 'customer')}
                                        className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 dark:text-white appearance-none"
                                    >
                                        <option value="admin">ADMINISTRATOR</option>
                                        <option value="customer">PELANGGAN</option>
                                    </select>
                                    {errors.role && <p className="text-[9px] text-rose-500 font-bold mt-2 ml-1 uppercase">{errors.role}</p>}
                                </div>

                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 dark:transition-all disabled:opacity-50 mt-4"
                                >
                                    {processing ? 'Memproses...' : editingUser ? 'Simpan Perubahan' : 'Daftarkan User'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
