import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { MousePointer2, Package } from 'lucide-react';

export default function NoCustomerProfile() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Welcome to Our ISP
                </h2>
            }
        >
            <Head title="Welcome" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white dark:bg-gray-800 sm:rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-full mb-6">
                                <Package className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Almost there!
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                                You haven't chosen an internet package yet. Select a package below to start your high-speed internet journey.
                            </p>
                            <Link
                                href="/packages"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105"
                            >
                                <MousePointer2 className="w-5 h-5" />
                                Browse Internet Packages
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
