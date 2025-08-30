import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaTimes,
  FaCheckCircle,
  FaSpinner,
  FaRegCopy
} from 'react-icons/fa';

// ✅ Real logo (PNG). Adjust path/name if needed.
import bkashLogo from '../assets/bkashlogo.png';

const BK_PINK = '#E2136E';
const BK_PINK_DARK = '#B50F59';

export default function BkashPayment({
  campaignTitle = '',
  onPaymentComplete,
  onClose
}) {
  const [step, setStep] = useState(1);          // 1: amount, 2: PIN, 3: success
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [txnId, setTxnId] = useState('');

  const fee = 5; // demo flat fee
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const amt = toNum(amount);
  const total = amt + fee;
  const bdt = (n) =>
    new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2
    }).format(toNum(n));

  const validPhone = /^01\d{9}$/.test(phone);
  const canContinueFromAmount = validPhone && amt > 0;

  // Step 1 -> Step 2 (simulate OTP step implicitly)
  const goPinScreen = async (e) => {
    e?.preventDefault();
    if (!canContinueFromAmount) return;
    setError('');
    setSendingOtp(true);
    // pretend we sent an OTP; bKash UX goes straight to PIN after amount
    setTimeout(() => {
      setSendingOtp(false);
      setStep(2);
    }, 700);
  };

  // Step 2 -> Step 3 (simulate success)
  const doPay = async (e) => {
    e?.preventDefault();
    if (pin.length < 4) {
      setError('সঠিক পিন দিন'); // enter correct PIN
      return;
    }
    setError('');
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      const tx = `BK${Date.now()}`;
      setTxnId(tx);
      setStep(3);
      onPaymentComplete?.({
        amount: amt.toFixed(2),     // donation amount (without fee)
        fee,
        total: total.toFixed(2),
        phoneNumber: phone,
        campaignTitle,
        transactionId: tx
      });
    }, 1000);
  };

  // Close only when user presses ✕/Close
  const handleClose = () => onClose?.();

  const copyReceipt = () => {
    const lines = [
      'bKash Payment Receipt (Demo)',
      `Transaction ID: ${txnId}`,
      `To: ${campaignTitle || 'Campaign'}`,
      `Mobile: ${phone}`,
      `Amount: ${bdt(amt)}`,
      `Fee: ${bdt(fee)}`,
      `Total: ${bdt(total)}`,
      `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
    ].join('\n');
    navigator.clipboard?.writeText(lines);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative mx-auto mt-10 w-[95%] max-w-md overflow-hidden rounded-2xl shadow-2xl"
        style={{ backgroundColor: '#ffffff' }}
        role="dialog"
        aria-modal="true"
      >
        {/* Top App Bar (bKash style) */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: BK_PINK }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="text-white/90 hover:text-white"
              aria-label="Back"
            >
              <FaArrowLeft />
            </button>
            <div className="flex items-center gap-2">
              <img
                src={bkashLogo}
                alt="bKash"
                className="h-6 w-6 object-contain rounded"
              />
              <span className="text-white font-semibold text-base">
                বিকাশ পেমেন্ট
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/90 hover:text-white"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-5">
          {/* Header strip like app section */}
          <div
            className="rounded-xl px-4 py-3 mb-4"
            style={{ backgroundColor: '#FFF0F6', border: '1px solid #ffd4e7' }}
          >
            <div className="text-xs text-[#555]">প্রাপক</div>
            <div className="text-sm font-semibold text-[#222] truncate">
              {campaignTitle || 'Campaign'}
            </div>
            <div className="text-[11px] text-[#777] mt-1">
              {validPhone ? phone : 'মোবাইল নম্বর দিন'}
            </div>
          </div>

          {/* Step 1: Amount + Phone */}
          {step === 1 && (
            <form onSubmit={goPinScreen} className="space-y-4">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-[#222] mb-1">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))
                  }
                  className="w-full rounded-lg border border-[#e5e5e5] px-4 py-3 text-[#222] placeholder-[#aaa] focus:outline-none focus:ring-2"
                  style={{ borderColor: '#e5e5e5', boxShadow: `0 0 0 0px ${BK_PINK}` }}
                />
              </div>

              {/* Amount card (big) */}
              <div
                className="rounded-2xl px-4 py-6 flex items-center justify-between"
                style={{ backgroundColor: '#FFF0F6', border: '1px solid #ffd4e7' }}
              >
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="৳1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent text-[28px] font-semibold text-[#222] placeholder-[#e65a94] focus:outline-none w-full"
                />
                <button
                  type="submit"
                  disabled={!canContinueFromAmount || sendingOtp}
                  className="ml-3 rounded-full px-4 py-3 text-white font-semibold disabled:opacity-50"
                  style={{ backgroundColor: BK_PINK }}
                >
                  {sendingOtp ? (
                    <span className="inline-flex items-center gap-2 text-sm">
                      <FaSpinner className="animate-spin" /> পাঠানো হচ্ছে…
                    </span>
                  ) : (
                    '›'
                  )}
                </button>
              </div>

              {/* Fee + total preview */}
              <div className="text-[13px] text-[#666]">
                চার্জ: <span className="font-medium">{bdt(fee)}</span> • মোট:{' '}
                <span className="font-semibold text-[#111]">{bdt(total)}</span>
              </div>
            </form>
          )}

          {/* Step 2: PIN */}
          {step === 2 && (
            <form onSubmit={doPay} className="space-y-4">
              <div className="text-sm text-[#555]">
                আপনি <span className="font-semibold text-[#111]">{bdt(amt)}</span> পাঠাতে যাচ্ছেন
              </div>

              <div
                className="rounded-2xl px-4 py-5"
                style={{ backgroundColor: '#FFF0F6', border: '1px solid #ffd4e7' }}
              >
                <label className="block text-sm font-medium text-[#222] mb-2">
                  বিকাশ পিন দিন
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) =>
                    setPin(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  className="w-full rounded-lg border border-[#e5e5e5] px-4 py-3 text-[#222] placeholder-[#bbb] tracking-widest text-lg focus:outline-none focus:ring-2"
                />
                <div className="text-[12px] text-[#999] mt-2">
                  চার্জ: {bdt(fee)} • মোট: <span className="font-semibold">{bdt(total)}</span>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={pin.length < 4 || paying}
                    className="rounded-full px-5 py-3 text-white font-semibold disabled:opacity-50"
                    style={{ backgroundColor: BK_PINK }}
                  >
                    {paying ? (
                      <span className="inline-flex items-center gap-2 text-sm">
                        <FaSpinner className="animate-spin" /> প্রসেস হচ্ছে…
                      </span>
                    ) : (
                      '›'
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="rounded-lg px-3 py-2 text-sm"
                  style={{ backgroundColor: '#FFE3EC', color: '#8a0037' }}
                >
                  {error}
                </div>
              )}

              <div className="text-xs text-[#888] text-right">পিন ভুলে গেছেন?</div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[13px] text-[#666] hover:text-[#333]"
                >
                  ← পিছনে যান
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success Receipt (Pink/White Theme) */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Banner */}
              <div
                className="rounded-xl overflow-hidden border"
                style={{ borderColor: '#ffd4e7' }}
              >
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ backgroundColor: BK_PINK, color: '#fff' }}
                >
                  <div className="flex items-center gap-2">
                    <img src={bkashLogo} alt="bKash" className="h-6 w-6 object-contain rounded" />
                    <div className="font-semibold">Payment Successful</div>
                  </div>
                  <FaCheckCircle className="text-white text-xl" />
                </div>

                {/* Amount focus */}
                <div className="px-4 py-4 bg-white">
                  <div className="text-[13px] text-[#777]">Amount Paid</div>
                  <div
                    className="text-3xl font-extrabold leading-tight"
                    style={{ color: BK_PINK }}
                  >
                    {bdt(total)}
                  </div>
                  <div className="text-xs text-[#999] mt-1">
                    ({bdt(amt)} + {bdt(fee)} fee)
                  </div>

                  {/* dashed divider */}
                  <div className="my-4 border-t border-dashed" style={{ borderColor: '#ffc2db' }} />

                  {/* Key facts grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div className="text-[#777]">Transaction ID</div>
                    <div className="text-right font-mono text-[#222]">{txnId}</div>

                    <div className="text-[#777]">Date & Time</div>
                    <div className="text-right text-[#222]">
                      {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
                    </div>

                    <div className="text-[#777]">Paid To</div>
                    <div className="text-right font-medium text-[#222]">{campaignTitle || 'Campaign'}</div>

                    <div className="text-[#777]">From (Mobile)</div>
                    <div className="text-right text-[#222]">{phone}</div>
                  </div>

                  {/* dotted divider */}
                  <div className="my-4 border-t border-dotted" style={{ borderColor: '#ffc2db' }} />

                  {/* Totals */}
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[#777]">Amount</span>
                      <span className="text-[#222]">{bdt(amt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#777]">Fee</span>
                      <span className="text-[#222]">{bdt(fee)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-semibold text-[#222]">Total Paid</span>
                      <span
                        className="font-extrabold"
                        style={{ color: BK_PINK }}
                      >
                        {bdt(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Receipt footer strip */}
                <div
                  className="px-4 py-2 text-[11px] text-center"
                  style={{ backgroundColor: '#FFF0F6', color: '#A20A4C' }}
                >
                  Demo receipt · Not an official bKash document
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: BK_PINK_DARK }}
                >
                  ঠিক আছে
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyReceipt}
                    className="px-4 py-2 rounded-lg text-[#E2136E] border inline-flex items-center gap-2"
                    style={{ borderColor: BK_PINK }}
                  >
                    <FaRegCopy /> রসিদ কপি
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
