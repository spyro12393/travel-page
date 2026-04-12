'use client'

import { useState, useEffect } from 'react'

interface Rates {
  TWD: number
  USD: number
  updatedAt: string
}

const QUICK_AMOUNTS = [1000, 3000, 5000, 10000]

function fmt(n: number, decimals = 0) {
  return n.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: decimals })
}

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Rates | null>(null)
  const [jpy, setJpy] = useState(10000)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/JPY')
      .then((r) => r.json())
      .then((data) => {
        if (data.result === 'success') {
          setRates({
            TWD: data.rates.TWD,
            USD: data.rates.USD,
            updatedAt: (data.time_last_update_utc as string).slice(5, 16),
          })
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/,/g, ''), 10)
    setJpy(isNaN(val) || val < 0 ? 0 : val)
  }

  return (
    <div className="bg-white border border-journal-200 rounded-2xl p-5 mb-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">💱</span>
        <h2 className="font-bold text-journal-800 text-sm">匯率換算</h2>
        {rates && (
          <span className="ml-auto text-[10px] text-journal-400 whitespace-nowrap">
            更新 {rates.updatedAt}
          </span>
        )}
      </div>

      {/* Quick-select buttons */}
      <div className="flex gap-1.5 mb-3">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => setJpy(amount)}
            className={`flex-1 text-xs py-1.5 rounded-lg transition-colors font-medium ${
              jpy === amount
                ? 'bg-japan-red text-white shadow-sm'
                : 'bg-journal-100 text-journal-700 hover:bg-journal-200'
            }`}
          >
            ¥{fmt(amount)}
          </button>
        ))}
      </div>

      {/* JPY input */}
      <div className="flex items-center gap-2 bg-journal-50 border border-journal-200 rounded-xl px-3 py-2.5 mb-4">
        <span className="text-journal-500 font-semibold text-sm select-none">¥ JPY</span>
        <input
          type="number"
          value={jpy || ''}
          onChange={handleInput}
          placeholder="0"
          min={0}
          className="flex-1 bg-transparent text-right text-journal-900 font-bold text-lg outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      {/* Results */}
      {error ? (
        <p className="text-xs text-journal-500 text-center py-2">匯率取得失敗，請稍後再試</p>
      ) : rates ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-journal-50 border border-journal-100 rounded-xl px-3.5 py-2.5">
            <span className="text-xs text-journal-600 font-medium flex items-center gap-1.5">
              <span>🇹🇼</span> TWD
            </span>
            <span className="font-bold text-journal-900 text-base">
              NT$ {fmt(jpy * rates.TWD, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between bg-journal-50 border border-journal-100 rounded-xl px-3.5 py-2.5">
            <span className="text-xs text-journal-600 font-medium flex items-center gap-1.5">
              <span>🇺🇸</span> USD
            </span>
            <span className="font-bold text-journal-900 text-base">
              $ {fmt(jpy * rates.USD, 2)}
            </span>
          </div>
          <p className="text-[10px] text-journal-400 text-center pt-1">
            1 JPY ≈ {fmt(rates.TWD, 4)} TWD &nbsp;·&nbsp; {fmt(rates.USD, 5)} USD
          </p>
        </div>
      ) : (
        <div className="space-y-2 animate-pulse">
          <div className="h-11 bg-journal-100 rounded-xl" />
          <div className="h-11 bg-journal-100 rounded-xl" />
        </div>
      )}
    </div>
  )
}
