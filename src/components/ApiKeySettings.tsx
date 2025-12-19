/**
 * API Key Settings Component
 * Allows users to configure their own Gemini API key or use paid service
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  X,
  Key,
  ExternalLink,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { PaymentModal } from './PaymentModal'
import { GoogleGenAI } from '@google/genai'

export interface ApiKeyConfig {
  mode: 'own' | 'paid'
  ownKey?: string
  paidBalance?: number
}

interface ApiKeySettingsProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: ApiKeyConfig) => void
  currentConfig?: ApiKeyConfig
}

const API_KEY_STORAGE_KEY = 'gemini_api_config'

export function ApiKeySettings({
  isOpen,
  onClose,
  onSave,
  currentConfig,
}: ApiKeySettingsProps) {
  const [mode, setMode] = useState<'own' | 'paid'>(currentConfig?.mode || 'own')
  const [apiKey, setApiKey] = useState(currentConfig?.ownKey || '')
  const [isValidating, setIsValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState<
    'idle' | 'valid' | 'invalid'
  >('idle')
  const [validationMessage, setValidationMessage] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paidBalance, setPaidBalance] = useState(
    currentConfig?.paidBalance || 0
  )

  useEffect(() => {
    if (currentConfig) {
      setMode(currentConfig.mode)
      setApiKey(currentConfig.ownKey || '')
      setPaidBalance(currentConfig.paidBalance || 0)
    }
  }, [currentConfig])

  const validateApiKey = async () => {
    if (!apiKey || apiKey.trim().length === 0) {
      setValidationStatus('invalid')
      setValidationMessage('Please enter an API key')
      return false
    }

    setIsValidating(true)
    setValidationStatus('idle')

    try {
      // Basic validation - check format
      if (!apiKey.startsWith('AIza')) {
        setValidationStatus('invalid')
        setValidationMessage(
          'Invalid API key format. Gemini API keys should start with "AIza"'
        )
        setIsValidating(false)
        return false
      }

      // Test the API key with a real call to Gemini
      try {
        const ai = new GoogleGenAI({ apiKey })
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: 'Say "OK" if you can read this.' }],
            },
          ],
        })

        const text = response.text
        if (text) {
          setValidationStatus('valid')
          setValidationMessage(
            'API key verified! Successfully connected to Gemini.'
          )
          setIsValidating(false)
          return true
        } else {
          setValidationStatus('invalid')
          setValidationMessage('API key test failed: Empty response')
          setIsValidating(false)
          return false
        }
      } catch (apiError) {
        // Check for specific error types
        const errorMessage =
          apiError instanceof Error ? apiError.message : String(apiError)
        if (
          errorMessage.includes('API_KEY_INVALID') ||
          errorMessage.includes('invalid')
        ) {
          setValidationStatus('invalid')
          setValidationMessage(
            'Invalid API key. Please check your key and try again.'
          )
        } else if (
          errorMessage.includes('quota') ||
          errorMessage.includes('RATE_LIMIT')
        ) {
          setValidationStatus('valid')
          setValidationMessage(
            'API key valid, but quota/rate limit reached. You can still save it.'
          )
        } else {
          setValidationStatus('invalid')
          setValidationMessage(
            `Validation error: ${errorMessage || 'Unknown error'}`
          )
        }
        setIsValidating(false)
        return validationStatus === 'valid'
      }
    } catch (error) {
      setValidationStatus('invalid')
      setValidationMessage(
        error instanceof Error ? error.message : 'Validation failed'
      )
      setIsValidating(false)
      return false
    }
  }

  const handleSave = async () => {
    if (mode === 'own') {
      const isValid = await validateApiKey()
      if (!isValid) {
        return
      }
    }

    const config: ApiKeyConfig = {
      mode,
      ownKey: mode === 'own' ? apiKey : undefined,
      paidBalance: mode === 'paid' ? paidBalance : undefined,
    }

    // Save to localStorage
    localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(config))

    onSave(config)
    onClose()
  }

  const handlePaymentSuccess = (amount: number) => {
    const newBalance = paidBalance + amount
    setPaidBalance(newBalance)

    // Update config immediately
    const config: ApiKeyConfig = {
      mode: 'paid',
      paidBalance: newBalance,
    }
    localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(config))
    onSave(config)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                API Key Settings
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Configure your Gemini API access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Access Mode
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Own API Key Option */}
              <button
                onClick={() => setMode('own')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  mode === 'own'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 ${mode === 'own' ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    <Key className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      Use Your Own Key
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Free with Google's generous quota
                    </p>
                    <ul className="text-xs text-gray-500 mt-2 space-y-1">
                      <li>• No additional costs from us</li>
                      <li>• Direct Google API billing</li>
                      <li>• Full control over usage</li>
                    </ul>
                  </div>
                </div>
              </button>

              {/* Paid Service Option */}
              <button
                onClick={() => setMode('paid')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  mode === 'paid'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 ${mode === 'paid' ? 'text-emerald-600' : 'text-gray-400'}`}
                  >
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      Use Our Service
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay-as-you-go pricing
                    </p>
                    <ul className="text-xs text-gray-500 mt-2 space-y-1">
                      <li>• No API key needed</li>
                      <li>• Simple monthly billing</li>
                      <li>• Transparent cost tracking</li>
                    </ul>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Own API Key Configuration */}
          {mode === 'own' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Gemini API Key
                </label>
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={e => {
                    setApiKey(e.target.value)
                    setValidationStatus('idle')
                  }}
                  placeholder="AIza..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {validationStatus === 'valid' && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{validationMessage}</span>
                  </div>
                )}
                {validationStatus === 'invalid' && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationMessage}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  How to get your API key:
                </h4>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">1.</span>
                    <span>
                      Visit{' '}
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                      >
                        Google AI Studio
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">2.</span>
                    <span>Sign in with your Google account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">3.</span>
                    <span>Click "Create API Key" and copy it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">4.</span>
                    <span>Paste it above and click "Validate & Save"</span>
                  </li>
                </ol>
              </div>

              <div className="p-3 bg-blue-100 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Privacy:</strong> Your API key is stored locally on
                  your device and never sent to our servers. All API calls go
                  directly to Google.
                </p>
              </div>
            </div>
          )}

          {/* Paid Service Configuration */}
          {mode === 'paid' && (
            <div className="space-y-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Current Balance
                </h4>
                <div className="text-3xl font-bold text-emerald-600">
                  ${paidBalance.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600 mt-1">Available credit</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Pricing Information
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Gemini 2.5 Flash: $0.075 per 1M input tokens</p>
                  <p>• Gemini 2.5 Flash: $0.30 per 1M output tokens</p>
                  <p>• Real-time cost tracking included</p>
                  <p>• No hidden fees or monthly minimums</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-100 rounded-lg">
                <p className="text-xs text-emerald-800">
                  <strong>Note:</strong> When your balance runs low, you'll be
                  prompted to add more credit. All usage is tracked in the Cost
                  Summary.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full bg-white hover:bg-gray-50"
                onClick={() => setShowPaymentModal(true)}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Add Credit
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isValidating}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isValidating
              ? 'Validating...'
              : mode === 'own'
                ? 'Validate & Save'
                : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        currentBalance={paidBalance}
      />
    </div>
  )
}

// Helper function to load API config from localStorage
export function loadApiConfig(): ApiKeyConfig | null {
  try {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load API config:', error)
  }
  return null
}

// Helper function to get the current API key
export function getCurrentApiKey(): string | null {
  const config = loadApiConfig()
  if (config?.mode === 'own' && config.ownKey) {
    return config.ownKey
  }
  // Fall back to environment variable
  return import.meta.env.VITE_GEMINI_API_KEY || null
}
