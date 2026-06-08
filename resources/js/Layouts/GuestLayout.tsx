import { PropsWithChildren, useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

const slides = [
    {
        date: "June 8, 2026",
        title: "[SELESAI] Pemeliharaan Router & Optimalisasi Bandwidth",
        content: "Dear Pelanggan Idrisiyyah Net, kami sampaikan bahwa proses pemeliharaan rutin jaringan di area pusat telah selesai dilakukan. Kapasitas bandwidth kini telah dioptimalkan demi kestabilan koneksi internet Anda."
    },
    {
        date: "May 20, 2026",
        title: "[PROMO] Paket Combo Keluarga 50 Mbps",
        content: "Nikmati kecepatan internet tanpa batas untuk seluruh keluarga dengan paket Combo terbaru. Upgrade kecepatan paket Anda sekarang juga dan dapatkan diskon 20% selama 3 bulan pertama!"
    },
    {
        date: "May 10, 2026",
        title: "[INFO] Pembayaran Tagihan Mudah Lewat WhatsApp",
        content: "Kini Anda dapat menerima tagihan dan melakukan pembayaran tagihan bulanan Idrisiyyah Net langsung menggunakan bot WhatsApp kami secara otomatis dan cepat."
    }
];

interface GuestProps {
    maxWidth?: string;
}

export default function Guest({ children, maxWidth = "max-w-md" }: PropsWithChildren<GuestProps>) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000); // ganti slide setiap 6 detik
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-screen w-full flex flex-col md:flex-row bg-[#f8f9fa] dark:bg-gray-950 overflow-hidden selection:bg-green-100 dark:selection:bg-green-900/30">
            
            {/* Left Side: Branding & What's New Panel (Desktop only) */}
            <div className="hidden md:flex md:w-[35%] lg:w-[30%] h-full flex-col justify-between p-10 bg-[#166534] text-white relative shrink-0 select-none">
                {/* Logo & Brand Name */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                        <Wifi className="w-6 h-6 text-[#166534]" />
                    </div>
                    <div className="leading-none">
                        <div className="text-sm font-black text-white uppercase tracking-wider">Idrisiyyah</div>
                        <div className="text-xs font-bold text-green-200 uppercase tracking-wider flex items-center">
                            Net<span className="text-white animate-pulse">_</span>
                        </div>
                    </div>
                </div>

                {/* News & Updates Section ("What's new" Slider) */}
                <div className="my-auto py-10 max-w-xs">
                    <h2 className="text-2xl font-extrabold text-white tracking-tight mb-8">What's new</h2>
                    
                    <div className="relative min-h-[160px] overflow-hidden">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`transition-all duration-700 ease-in-out absolute inset-0 flex flex-col ${
                                    index === currentSlide 
                                        ? 'opacity-100 translate-x-0 pointer-events-auto' 
                                        : 'opacity-0 translate-x-12 pointer-events-none'
                                }`}
                            >
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white bg-white/20 px-2.5 py-1 rounded-md border border-white/10">
                                        {slide.date}
                                    </span>
                                    <h3 className="text-sm font-black text-white mt-4 mb-2.5 leading-snug uppercase tracking-tight">
                                        {slide.title}
                                    </h3>
                                    <p className="text-[11px] font-medium text-green-100/90 leading-relaxed">
                                        {slide.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Carousel Page Indicators */}
                    <div className="flex gap-2 mt-8 items-center">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-1.5 rounded-full transition-all duration-350 ${
                                    index === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer copy */}
                <div>
                    <p className="text-[10px] text-green-200/80 font-bold uppercase tracking-wider">
                        &copy; {new Date().getFullYear()} Idrisiyyah Net.
                    </p>
                </div>
            </div>

            {/* Right Side: Form Content Centered inside Card */}
            <div className="w-full md:w-[65%] lg:w-[70%] h-full flex flex-col justify-between p-6 md:p-12 lg:p-16 bg-[#f8f9fa] dark:bg-gray-950 overflow-y-auto">
                
                {/* Mobile Header (Hidden on Desktop) */}
                <div className="md:hidden flex items-center justify-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm">
                        <Wifi className="w-5 h-5 text-[#166534]" />
                    </div>
                    <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                        Idrisiyyah <span className="text-[#166534]">Net_</span>
                    </span>
                </div>

                {/* Centered White Login Card */}
                <div className="flex-1 flex flex-col items-center justify-center my-auto py-8">
                    <div className={`w-full ${maxWidth} bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 md:p-10 transition-all duration-350`}>
                        {children}
                    </div>
                </div>

                {/* Bottom Language Switcher */}
                <div className="flex justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 select-none">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800 dark:hover:text-white transition-colors">
                        <span>Language:</span>
                        <span className="text-[#166534]">English</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>

            </div>

        </div>
    );
}
