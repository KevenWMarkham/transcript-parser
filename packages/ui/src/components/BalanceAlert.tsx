/**
 * Balance Alert Component
 * Shows warnings when paid service balance is low
 */

import { AlertTriangle, CreditCard, X } from 'lucide-react'
import { Button } from './ui/button'

interface BalanceAlertProps {
  balance: number
  onAddCredit: () => void
  onDismiss: () => void
}

const LOW_BALANCE_THRESHOLD = 5.0
const CRITICAL_BALANCE_THRESHOLD = 1.0

export function BalanceAlert({
  balance,
  onAddCredit,
  onDismiss,
}: BalanceAlertProps) {
  const isCritical = balance < CRITICAL_BALANCE_THRESHOLD
  const isLow =
    balance < LOW_BALANCE_THRESHOLD && balance >= CRITICAL_BALANCE_THRESHOLD

  // Don't show if balance is sufficient
  if (!isCritical && !isLow) {
    return null
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md ${
        isCritical ? 'animate-pulse' : ''
      }`}
    >
      <div
        className={`rounded-lg shadow-lg border-2 p-4 ${
          isCritical
            ? 'bg-red-50 border-red-500'
            : 'bg-yellow-50 border-yellow-500'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 ${
              isCritical ? 'text-red-600' : 'text-yellow-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3
              className={`font-semibold text-sm ${
                isCritical ? 'text-red-900' : 'text-yellow-900'
              }`}
            >
              {isCritical ? 'Critical: Low Balance!' : 'Low Balance Warning'}
            </h3>
            <p
              className={`text-sm mt-1 ${
                isCritical ? 'text-red-800' : 'text-yellow-800'
              }`}
            >
              Your balance is{' '}
              <span className="font-bold">${balance.toFixed(2)}</span>.
              {isCritical
                ? ' Add credit now to continue using the service.'
                : ' Consider adding credit to avoid service interruption.'}
            </p>

            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={onAddCredit}
                className={`text-white ${
                  isCritical
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Add Credit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onDismiss}
                className="border-gray-300"
              >
                Dismiss
              </Button>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
              isCritical ? 'hover:bg-red-600' : 'hover:bg-yellow-600'
            }`}
          >
            <X
              className={`w-4 h-4 ${
                isCritical ? 'text-red-600' : 'text-yellow-600'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper to check if balance alert should be shown
export function shouldShowBalanceAlert(
  balance: number,
  dismissed: boolean
): boolean {
  if (dismissed) return false
  return balance < LOW_BALANCE_THRESHOLD
}
