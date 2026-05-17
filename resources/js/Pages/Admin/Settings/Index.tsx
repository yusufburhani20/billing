import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Settings as SettingsIcon, 
    MessageSquare, 
    Globe, 
    Home, 
    Save, 
    Info,
    Wifi,
    CheckCircle2
} from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';

interface Props {
    settings: Record<string, string>;
}

export default function Index({ settings }: Props) {
    const [activeTab, setActiveTab] = useState('general');
    const [waStatus, setWaStatus] = useState<'connected' | 'disconnected' | 'qr' | 'connecting'>('connecting');
    const [qrCode, setQrCode] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        app_name: settings.app_name || 'Idrisiyyah Net',
        address: settings.address || '',
        rt_rw: settings.rt_rw || '',
        phone: settings.phone || '',
    });

    useEffect(() => {
        let interval: any;
        if (activeTab === 'whatsapp') {
            const checkStatus = async () => {
                try {
                    const response = await axios.get(route('admin.settings.whatsapp-status'));
                    setWaStatus(response.data.status);
                    setQrCode(response.data.qr);
                } catch (e) {
                    setWaStatus('disconnected');
                }
            };
            checkStatus();
            interval = setInterval(checkStatus, 5000);
        }
        return () => clearInterval(interval);
    }, [activeTab]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            onSuccess: () => alert('Pengaturan berhasil disimpan!'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                        Konfigurasi <span className="text-indigo-600">Sistem</span>
                    </h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Atur identitas bisnis dan integrasi gateway Anda</p>
                </div>
            }
        >
            <Head title="Pengaturan Sistem" />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tab */}
                <div className="w-full lg:w-72 space-y-2">
                    <button 
                        onClick={() => setActiveTab('general')}
                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-indigo-600 text-white dark:' : 'bg-white dark:bg-gray-800 text-gray-400 hover:bg-gray-50'}`}
                    >
                        <Home className="w-4 h-4" /> Informasi Umum
                    </button>
                    <button 
                        onClick={() => setActiveTab('whatsapp')}
                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'whatsapp' ? 'bg-indigo-600 text-white dark:' : 'bg-white dark:bg-gray-800 text-gray-400 hover:bg-gray-50'}`}
                    >
                        <MessageSquare className="w-4 h-4" /> WA Gateway
                    </button>
                </div>

                {/* Main Content Form */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-700 dark:">
                        
                        {activeTab === 'general' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Identitas Aplikasi</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Nama bisnis dan alamat operasional</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Nama RT/RW Net</label>
                                        <input 
                                            type="text" 
                                            value={data.app_name}
                                            onChange={e => setData('app_name', e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                            placeholder="Idrisiyyah Net"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Nomor RT / RW</label>
                                        <input 
                                            type="text" 
                                            value={data.rt_rw}
                                            onChange={e => setData('rt_rw', e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                            placeholder="RT 01 / RW 05"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Alamat Kantor</label>
                                        <textarea 
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            rows={3}
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                            placeholder="Jl. Raya Pagendingan No. 1..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'whatsapp' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">WhatsApp Gateway Lokal</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Scan QR untuk menghubungkan WA Bisnis</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-gray-700/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-600">
                                    {waStatus === 'connected' ? (
                                        <div className="text-center space-y-4">
                                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto ">
                                                <CheckCircle2 className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Terhubung!</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Siap mengirim pesan otomatis</p>
                                            </div>
                                            <button 
                                                type="button"
                                                className="px-6 py-3 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-100 transition-all"
                                                onClick={() => alert('Fitur logout akan segera hadir')}
                                            >
                                                Putuskan Koneksi
                                            </button>
                                        </div>
                                    ) : qrCode ? (
                                        <div className="text-center space-y-6">
                                            <div className="bg-white p-6 rounded-[2.5rem] inline-block border-8 border-indigo-50">
                                                <img src={qrCode} alt="QR Code WhatsApp" className="w-48 h-48" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest animate-pulse">Silakan Scan QR Code</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 px-10 leading-relaxed">Buka WhatsApp {'>'} Perangkat Tertaut {'>'} Tautkan Perangkat</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-4">
                                            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Menghubungkan ke server gateway...</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-[1.5rem] flex items-start gap-4">
                                    <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-widest mb-1">Status Server Gateway:</p>
                                        <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 leading-relaxed uppercase tracking-widest">
                                            Server berjalan di background melalui PM2. Jika QR tidak muncul, pastikan service `whatsapp-gateway` sudah aktif.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-700 flex justify-end">
                            <button 
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 dark:transition-all disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" /> {processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                            </button>
                        </div>
                    </form>

                    {/* Status Card */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 dark:flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 shrink-0">
                                <Wifi className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Sistem</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">ONLINE</span>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
