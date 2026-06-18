import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store';
import Button from '../../../shared/components/button/button.component';
import { Input } from '../../../shared/components/input/input.component';
import { InputError } from '../../../shared/components/input-error/input-error.component';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage = (): React.ReactNode => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    clearError(); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData.email, formData.password);
      navigate('/event');
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar - matching the design from your image */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">Events</h1>
              <div className="hidden md:flex space-x-6">
                <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Events
                </button>
                <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  My Events
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Create Event
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm font-medium">eduard</span>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">E</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Login Form */}
      <div className="flex justify-center items-center min-h-screen pt-16 bg-gray-50">
        <div className="w-full max-w-[323px]">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Sign in to your account
              </h2>
              <p className="text-sm text-gray-600">
                Enter your email and password to access your events
              </p>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  label="Email address"
                  required
                  autoComplete="email"
                />
                
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  label="Password"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <InputError message={error} />
              )}

              <div className="space-y-4 pt-2">
                <Button
                  text={isLoading ? 'Signing in...' : 'Sign in'}
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  onClick={() => {}} // Handled by form submit
                />
                
                <Button
                  text="Create new account"
                  type="button"
                  disabled={false}
                  loading={false}
                  onClick={handleSignupRedirect}
                  extraButtonStyles="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
