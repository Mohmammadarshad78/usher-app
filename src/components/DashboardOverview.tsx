import React from 'react';
import { DailyReview, JadwalEntry, Village, LocationCheckin, RoleLevel } from '../types';
import { formatPKR, formatMaunds, formatNumber } from '../utils/formatters';
import { 
  Coins, 
  Wheat, 
  MapPin, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  villages: Village[];
  reviews: DailyReview[];
  jadwal: JadwalEntry[];
  checkins: LocationCheckin[];
  activeRole: RoleLevel;
  onNavigate: (tab: string) => void;
  onOpenNewReview: () => void;
  onOpenNewJadwal: () => void;
}

export const DashboardOverview: React.FC<DashboardProps> = ({
  villages,
  reviews,
  jadwal,
  checkins,
  onNavigate,
  onOpenNewReview,
  onOpenNewJadwal,
}) => {
  // Aggregate Metrics
  const totalCash = reviews.reduce((sum, r) => sum + (r.cashCollected || 0), 0);
  const totalGrain = reviews.reduce((sum, r) => sum + (r.grainCollectedMaunds || 0), 0);
  const totalMeetings = reviews.reduce((sum, r) => sum + (r.farmerMeetings || 0), 0);
  const totalTargetPkr = villages.reduce((sum, v) => sum + (v.estimatedTargetUshr || 0), 0);
  const overallAchievementPercent = totalTargetPkr > 0 
    ? Math.min(100, Math.round((totalCash / totalTargetPkr) * 100)) 
    : 78;

  // Group by Tehsil
  const tehsilMap: Record<string, { cash: number; grain: number; count: number }> = {};
  reviews.forEach((r) => {
    if (!tehsilMap[r.tehsil]) {
      tehsilMap[r.tehsil] = { cash: 0, grain: 0, count: 0 };
    }
    tehsilMap[r.tehsil].cash += r.cashCollected || 0;
    tehsilMap[r.tehsil].grain += r.grainCollectedMaunds || 0;
    tehsilMap[r.tehsil].count += 1;
  });

  const tehsils = Object.entries(tehsilMap);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Ribbon */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-slate-900 rounded-xl p-6 text-white shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-200 mb-1">
              <span>بسم الله الرحمن الرحيم</span>
              <span aria-hidden="true">·</span>
              <span>فصل خریف و ربیع وصولی مہم 2026</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight font-nastaliq text-white">
              عشر و تنظیمی جائزہ و مانیٹرنگ ڈیش بورڈ
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              شعبہ عشر، تحصیل و ڈسٹرکٹ ذمہ داران کا روزانہ کا جائزہ، پیشگی جدول ٹورز، مواضعات کا سروے اور فیلڈ حاضری کا خودکار نظام۔
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenNewReview}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>روزانہ جائزہ درج کریں</span>
            </button>
            <button
              onClick={() => onNavigate('ushr-calc')}
              className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors"
            >
              عشر کیلکولیٹر
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">کل وصولی نقد رقم</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {formatPKR(totalCash)}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {overallAchievementPercent}%
            </span>
            <span aria-hidden="true">·</span>
            <span>کل تخمینہ ہدف کا تناسب</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">کل غلہ و اجناس وصولی</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {formatMaunds(totalGrain)}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
            <span>مکئی، دھان و کپاس</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{reviews.length} اندراجات</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">رجسٹرڈ مواضعات / دیہات</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {formatNumber(villages.length)} گاؤں
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
            <span className="font-mono tabular-nums">
              {formatNumber(villages.reduce((s, v) => s + v.totalAcres, 0))} ایکڑ
            </span>
            <span aria-hidden="true">·</span>
            <span>زیرِ کاشت سروے شدہ</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">کسانوں سے براہِ راست ملاقاتیں</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {formatNumber(totalMeetings)} کسان
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
            <span className="text-emerald-700 font-medium">جی پی ایس مصدقہ وزٹس</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{checkins.length} لائیو حاضری</span>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Reviews & Tehsil Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Daily Field Reviews */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  حالیہ روزانہ جائزے کی رپورٹس (فیلڈ انٹریز)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  تمام فیلڈ افسران و تحصیل ناظمین کا کارکردگی ریکارڈ
                </p>
              </div>
              <button
                onClick={() => onNavigate('daily-review')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <span>مکمل فہرست دیکھیں</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-semibold">تاریخ و ذمہ دار</th>
                    <th className="px-4 py-3 font-semibold">مقام و تحصیل</th>
                    <th className="px-4 py-3 font-semibold">کسان رابطے</th>
                    <th className="px-4 py-3 font-semibold">وصولی عشر (نقد / غلہ)</th>
                    <th className="px-4 py-3 font-semibold">فصل</th>
                    <th className="px-4 py-3 font-semibold">توثیق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reviews.slice(0, 4).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{r.officerName}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{r.date}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-800">{r.villageVisited}</div>
                        <div className="text-slate-400 text-[11px]">تحصیل {r.tehsil}</div>
                      </td>
                      <td className="px-4 py-3 font-mono tabular-nums">
                        <span className="font-semibold text-slate-800">{r.farmerMeetings}</span> کسان
                        {r.ulamaMeetings > 0 && (
                          <span className="text-slate-400 mr-1">({r.ulamaMeetings} علماء)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono tabular-nums">
                        <div className="font-semibold text-emerald-700">{formatPKR(r.cashCollected)}</div>
                        <div className="text-slate-500 text-[11px]">{formatMaunds(r.grainCollectedMaunds)}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{r.cropType}</td>
                      <td className="px-4 py-3">
                        {r.gpsVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>مصدقہ فیلڈ</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">دستی انٹری</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tehsil-wise Recovery Breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  تحصیل وار وصولی موازنہ و کارکردگی
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  حالیہ سیزن کے دوران تحصیلوں کی عشر وصولی کا تناسب
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {tehsils.map(([tehsilName, data]) => {
                const percent = Math.min(100, Math.round((data.cash / (totalCash || 1)) * 100));
                return (
                  <div key={tehsilName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        تحصیل {tehsilName} ({data.count} وزٹس)
                      </span>
                      <div className="flex items-center gap-3 font-mono tabular-nums">
                        <span className="text-slate-600">{formatMaunds(data.grain)}</span>
                        <span className="font-bold text-emerald-800">{formatPKR(data.cash)}</span>
                        <span className="text-slate-400 text-[11px]">({percent}%)</span>
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Jadwal & GPS Live Activity */}
        <div className="space-y-6">
          {/* Upcoming Advance Jadwal / Tours */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  آئندہ پیشگی جدول (ٹور پلان)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">شیڈول شدہ فیلڈ دورہ جات</p>
              </div>
              <button
                onClick={onOpenNewJadwal}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                + نیا جدول
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {jadwal.slice(0, 3).map((j) => (
                <div key={j.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-semibold text-slate-800 text-xs">{j.targetVillage}</div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-sm ${
                      j.status === 'منظور شدہ' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : j.status === 'جاری'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {j.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mb-2">{j.purpose}</div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span className="font-mono">{j.scheduledDate}</span>
                    </div>
                    <div className="text-slate-600 font-medium">{j.officerName}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50/60 border-t border-slate-100 text-center">
              <button
                onClick={() => onNavigate('jadwal')}
                className="text-xs font-semibold text-slate-700 hover:text-emerald-700"
              >
                مکمل پیشگی جدول ملاحظہ فرمائیں &larr;
              </button>
            </div>
          </div>

          {/* Live GPS Check-ins Widget */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">حالیہ لائیو لوکیشن حاضری</h2>
                <p className="text-xs text-slate-500 mt-0.5">فیلڈ میں موقع پر موجودگی کا ریکارڈ</p>
              </div>
              <button
                onClick={() => onNavigate('live-gps')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                لائیو تصدیق
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {checkins.slice(0, 3).map((c) => (
                <div key={c.id} className="p-4 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">{c.officerName}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {c.status}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{c.villageName}، تحصیل {c.tehsil}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{c.timestamp}</span>
                    <span>درستی: &plusmn;{c.accuracy}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
