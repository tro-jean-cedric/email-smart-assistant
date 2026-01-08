import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getEmails, syncEmails } from './api';
import { Mail, RefreshCw, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const queryClient = new QueryClient();

function Dashboard() {
    const queryClient = useQueryClient();
    const { data: emails, isLoading, error } = useQuery({ queryKey: ['emails'], queryFn: getEmails });

    const syncMutation = useMutation({
        mutationFn: syncEmails,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emails'] });
        },
    });

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Smart Email Assistant</h1>
                </div>
                <button
                    onClick={() => syncMutation.mutate()}
                    disabled={syncMutation.isPending}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        syncMutation.isPending
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                    )}
                >
                    <RefreshCw className={clsx("w-4 h-4", syncMutation.isPending && "animate-spin")} />
                    {syncMutation.isPending ? 'Syncing...' : 'Sync Emails'}
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3 text-red-700">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>Failed to load emails. Is the backend running?</p>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-800">Inbox</h2>
                        <span className="text-sm text-gray-500">{emails?.length || 0} emails</span>
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Loading emails...</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {emails?.map((email) => (
                                <div key={email.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{email.sender}</h3>
                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                                            {new Date(email.received_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-800 mb-1">{email.subject}</p>
                                    <p className="text-sm text-gray-500 line-clamp-2">{email.body_text?.substring(0, 200)}...</p>
                                </div>
                            ))}
                            {emails?.length === 0 && (
                                <div className="p-8 text-center text-gray-500">No emails found. Click "Sync Emails" to fetch from Outlook.</div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Dashboard />
        </QueryClientProvider>
    );
}
