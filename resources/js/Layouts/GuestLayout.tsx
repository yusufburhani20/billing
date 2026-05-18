import { PropsWithChildren } from 'react';
import { Wifi } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="h-screen w-full flex flex-col md:flex-row bg-white dark:bg-gray-900 overflow-hidden selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
            
            {/* Left Side: Form Area */}
            <div className="w-full md:w-[50%] lg:w-[45%] h-full flex flex-col p-6 md:p-8 lg:p-10 bg-white dark:bg-gray-900 z-50 relative overflow-y-auto">
                <div className="flex-1 flex flex-col justify-start pt-2 md:pt-4 max-w-2xl mx-auto w-full">
                    <div className="flex flex-col items-center justify-center mb-4">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
                            <Wifi className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Idrisiyyah <span className="text-indigo-600">Net</span></h1>
                    </div>

                    {children}
                </div>
            </div>

            {/* Right Side: Branding Banner */}
            <div className="hidden md:flex flex-1 bg-slate-800 relative flex-col justify-between p-12 lg:p-20 overflow-hidden">
                {/* Background Gradient/Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950"></div>
                
                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-white tracking-wide">Idrisiyyah Net</h2>
                </div>

                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
                        Cepat &<br />Terpercaya
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                        Platform penyedia layanan internet terpercaya yang membantu Anda mengelola konektivitas dengan lebih efisien dan stabil tanpa batas.
                    </p>
                </div>

                <div className="relative z-10">
                    <p className="text-slate-400 text-sm font-medium">
                        &copy; {new Date().getFullYear()} Idrisiyyah Net. All rights reserved.
                    </p>
                </div>
            </div>

        </div>
    );
}
