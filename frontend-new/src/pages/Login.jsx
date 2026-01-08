import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            navigate('/');
        } catch (error) {
            setError('root', {
                type: 'manual',
                message: 'Invalid email or password'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 mb-4">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold">Smart Email Assistant</h1>
                    <p className="text-gray-400 mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                {...register("email", { required: "Email is required" })}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                placeholder="admin@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {errors.root && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm text-center">
                            {errors.root.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
