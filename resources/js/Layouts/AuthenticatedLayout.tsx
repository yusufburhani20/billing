import { useState, PropsWithChildren, ReactNode, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { 
    LayoutDashboard, 
    Router, 
    Package, 
    Users, 
    FileText, 
    MessageSquare, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    Bell,
    ChevronLeft,
    Wifi,
    UserCircle,
    ChevronRight,
    Globe,
    Activity,
    Network
} from 'lucide-react';
import ThemeToggle from '@/Components/ThemeToggle';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, settings } = usePage<any>().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    if (!auth || !auth.user) return null;

    const isAdmin = auth.user.role === 'admin';
    const appName = settings?.app_name || 'Idrisiyyah Net';

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(route('notifications.index'));
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Gagal mengambil notifikasi:', error);
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved === 'true') setIsCollapsed(true);
        
        fetchNotifications();
        // Polling notifikasi setiap 30 detik
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAllRead = async () => {
        try {
            await axios.post(route('notifications.markAllRead'));
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Gagal menandai semua dibaca:', error);
        }
    };

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', newState.toString());
    };

    const menuItems = isAdmin ? [
        { name: 'Beranda', route: 'admin.dashboard', icon: LayoutDashboard },
        { name: 'Manajemen User', route: 'admin.users.index', icon: UserCircle },
        { name: 'Data Router', route: 'admin.routers.index', icon: Router },
        { name: 'IP Pool Mikrotik', route: 'admin.mikrotik-pools.index', icon: Network },
        { name: 'Profil Mikrotik', route: 'admin.mikrotik-profiles.index', icon: Activity },
        { name: 'PPPoE & Isolir', route: 'admin.pppoe.index', icon: Globe },
        { name: 'Paket Internet', route: 'admin.packages.index', icon: Package },
        { name: 'Data Pelanggan', route: 'admin.customers.index', icon: Users },
        { name: 'Data Tagihan', route: 'admin.invoices.index', icon: FileText },
        { name: 'Tiket Bantuan', route: 'admin.tickets.index', icon: MessageSquare },
        { name: 'Pengaturan', route: 'admin.settings.index', icon: Settings },
    ] : [
        { name: 'Beranda Saya', route: 'customer.dashboard', icon: LayoutDashboard },
        { name: 'Pilihan Paket', route: 'customer.packages', icon: Wifi },
        { name: 'Tagihan Saya', route: 'customer.invoices.index', icon: FileText },
        { name: 'Bantuan', route: 'customer.tickets.index', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300" onClick={() => {
            setIsNotifOpen(false);
            setIsUserMenuOpen(false);
        }}>
            {/* Sidebar Desktop */}
            <aside 
                className={`hidden lg:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 h-screen sticky top-0 transition-all duration-300 ease-in-out z-50 ${isCollapsed ? 'w-24' : 'w-72'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`p-8 flex items-center transition-all ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white dark:shrink-0">
                        <Wifi className="w-6 h-6" />
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2">
                            <h1 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter truncate max-w-[150px]">
                                {appName}
                            </h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sistem Billing</p>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto custom-scrollbar">
                    {!isCollapsed && <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-4">Menu Utama</div>}
                    {menuItems.map((item) => {
                        const isActive = route().current(item.route);
                        return (
                            <Link
                                key={item.route}
                                href={route(item.route)}
                                className={`flex items-center group relative ${
                                    isCollapsed ? 'justify-center py-4' : 'justify-between px-4 py-3.5 rounded-2xl'
                                } transition-all ${
                                    isActive 
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 ' 
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                                    {!isCollapsed && <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">{item.name}</span>}
                                </div>
                                
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                        {item.name}
                                    </div>
                                )}

                                {!isCollapsed && isActive && <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-50 dark:border-gray-700">
                    {!isCollapsed && (
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] text-center">Version 1.0.0</p>
                    )}
                </div>
            </aside>

            {/* Mobile Navigation Drawer */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-800 animate-in slide-in-from-left duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="p-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                                    <Wifi className="w-6 h-6" />
                                </div>
                                <h1 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                    {appName}
                                </h1>
                            </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="px-4 space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.route}
                                    href={route(item.route)}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                                        route().current(item.route) 
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-4 px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSidebarOpen(true);
                            }}
                            className="lg:hidden p-2 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-500"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleCollapse();
                            }}
                            className="hidden lg:flex p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all text-gray-400"
                        >
                            {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                        <div className="hidden md:block">
                            {header}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsNotifOpen(!isNotifOpen);
                                    setIsUserMenuOpen(false);
                                }}
                                className="p-2.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-600 relative"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                                )}
                            </button>
                            
                            {/* Dropdown Notifikasi */}
                            <div 
                                onClick={(e) => e.stopPropagation()}
                                className={`absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-4 transition-all z-50 ${isNotifOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}
                            >
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Notifikasi</h4>
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={markAllRead}
                                            className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase cursor-pointer hover:underline"
                                        >
                                            Tandai Dibaca
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                    {notifications.length > 0 ? notifications.map((notif) => (
                                        <div key={notif.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex gap-3 items-start border border-gray-100 dark:border-gray-600">
                                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                                                <Bell className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200 leading-tight">{notif.data.message || 'Pesan sistem baru'}</p>
                                                <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold">{new Date(notif.created_at).toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="py-8 text-center">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tidak ada notifikasi baru</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <ThemeToggle />

                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block"></div>

                        {/* User Menu Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsUserMenuOpen(!isUserMenuOpen);
                                    setIsNotifOpen(false);
                                }}
                                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-600"
                            >
                                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-black">
                                    {auth.user.name.substring(0, 1).toUpperCase()}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-0.5">{auth.user.name}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{auth.user.role || 'User'}</p>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-[270deg]' : 'rotate-90'}`} />
                            </button>

                            {/* Dropdown Menu */}
                            <div className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 p-2 transition-all z-50 ${isUserMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                <Link
                                    href={route('profile.edit')}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-widest transition-all"
                                >
                                    <UserCircle className="w-4 h-4" /> Pengaturan Profil
                                </Link>
                                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2"></div>
                                <Link
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 uppercase tracking-widest transition-all"
                                >
                                    <LogOut className="w-4 h-4" /> Keluar Aplikasi
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8 lg:p-12 overflow-x-hidden">
                    <div className="md:hidden mb-6">
                        {header}
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}
