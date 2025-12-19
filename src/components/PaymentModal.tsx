/**
 * Payment Modal Component
 * Handles payment for API usage credits
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, CreditCard, DollarSign, CheckCircle2 } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: (amount: number) => void
  currentBalance: number
}

const CREDIT_PACKAGES = [
  { amount: 10, bonus: 0, popular: false },
  { amount: 25, bonus: 5, popular: true },
  { amount: 50, bonus: 15, popular: false },
  { amount: 100, bonus: 35, popular: false },
]

export function PaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  currentBalance,
}: PaymentModalProps) {
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1])
  const [isProcessing, setIsProcessing] = useState(false)

  const totalCredit = selectedPackage.amount + selectedPackage.bonus

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // TODO: Integrate with actual payment provider (Stripe, PayPal, etc.)
    // For now, we'll just simulate a successful payment
    onPaymentSuccess(totalCredit)
    setIsProcessing(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Add Credit
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Current Balance:{' '}
                <span className="font-semibold text-emerald-600">
                  ${currentBalance.toFixed(2)}
                </span>
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
          {/* Package Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Select Credit Package
            </label>
            <div className="grid grid-cols-2 gap-4">
              {CREDIT_PACKAGES.map(pkg => (
                <button
                  key={pkg.amount}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative p-4 border-2 rounded-lg text-left transition-all ${
                    selectedPackage.amount === pkg.amount
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ${pkg.amount}
                    </span>
                    {pkg.bonus > 0 && (
                      <span className="text-sm text-emerald-600 font-semibold">
                        +${pkg.bonus} bonus
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {pkg.bonus > 0 ? (
                      <>Total: ${pkg.amount + pkg.bonus} credit</>
                    ) : (
                      <>${pkg.amount} credit</>
                    )}
                  </div>
                  {pkg.bonus > 0 && (
                    <div className="mt-1 text-xs text-emerald-600 font-medium">
                      Save {Math.round((pkg.bonus / pkg.amount) * 100)}%
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Calculator */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              What you get:
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Base credit:</span>
                <span className="font-semibold">
                  ${selectedPackage.amount.toFixed(2)}
                </span>
              </div>
              {selectedPackage.bonus > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Bonus credit:</span>
                  <span className="font-semibold">
                    +${selectedPackage.bonus.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-blue-300 font-semibold text-gray-900">
                <span>Total credit:</span>
                <span>${totalCredit.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Estimated Usage */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Estimated Usage:
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>
                  ~{Math.floor(totalCredit / 0.5)} video transcriptions (5-10
                  min videos)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>
                  ~{Math.floor(totalCredit / 0.25)} short clips (1-3 min)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Full speaker diarization included</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              * Estimates based on Gemini 2.5 Flash pricing. Actual usage may
              vary based on video length and content.
            </p>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Credit Card
                  </p>
                  <p className="text-xs text-gray-600">
                    Secure payment via Stripe
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              🔒 All payments are processed securely. We never store your credit
              card information.
            </p>
          </div>

          {/* Terms */}
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-gray-700">
              <strong>Note:</strong> Credits are non-refundable and never
              expire. By purchasing, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-left">
            <div className="text-sm text-gray-600">Total payment</div>
            <div className="text-2xl font-bold text-gray-900">
              ${selectedPackage.amount}.00
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pay Now
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
