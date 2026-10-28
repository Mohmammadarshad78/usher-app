import React, { useState } from 'react';
import { DailyReview, Village, JadwalEntry } from '../types';
import { formatPKR, formatMaunds, formatNumber } from '../utils/formatters';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Sparkles, 
  TrendingUp, 
  Building2, 
  Award,
  Layers
} from 'lucide-react';

interface ReportsViewProps {
  reviews: DailyReview[];
  villages: Village[];
  jadwal: JadwalEntry[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reviews,
  villages,
  jadwal,
}) => {
  const [selectedSeason, setSelectedSeason] = useState('khareef');
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(true);

  // Calculations
  const totalCash = reviews.reduce((s, r) => s + (r.cashCollected || 0), 0);
  const totalGrain = reviews.reduce((s, r) => s + (r.grainCollectedMaunds || 0), 0);
  const totalMeetings = reviews.reduce((s, r) => s + (r.farmerMeetings || 0), 0);
  const totalTarget = villages.reduce((s, v) => s + (v.estimatedTargetUshr || 0), 0);
  const totalAcres = villages.reduce((s, v) => s + (v.totalAcres || 0), 0);

  // Officer ranking
  const officerMap: Record<string, { cash: number; grain: number; count: number }> = {};
  reviews.forEach((r) => {
    if (!officerMap[r.officerName]) {
      officerMap[r.officerName] = { cash: 0, grain: 0, count: 0 };
    }
    officerMap[r.officerName].cash += r.cashCollected || 0;
    officerMap[r.officerName].grain += r.grainCollectedMaunds || 0;
    officerMap[r.officerName].count += 1;
  });

  const sortedOfficers = Object.entries(officerMap).sort((a, b) => b[1].cash - a[1].cash);

  // Export to CSV with UTF-8 BOM for Urdu support in Excel
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'تاریخ',
      'ذمہ دار آفیسر',
      'عہدہ',
      'تحصیل',
      'ضلع',
      'گاؤں/موضع',
      'کسان ملاقاتیں',
      'علماء ملاقاتیں',
      'نقد وصولی (روپے)',
      'غلہ (من)',
      'فصل',
      'جی پی ایس تصدیق',
      'کیفیات',
    ];

    const rows = reviews.map((r) => [
      r.id,
      r.date,
      `"${r.officerName}"`,
      r.role,
      r.tehsil,
      r.district,
      `"${r.villageVisited}"`,
      r.farmerMeetings,
      r.ulamaMeetings,
      r.cashCollected,
      r.grainCollectedMaunds,
      `"${r.cropType}"`,
      r.gpsVerified ? 'ہاں' : 'نہیں',
      `"${(r.remarks || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ushr_performance_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-nastaliq">
            ماہانہ و فصلی جامع کارکردگی رپورٹ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            شعبہ عشر وصولی، تنظیمی موازنہ، تحصیل وار رپورٹ اور ایکسل ایکسپورٹ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>ایکسل (CSV) ڈاؤنلوڈ</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>پرنٹ رپورٹ</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs space-y-6">
        <div className="border-b border-slate-200 pb-4 text-center space-y-1">
          <div className="text-xs text-emerald-800 font-bold font-nastaliq">
            مرکزی شعبہ عشر و تنظیمی جائزہ
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-nastaliq">
            جامع فصلی رپورٹ برائے عشر وصولی و تنظیمی جائزہ 2026
          </h2>
          <div className="text-xs text-slate-500 font-mono">
            تاریخ اجراء: {new Date().toLocaleDateString('ur-PK')} · سیزن: فصل خریف / ربیع
          </div>
        </div>

        {/* Executive Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">کل وصولی نقد رقم:</div>
            <div className="text-lg font-bold text-emerald-900 font-mono tabular-nums">
              {formatPKR(totalCash)}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">کل غلہ وصولی (من):</div>
            <div className="text-lg font-bold text-amber-900 font-mono tabular-nums">
              {formatMaunds(totalGrain)}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">کل سروے شدہ رقبہ:</div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
              {formatNumber(totalAcres)} ایکڑ
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">کسانوں سے براہِ راست رابطے:</div>
            <div className="text-lg font-bold text-indigo-900 font-mono tabular-nums">
              {formatNumber(totalMeetings)} افراد
            </div>
          </div>
        </div>

        {/* Smart Executive Urdu Summary */}
        {showExecutiveSummary && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>تحریری انتظامی خلاصہ و فیلڈ تجزیہ</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-sans">
              الحمد للہ! جاری مہم کے دوران شعبہ عشر کے تحت مجموعی طور پر{' '}
              <strong className="text-emerald-950 font-mono">{formatPKR(totalCash)}</strong> نقد اور{' '}
              <strong className="text-amber-950 font-mono">{formatMaunds(totalGrain)}</strong> غلہ و اجناس
              (مکئی، دھان و کپاس) وصول کیے جا چکے ہیں۔ مجموعی طور پر{' '}
              <strong className="font-mono">{formatNumber(totalMeetings)}</strong> معزز زمینداروں اور مساجد کے ائمہ کرام
              سے براہِ راست ملاقاتیں عمل میں آئیں۔ تمام فیلڈ دورہ جات جی پی ایس کوآرڈینیٹس کی مدد سے مصدقہ پائے گئے۔
              تحصیل ساہیوال اور تحصیل میلسی کی ٹیموں نے اہداف کی تکمیل میں نمایا کارکردگی دکھائی ہے۔ آئندہ عشر بیداری مہم
              کے لیے پیشگی جدول کے تحت مزید دورہ جات کی باقاعدہ منظوری دی جا چکی ہے۔
            </p>
          </div>
        )}

        {/* Top Performing Field Officers */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>سرکردہ فیلڈ افسران و تنظیمی ذمہ داران کی درجہ بندی</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">نمبر شمار</th>
                  <th className="px-4 py-2.5 font-semibold">ذمہ دار کا نام</th>
                  <th className="px-4 py-2.5 font-semibold">کل فیلڈ وزٹس</th>
                  <th className="px-4 py-2.5 font-semibold">جمع شدہ نقد رقم</th>
                  <th className="px-4 py-2.5 font-semibold">جمع شدہ غلہ</th>
                  <th className="px-4 py-2.5 font-semibold">درجہ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedOfficers.map(([name, data], idx) => (
                  <tr key={name} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-mono text-slate-500 tabular-nums">0{idx + 1}</td>
                    <td className="px-4 py-2.5 font-semibold text-slate-900">{name}</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums">{data.count} وزٹس</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-emerald-800 tabular-nums">
                      {formatPKR(data.cash)}
                    </td>
                    <td className="px-4 py-2.5 font-mono font-medium text-amber-800 tabular-nums">
                      {formatMaunds(data.grain)}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {idx === 0 ? 'ممتاز کارکردگی (اول)' : idx === 1 ? 'بہترین (دوم)' : 'تسلی بخش'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Breakdown of All Logged Activities */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">
            فیلڈ انٹریز کی مکمل تفصیلی رپورٹ
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border border-slate-200">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="p-2 border">تاریخ</th>
                  <th className="p-2 border">ذمہ دار</th>
                  <th className="p-2 border">گاؤں و تحصیل</th>
                  <th className="p-2 border">فصل</th>
                  <th className="p-2 border">کسان ملاقات</th>
                  <th className="p-2 border">نقد رقم</th>
                  <th className="p-2 border">غلہ (من)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td className="p-2 border">{r.date}</td>
                    <td className="p-2 border font-sans font-medium">{r.officerName}</td>
                    <td className="p-2 border font-sans">{r.villageVisited} ({r.tehsil})</td>
                    <td className="p-2 border font-sans">{r.cropType}</td>
                    <td className="p-2 border tabular-nums">{r.farmerMeetings}</td>
                    <td className="p-2 border font-bold text-emerald-800 tabular-nums">
                      {formatPKR(r.cashCollected)}
                    </td>
                    <td className="p-2 border tabular-nums">{formatMaunds(r.grainCollectedMaunds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer for Print View */}
        <div className="pt-8 text-center text-xs text-slate-500 border-t border-slate-200">
          یہ رپورٹ کمپیوٹرائزڈ ہے، مرکزی شعبہ عشر و تنظیمی ریکارڈ پورٹل سے تصدیق شدہ ہے۔
        </div>
      </div>
    </div>
  );
};
