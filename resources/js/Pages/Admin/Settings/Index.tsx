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
    CheckCircle2,
    RefreshCw,
    Terminal,
    AlertTriangle
} from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';

interface Props {
    settings: Record<string, string>;
    deployLog?: string;
}

export default function Index({ settings, deployLog = '' }: Props) {
    const [activeTab, setActiveTab] = useState('general');
    const [waStatus, setWaStatus] = useState<'connected' | 'disconnected' | 'qr' | 'connecting'>('connecting');
    const [qrCode, setQrCode] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        app_name: settings.app_name || 'Idrisiyyah Net',
        address: settings.address || '',
        rt_rw: settings.rt_rw || '',
        phone: settings.phone || '',
        favicon: null as File | null,
        enable_email_notifications: settings.enable_email_notifications || 'yes',
        enable_wa_notifications: settings.enable_wa_notifications || 'yes',
    });

    const { post: postUpdate, processing: processingUpdate } = useForm();

    const handleRunUpdate = () => {
        if (!confirm('Apakah Anda yakin ingin menjalankan update sistem sekarang? Proses ini akan memakan waktu 1-2 menit.')) return;
        postUpdate(route('admin.settings.update-system'), {
            preserveScroll: true,
            onSuccess: () => alert('Proses update sistem selesai!'),
        });
    };

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
                    <button 
                        onClick={() => setActiveTab('update')}
                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'update' ? 'bg-indigo-600 text-white dark:' : 'bg-white dark:bg-gray-800 text-gray-400 hover:bg-gray-50'}`}
                    >
                        <RefreshCw className="w-4 h-4" /> Update Sistem
                    </button>
                </div>

                {/* Main Content Form */}
                <div className="flex-1">
                    {activeTab === 'update' ? (
                        <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-700 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                    <RefreshCw className="w-6 h-6 animate-spin" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Update & Sinkronisasi Sistem</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Tarik pembaruan kode terbaru dan terapkan perubahan secara otomatis</p>
                                </div>
                            </div>

                            <div className="bg-indigo-50/50 dark:bg-indigo-950/10 p-6 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/10 space-y-2">
                                <h4 className="text-[10px] font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-widest">Penjelasan Proses:</h4>
                                <ul className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 space-y-1 list-disc list-inside uppercase tracking-wider">
                                    <li>Menarik kode terbaru dari GitHub (`git pull`)</li>
                                    <li>Memasang / memperbarui dependensi PHP (`composer install`)</li>
                                    <li>Menjalankan migrasi database (`php artisan migrate`)</li>
                                    <li>Membangun ulang aset frontend menggunakan Vite (`npm install` & `vite build`)</li>
                                    <li>Membersihkan semua cache sistem agar pembaruan langsung aktif</li>
                                </ul>
                            </div>

                            <div className="p-6 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/10 rounded-2xl flex items-start gap-4">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-widest mb-1">PENTING:</p>
                                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 leading-relaxed uppercase tracking-widest">
                                        Proses update dapat memakan waktu 1 hingga 2 menit karena melakukan instalasi dependensi NPM dan kompilasi Vite di server Anda.
                                        Mohon jangan menutup halaman ini atau merefresh browser saat proses sedang berjalan.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={handleRunUpdate}
                                    disabled={processingUpdate}
                                    className="flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all disabled:opacity-50"
                                >
                                    {processingUpdate ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            Sedang Memproses Update...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-5 h-5" />
                                            Jalankan Auto Deployment
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-gray-400" /> Log Output Deployment Terakhir
                                    </h4>
                                    {deployLog && (
                                        <span className="text-[9px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                            Log Tersedia
                                        </span>
                                    )}
                                </div>

                                <pre className="p-6 bg-gray-900 text-gray-100 rounded-2xl font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-[24rem] custom-scrollbar border border-gray-800 shadow-inner">
                                    {deployLog || "Belum ada log update terbaru. Klik tombol 'Jalankan Auto Deployment' untuk memulai."}
                                </pre>
                            </div>
                        </div>
                    ) : (
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
                                    <div className="md:col-span-2 border-t border-gray-100 dark:border-gray-700 pt-6">
                                        <div className="flex items-center justify-between bg-gray-50/50 dark:bg-gray-700/20 p-6 rounded-2xl border border-gray-100/50 dark:border-gray-700/30">
                                            <div>
                                                <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Notifikasi Email Pelanggan</h4>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1 leading-relaxed">Aktifkan untuk mengirim kuitansi pembayaran dan tagihan baru ke email pelanggan.</p>
                                            </div>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={data.enable_email_notifications === 'yes'}
                                                    onChange={e => setData('enable_email_notifications', e.target.checked ? 'yes' : 'no')}
                                                    className="sr-only peer"
                                                    id="email-notif-switch"
                                                />
                                                <label 
                                                    htmlFor="email-notif-switch"
                                                    className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 cursor-pointer"
                                                ></label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 border-t border-gray-100 dark:border-gray-700 pt-6">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Favicon Aplikasi (.ico, .png, .jpg)</label>
                                        <div className="flex items-center gap-6">
                                            {/* Preview */}
                                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden shrink-0">
                                                {data.favicon ? (
                                                    <img src={URL.createObjectURL(data.favicon)} alt="Preview Favicon" className="w-10 h-10 object-contain" />
                                                ) : settings.favicon ? (
                                                    <img src={`/${settings.favicon}`} alt="Current Favicon" className="w-10 h-10 object-contain" />
                                                ) : (
                                                    <Globe className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                                                )}
                                            </div>
                                            
                                            {/* File Input button */}
                                            <div className="flex-1">
                                                <input 
                                                    type="file" 
                                                    id="favicon-upload" 
                                                    accept=".ico,.png,.jpg,.jpeg"
                                                    onChange={e => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setData('favicon', file);
                                                    }}
                                                    className="hidden"
                                                />
                                                <label 
                                                    htmlFor="favicon-upload"
                                                    className="inline-block px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer transition-all"
                                                >
                                                    Pilih File Favicon
                                                </label>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1.5">Rekomendasi ukuran: 32x32 atau 64x64 piksel.</p>
                                            </div>
                                        </div>
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

                                <div className="flex items-center justify-between bg-emerald-50/20 dark:bg-emerald-950/10 p-6 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/10">
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Kirim Notifikasi WhatsApp</h4>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1 leading-relaxed">Aktifkan untuk mengirim tagihan bulanan, struk pembayaran, dan isolasi otomatis via WhatsApp.</p>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={data.enable_wa_notifications === 'yes'}
                                            onChange={e => setData('enable_wa_notifications', e.target.checked ? 'yes' : 'no')}
                                            className="sr-only peer"
                                            id="wa-notif-switch"
                                        />
                                        <label 
                                            htmlFor="wa-notif-switch"
                                            className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600 cursor-pointer"
                                        ></label>
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
                    )}

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
