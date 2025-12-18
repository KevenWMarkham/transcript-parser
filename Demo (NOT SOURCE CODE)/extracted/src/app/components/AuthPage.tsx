import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Mail, Eye, EyeOff, Sparkles, Shield, Video, User, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AuthPageProps {
  onAuthenticate: (email: string, password: string) => Promise<boolean>;
  onRegister: (name: string, email: string, password: string) => Promise<boolean>;
}

type AuthMode = "signin" | "signup";

export function AuthPage({ onAuthenticate, onRegister }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation for sign up
    if (mode === "signup") {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (!name.trim()) {
        setError("Please enter your name");
        return;
      }
    }

    setIsLoading(true);

    try {
      let success = false;
      
      if (mode === "signin") {
        success = await onAuthenticate(email, password);
        if (!success) {
          setError("Invalid credentials. Please try again.");
        }
      } else {
        success = await onRegister(name, email, password);
        if (!success) {
          setError("Registration failed. Email may already be in use.");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo/Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50 mb-6"
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-50"
              />
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-5 rounded-3xl shadow-xl">
                <Video className="w-12 h-12 text-white" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-6 h-6 text-purple-300" />
                </motion.div>
              </div>
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Video Transcript Parser
            </h1>
            <p className="text-slate-600 text-sm">
              Secure access to AI-powered transcription
            </p>
          </div>
        </motion.div>

        {/* Auth Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
        >
          <div className="p-8">
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-8 p-1 bg-slate-100/80 rounded-2xl">
              <button
                type="button"
                onClick={() => mode === "signup" && toggleMode()}
                className={`flex-1 py-2.5 px-4 rounded-xl transition-all duration-300 ${
                  mode === "signin"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <span className="text-sm">Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => mode === "signin" && toggleMode()}
                className={`flex-1 py-2.5 px-4 rounded-xl transition-all duration-300 ${
                  mode === "signup"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <span className="text-sm">Sign Up</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === "signin" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "signin" ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="relative">
                  <div className={`absolute inset-0 ${
                    mode === "signin" 
                      ? "bg-gradient-to-br from-emerald-500 to-green-600" 
                      : "bg-gradient-to-br from-blue-600 to-blue-700"
                  } rounded-xl blur opacity-50`}></div>
                  <div className={`relative ${
                    mode === "signin"
                      ? "bg-gradient-to-br from-emerald-500 to-green-600"
                      : "bg-gradient-to-br from-blue-600 to-blue-700"
                  } p-2.5 rounded-xl shadow-lg`}>
                    {mode === "signin" ? (
                      <Shield className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-slate-800">
                    {mode === "signin" ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {mode === "signin" ? "Sign in to continue" : "Get started today"}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-slate-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={mode === "signup"}
                        className="pl-12 h-12 rounded-xl border-slate-300 bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-300"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 h-12 rounded-xl border-slate-300 bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-12 pr-12 h-12 rounded-xl border-slate-300 bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-300"
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

              {/* Confirm Password Field (Sign Up Only) */}
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    key="confirm-password-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="confirmPassword" className="text-slate-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={mode === "signup"}
                        className="pl-12 pr-12 h-12 rounded-xl border-slate-300 bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="backdrop-blur-sm bg-red-50/80 border border-red-200/50 rounded-xl p-3"
                  >
                    <p className="text-sm text-red-700 text-center">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl relative overflow-hidden group"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>{mode === "signin" ? "Signing in..." : "Creating account..."}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="submit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      {mode === "signin" ? (
                        <>
                          <Lock className="w-5 h-5" />
                          <span>Sign In</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-5 h-5" />
                          <span>Create Account</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </form>

            {/* Demo credentials hint (Sign In Only) */}
            <AnimatePresence mode="wait">
              {mode === "signin" && (
                <motion.div
                  key="demo-credentials"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl border border-blue-200/50"
                >
                  <p className="text-xs text-slate-600 text-center mb-1">
                    <strong className="text-slate-700">Demo Access:</strong>
                  </p>
                  <p className="text-xs text-slate-500 text-center">
                    Email: <code className="bg-white/50 px-2 py-0.5 rounded">demo@example.com</code>
                  </p>
                  <p className="text-xs text-slate-500 text-center">
                    Password: <code className="bg-white/50 px-2 py-0.5 rounded">demo123</code>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50/50 to-blue-50/50 border-t border-slate-200/50">
            <p className="text-xs text-slate-500 text-center">
              Protected by secure authentication • API access controlled
            </p>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 backdrop-blur-xl bg-white/60 rounded-2xl p-4 border border-white/50"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-700 mb-1">
                <strong>Why authentication?</strong>
              </p>
              <p className="text-xs text-slate-600">
                This tool uses Google Gemini API which incurs costs. Authentication ensures only authorized users can access the service.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}