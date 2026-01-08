import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Save, Plus, Trash2, Key, Bot } from 'lucide-react';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('ai');

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

            <div className="flex space-x-4 border-b border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab('ai')}
                    className={`pb-2 px-1 ${activeTab === 'ai' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-white'}`}
                >
                    AI Providers
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-2 px-1 ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-white'}`}
                >
                    Users
                </button>
            </div>

            {activeTab === 'ai' && <AIProvidersSettings />}
            {activeTab === 'users' && <UsersSettings />}
        </div>
    );
}

function AIProvidersSettings() {
    const [providers, setProviders] = useState([]);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const res = await axios.get('/api/config/ai-providers');
            setProviders(res.data);
        } catch (e) {
            console.error("Failed to fetch providers", e);
        }
    };

    const onSubmit = async (data) => {
        try {
            await axios.post('/api/config/ai-providers', data);
            reset();
            fetchProviders();
        } catch (e) {
            console.error("Failed to save provider", e);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2" /> Add/Update Provider
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Provider Name</label>
                            <select {...register("name")} className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white">
                                <option value="groq">Groq</option>
                                <option value="openai">OpenAI</option>
                                <option value="gemini">Gemini</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Priority</label>
                            <input
                                type="number"
                                {...register("priority", { valueAsNumber: true })}
                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                defaultValue={1}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">API Key</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                            <input
                                type="password"
                                {...register("api_key", { required: true })}
                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 pl-10 text-white"
                                placeholder="sk-..."
                            />
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center">
                        <Save className="w-4 h-4 mr-2" /> Save Provider
                    </button>
                </form>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Bot className="w-5 h-5 mr-2" /> Configured Providers
                </h2>
                <div className="space-y-3">
                    {providers.map(p => (
                        <div key={p.id} className="flex items-center justify-between bg-gray-900 p-4 rounded border border-gray-700">
                            <div>
                                <span className="font-bold text-white capitalize">{p.name}</span>
                                <span className="ml-3 text-sm text-gray-500">Priority: {p.priority}</span>
                                {p.is_active ?
                                    <span className="ml-3 text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Active</span> :
                                    <span className="ml-3 text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded">Inactive</span>
                                }
                            </div>
                            <div className="text-gray-500 text-sm">Valid</div>
                        </div>
                    ))}
                    {providers.length === 0 && <p className="text-gray-500">No providers configured.</p>}
                </div>
            </div>
        </div>
    );
}

function UsersSettings() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/api/config/users').then(res => setUsers(res.data)).catch(console.error);
    }, []);

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Users</h2>
            <table className="w-full text-left text-gray-300">
                <thead>
                    <tr className="border-b border-gray-700">
                        <th className="py-2">Name</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">ID</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border-b border-gray-700/50">
                            <td className="py-3">{user.name}</td>
                            <td className="py-3">{user.email}</td>
                            <td className="py-3 font-mono text-xs text-gray-500">{user.id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
