import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Settings from './pages/Settings';
import { LayoutDashboard, Settings as SettingsIcon, LogOut, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Layout Component
function Layout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return <Navigate to="/login" />;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Mail, label: 'Emails', path: '/emails' },
        { icon: SettingsIcon, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-white flex items-center">
                        <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">OA</span>
                        Assistant
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">
                            {user.name ? user.name[0] : 'U'}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}

function Dashboard() {
    return <div className="p-8"><h1 className="text-2xl font-bold">Dashboard Placeholder</h1></div>;
}

function EmailList() {
    return <div className="p-8"><h1 className="text-2xl font-bold">Email List Placeholder</h1></div>;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/emails" element={<EmailList />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
