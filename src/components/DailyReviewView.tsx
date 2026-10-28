import React, { useState } from 'react';
import { DailyReview } from '../types';
import { formatPKR, formatMaunds, formatNumber } from '../utils/formatters';
import { 
  Plus, 
  Search, 
  ShieldCheck, 
  Calendar, 
  Filter, 
  Trash2,
  FileCheck
} from 'lucide-react';

interface DailyReviewViewProps {
  reviews: DailyReview[];
  onOpenNewReview: () => void;
  onDeleteReview: (id: string) => void;
}

export const DailyReviewView: React.FC<DailyReviewViewProps> = ({
  reviews,
  onOpenNewReview,
  onDeleteReview,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTehsil, setSelectedTehsil] = useState('all');

  const tehsils = Array.from(new Set(reviews.map((r) => r.tehsil)));

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.officerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.villageVisited.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.remarks.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTehsil = selectedTehsil === 'all' || r.tehsil === selectedTehsil;
    return matchesSearch && matchesTehsil;
  });

  const totalCashFiltered = filtered.reduce((s, r) => s + (r.cashCollected || 0), 0);
  const totalGrainFiltered = filtered.reduce((s, r) => s + (r.grainCollectedMaunds || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-nastaliq">
            روزانہ جائزہ و کارکردگی فیلڈ افسران
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            شعبہ عشر کے تحت روزانہ کی بنیاد پر موصول ہونے والی فیلڈ سرگرمیوں، ملاقاتوں اور وصولیوں کا ریکارڈ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewReview}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>نیا روزانہ جائزہ درج کریں</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ذمہ دار، گاؤں، فصل یا نوٹس تلاش کریں..."
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedTehsil}
            onChange={(e) => setSelectedTehsil(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 text-slate-700"
          >
            <option value="all">تمام تحصیلیں</option>
            {tehsils.map((t) => (
              <option key={t} value={t}>
                تحصیل {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Chips / Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4">
          <div className="text-xs text-emerald-800 font-medium mb-1">فلٹر شدہ کل نقد وصولی</div>
          <div className="text-xl font-bold text-emerald-950 font-mono tabular-nums">
            {formatPKR(totalCashFiltered)}
          </div>
        </div>
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4">
          <div className="text-xs text-amber-800 font-medium mb-1">فلٹر شدہ کل غلہ و اجناس</div>
          <div className="text-xl font-bold text-amber-950 font-mono tabular-nums">
            {formatMaunds(totalGrainFiltered)}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-600 font-medium mb-1">کل سرگرم اندراجات</div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {filtered.length} انٹریز
          </div>
        </div>
      </div>

      {/* Main Reviews Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 font-semibold">تاریخ</th>
                <th className="px-4 py-3.5 font-semibold">ذمہ دار آفیسر</th>
                <th className="px-4 py-3.5 font-semibold">مقام (گاؤں و تحصیل)</th>
                <th className="px-4 py-3.5 font-semibold">ملاقاتیں (کسان / علماء)</th>
                <th className="px-4 py-3.5 font-semibold">نقد وصولی</th>
                <th className="px-4 py-3.5 font-semibold">غلہ (من)</th>
                <th className="px-4 py-3.5 font-semibold">فصل</th>
                <th className="px-4 py-3.5 font-semibold">کیفیات و نوٹس</th>
                <th className="px-4 py-3.5 font-semibold text-center">ایکشن</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    کوئی روزانہ جائزہ انٹری دستیاب نہیں۔ نیا جائزہ درج کرنے کے لیے اوپر دیا گیا بٹن دبائیں۔
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-600 tabular-nums whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{r.date}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{r.officerName}</div>
                      {r.gpsVerified && (
                        <div className="text-[10px] text-emerald-700 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>جی پی ایس تصدیق شدہ</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{r.villageVisited}</div>
                      <div className="text-slate-400 text-[11px]">تحصیل {r.tehsil}، ضلع {r.district}</div>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums whitespace-nowrap">
                      <div><span className="font-semibold text-slate-900">{r.farmerMeetings}</span> کسان</div>
                      <div className="text-slate-500 text-[11px]">{r.ulamaMeetings} علمائے کرام</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-800 tabular-nums whitespace-nowrap">
                      {formatPKR(r.cashCollected)}
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-amber-800 tabular-nums whitespace-nowrap">
                      {formatMaunds(r.grainCollectedMaunds)}
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {r.cropType}
                    </td>
                    <td className="px-4 py-3 max-w-xs text-slate-600 text-[11px] leading-relaxed">
                      {r.remarks || 'کوئی اضافی تفصیل نہیں۔'}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onDeleteReview(r.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="حذف کریں"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
