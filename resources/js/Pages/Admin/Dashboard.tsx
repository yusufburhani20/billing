import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    CreditCard, 
    TrendingUp, 
    Ticket, 
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Activity
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

interface Props {
    stats: {
        total_customers: number;
        monthly_revenue: number;
        pending_tickets: number;
        revenue_growth?: number;
    };
    revenue_chart: Array<{
        month: string;
        total: number;
    }>;
    daily_revenue_chart: Array<{
        label: string;
        total: number;
    }>;
}

export default function Dashboard({ stats, revenue_chart, daily_revenue_chart }: Props) {
    const [chartType, setChartType] = useState<'monthly' | 'daily'>('monthly');

    const chartData = chartType === 'monthly'
        ? (revenue_chart || []).map(item => ({ label: item.month, total: Number(item.total) }))
        : (daily_revenue_chart || []).map(item => ({ label: item.label, total: Number(item.total) }));

    const statCards = [
        { 
            title: 'Total Pelanggan', 
            value: stats?.total_customers || 0, 
            icon: Users, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            trend: '+12%',
            trendUp: true
        },
        { 
            title: 'Pendapatan Bulan Ini', 
            value: `Rp ${Number(stats?.monthly_revenue || 0).toLocaleString('id-ID')}`, 
            icon: CreditCard, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            trend: '+5.4%',
            trendUp: true
        },
        { 
            title: 'Tiket Pending', 
            value: stats?.pending_tickets || 0, 
            icon: Ticket, 
            color: 'text-amber-600', 
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            trend: '-2',
            trendUp: false
        },
        { 
            title: 'Pertumbuhan', 
            value: '24.5%', 
            icon: TrendingUp, 
            color: 'text-indigo-600', 
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            trend: 'Stable',
            trendUp: true
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                        Ringkasan <span className="text-indigo-600">Performa</span>
                    </h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Pantau perkembangan bisnis internet Anda hari ini</p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 dark:hover:transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                                    <card.icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${card.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                                    {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {card.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{card.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-700 dark:">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-indigo-600" /> Grafik Pendapatan
                                </h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    {chartType === 'monthly' ? 'Statistik 6 bulan terakhir' : 'Statistik 30 hari terakhir'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-1 rounded-xl">
                                <button 
                                    onClick={() => setChartType('monthly')}
                                    className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                                        chartType === 'monthly'
                                            ? 'bg-white dark:bg-gray-600 text-indigo-600'
                                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                    }`}
                                >
                                    Bulanan
                                </button>
                                <button 
                                    onClick={() => setChartType('daily')}
                                    className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                                        chartType === 'daily'
                                            ? 'bg-white dark:bg-gray-600 text-indigo-600'
                                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                    }`}
                                >
                                    Harian
                                </button>
                            </div>
                        </div>
                        
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="label" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}}
                                        tickFormatter={(value) => `Rp ${Number(value).toLocaleString('id-ID')}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                                        formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Actions & Recent Activity */}
                    <div className="space-y-6">
                        <div className="bg-indigo-600 p-8 rounded-[3rem] text-white dark:relative overflow-hidden group">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Tiket Pelanggan</h3>
                            <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-6 leading-relaxed">Cek tiket bantuan yang masuk dari pelanggan sekarang.</p>
                            <Link 
                                href={route('admin.tickets.index')}
                                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all"
                            >
                                Lihat Tiket <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-700 dark:">
                            <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Akses Cepat</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <Link href={route('admin.customers.index')} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group transition-all">
                                    <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase group-hover:text-indigo-600">Pelanggan Baru</span>
                                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600" />
                                </Link>
                                <Link href={route('admin.invoices.index')} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group transition-all">
                                    <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase group-hover:text-indigo-600">Buat Tagihan</span>
                                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
