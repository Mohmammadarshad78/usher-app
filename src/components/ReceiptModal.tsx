import React from 'react';
import { UshrCalculation } from '../types';
import { formatPKR, formatMaunds, formatNumber } from '../utils/formatters';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  receipt: UshrCalculation | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Controls (No print) */}
        <div className="no-print bg-slate-900 px-5 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">سرکاری عشر وصولی رسید پیش منظر</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 rounded flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>پرنٹ رسید (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div className="p-8 space-y-6 text-slate-900 font-sans border-8 border-emerald-900/10 m-4 rounded-lg bg-emerald-50/10">
          {/* Header */}
          <div className="text-center pb-4 border-b-2 border-emerald-800 space-y-1">
            <div className="text-xs text-emerald-800 font-nastaliq">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div className="text-sm font-semibold text-slate-700">
              "وَآتُوا حَقَّهُ يَوْمَ حَصَادِهِ"
            </div>
            <h2 className="text-2xl font-bold font-nastaliq text-emerald-950">
              رسید برائے وصولی شرعی عشر
            </h2>
            <div className="text-xs text-slate-500">
              مرکزی شعبہ عشر و تنظیمی امور · باقاعدہ رجسٹرڈ وصولی رسید
            </div>
            <div className="flex items-center justify-between pt-2 text-xs font-mono">
              <span className="text-emerald-800 font-bold">رسید نمبر: {receipt.receiptNumber}</span>
              <span className="text-slate-500">تاریخ: {receipt.date}</span>
            </div>
          </div>

          {/* Donor & Crop Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 bg-white p-3 rounded border border-slate-200">
              <span className="text-slate-500 text-[11px] block">نام زمیندار / کاشتکار:</span>
              <span className="font-bold text-slate-900 text-sm">{receipt.landownerName}</span>
              <span className="text-slate-500 text-[11px] block mt-1">موضع / گاؤں:</span>
              <span className="font-medium text-slate-800">{receipt.village}</span>
              {receipt.phone && (
                <span className="text-slate-500 text-[11px] block font-mono">رابطہ: {receipt.phone}</span>
              )}
            </div>

            <div className="space-y-1 bg-white p-3 rounded border border-slate-200">
              <span className="text-slate-500 text-[11px] block">فصل:</span>
              <span className="font-bold text-slate-900 text-sm">{receipt.cropName}</span>
              <span className="text-slate-500 text-[11px] block mt-1">طریقہ آبپاشی و شرح:</span>
              <span className="font-medium text-emerald-800">
                {receipt.irrigationMethod === 'barani' ? 'بارانی (10%)' : receipt.irrigationMethod === 'canal_tubewell' ? 'نہری / ٹیوب ویل (5%)' : 'مخلوط (7.5%)'}
              </span>
              <span className="text-slate-500 text-[11px] block font-mono">
                کل پیداوار: {formatMaunds(receipt.totalProductionMaunds)}
              </span>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <table className="w-full text-xs border border-slate-300">
            <thead className="bg-emerald-900 text-white">
              <tr>
                <th className="p-2 text-right">تفصیل</th>
                <th className="p-2 text-right">مقدار / قیمت</th>
                <th className="p-2 text-right">حساب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-mono">
              <tr>
                <td className="p-2 font-sans">مارکیٹ ریٹ فی من</td>
                <td className="p-2">{formatNumber(receipt.ratePerMaund)} روپے</td>
                <td className="p-2 text-slate-500">حکومتی/مارکیٹ نرخ</td>
              </tr>
              <tr>
                <td className="p-2 font-sans font-semibold">واجب الادا عشر (غلہ)</td>
                <td className="p-2 font-bold text-emerald-800">{formatMaunds(receipt.ushrDueMaunds)}</td>
                <td className="p-2 text-slate-500">{receipt.ratePercentage}% شرعی حصہ</td>
              </tr>
              <tr className="bg-emerald-50/50">
                <td className="p-2 font-sans font-bold">مساوی نقد مالیت</td>
                <td className="p-2 font-bold text-emerald-900 text-sm">{formatPKR(receipt.ushrDueCash)}</td>
                <td className="p-2 text-slate-500 font-sans">کل مالیتی تخمینہ</td>
              </tr>
              <tr className="bg-slate-100">
                <td className="p-2 font-sans font-bold text-slate-900">وصول شدہ رقم / مال</td>
                <td className="p-2 font-bold text-slate-900 text-sm">{formatPKR(receipt.paidAmount)}</td>
                <td className="p-2 font-sans text-emerald-800 font-semibold">
                  {receipt.paymentMethod === 'cash' ? 'نقد وصول شدہ' : receipt.paymentMethod === 'grain' ? 'غلہ منتقلی' : 'بینک ٹرانسفر'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer & Signatures */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-center">
            <div>
              <div className="h-10"></div>
              <div className="border-t border-slate-400 pt-1 text-slate-600">
                دستخط برائے زمیندار / ادا کنندہ
              </div>
            </div>
            <div>
              <div className="h-10 flex items-center justify-center text-emerald-800 text-[11px] font-medium gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>شعبہ عشر وصولی تصدیق</span>
              </div>
              <div className="border-t border-slate-400 pt-1 text-slate-900 font-semibold">
                {receipt.officerName} (وصول کنندہ)
              </div>
            </div>
          </div>

          <div className="text-[10px] text-center text-slate-400 pt-2 border-t border-slate-100">
            جزاکم اللہ خیراً۔ اللہ تعالیٰ آپ کی کھیتیوں، مال و جان اور اہل و عیال میں برکت عطا فرمائے۔
          </div>
        </div>
      </div>
    </div>
  );
};
