import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, Eye, EyeOff, Video } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { apiClient } from '@transcript-parser/ai-services'

interface LoginProps {
  onSuccess: () => void
  onToggle: () => void
}

export function Login({ onSuccess, onToggle }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await apiClient.login(email, password)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Header with App Icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center space-y-4"
        >
          {/* Icon with gradient and shadow */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[2.5rem] blur-2xl opacity-40" />
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-[2.5rem] shadow-2xl">
                <Video className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Video Transcript Parser
            </h1>
            <p className="text-slate-600 mt-2">
              Secure access to AI-powered transcription
            </p>
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 space-y-6">
            {/* Tab Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === 'signin'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('signup')
                  onToggle()
                }}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Welcome Section */}
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-200">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
                <p className="text-slate-600">Sign in to continue</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white transition-colors text-slate-700 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-12 pr-12 h-14 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white transition-colors text-slate-700"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 shadow-lg shadow-purple-200 hover:shadow-xl transition-all duration-300 rounded-2xl"
              >
                <Lock className="w-5 h-5 mr-2" />
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Access Info */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
              <h3 className="font-semibold text-slate-800 mb-2">Demo Access:</h3>
              <div className="space-y-1 text-sm text-slate-600">
                <p>
                  <span className="font-medium">Email:</span>{' '}
                  <code className="bg-white px-2 py-1 rounded">demo@example.com</code>
                </p>
                <p>
                  <span className="font-medium">Password:</span>{' '}
                  <code className="bg-white px-2 py-1 rounded">demo123</code>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-slate-500 pt-2">
              Protected by secure authentication • API access controlled
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
