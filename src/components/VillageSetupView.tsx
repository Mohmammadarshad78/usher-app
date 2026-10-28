import React, { useState } from 'react';
import { Village } from '../types';
import { formatPKR, formatNumber } from '../utils/formatters';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Droplets, 
  User, 
  Trash2,
  Wheat
} from 'lucide-react';

interface VillageSetupViewProps {
  villages: Village[];
  onOpenNewVillage: () => void;
  onDeleteVillage: (id: string) => void;
}

export const VillageSetupView: React.FC<VillageSetupViewProps> = ({
  villages,
  onOpenNewVillage,
  onDeleteVillage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [irrigationFilter, setIrrigationFilter] = useState('all');

  const filtered = villages.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.tehsil.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.focalPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contactNumber.includes(searchTerm);
    const matchesIrrigation = irrigationFilter === 'all' || v.irrigationType === irrigationFilter;
    return matchesSearch && matchesIrrigation;
  });

  const totalAcres = filtered.reduce((s, v) => s + (v.totalAcres || 0), 0);
  const totalLandowners = filtered.reduce((s, v) => s + (v.landownersCount || 0), 0);
  const totalTarget = filtered.reduce((s, v) => s + (v.estimatedTargetUshr || 0), 0);

  const getIrrigationLabel = (type: string) => {
    switch (type) {
      case 'barani':
        return { text: 'بارانی (شرح عشر 10%)', class: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'canal':
        return { text: 'نہری آبپاشی (شرح عشر 5%)', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'tubewell':
        return { text: 'ٹیوب ویل (شرح عشر 5%)', class: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'mixed':
        return { text: 'مخلوط آبپاشی (شرح 7.5%)', class: 'bg-purple-50 text-purple-800 border-purple-200' };
      default:
        return { text: 'عام زراعت', class: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-nastaliq">
            گاؤں، موضع و زرعی رقبہ سیٹ اپ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            مواضعات، رقبہ جات، ذرائع آبپاشی اور کاشتکاروں کی باقاعدہ رجسٹریشن
          </p>
        </div>

        <button
          onClick={onOpenNewVillage}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>نیا گاؤں / موضع رجسٹر کریں</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="گاؤں کا نام، تحصیل، فوکل پرسن یا فون نمبر تلاش کریں..."
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white text-slate-800"
          />
        </div>

        <select
          value={irrigationFilter}
          onChange={(e) => setIrrigationFilter(e.target.value)}
          className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 text-slate-700"
        >
          <option value="all">تمام ذرائع آبپاشی</option>
          <option value="canal">نہری (Canal - 5%)</option>
          <option value="tubewell">ٹیوب ویل (Tubewell - 5%)</option>
          <option value="barani">بارانی (Rain-fed - 10%)</option>
          <option value="mixed">مخلوط (Mixed - 7.5%)</option>
        </select>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 mb-1">کل زیرِ سروے زرعی رقبہ</div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {formatNumber(totalAcres)} ایکڑ
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 mb-1">رجسٹرڈ کاشتکار / زمیندار</div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {formatNumber(totalLandowners)} افراد
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-slate-500 mb-1">مجموعی سالانہ تخمینہ عشر</div>
          <div className="text-xl font-bold text-emerald-800 font-mono tabular-nums">
            {formatPKR(totalTarget)}
          </div>
        </div>
      </div>

      {/* Table of Villages */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 font-semibold">گاؤں / موضع</th>
                <th className="px-4 py-3.5 font-semibold">تحصیل و ضلع</th>
                <th className="px-4 py-3.5 font-semibold">رقبہ (ایکڑ)</th>
                <th className="px-4 py-3.5 font-semibold">آبپاشی و شرعی شرح</th>
                <th className="px-4 py-3.5 font-semibold">کاشتکاران</th>
                <th className="px-4 py-3.5 font-semibold">مقامی رابطہ کار (فوکل پرسن)</th>
                <th className="px-4 py-3.5 font-semibold">تخمینہ ہدف</th>
                <th className="px-4 py-3.5 font-semibold text-center">ایکشن</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    کوئی گاؤں یا موضع تلاش کے مطابق نہیں ملا۔ نیا موضع شامل کرنے کے لیے بٹن دبائیں۔
                  </td>
                </tr>
              ) : (
                filtered.map((v) => {
                  const irr = getIrrigationLabel(v.irrigationType);
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-700" />
                          <span>{v.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        تحصیل {v.tehsil}، ضلع {v.district}
                      </td>
                      <td className="px-4 py-3 font-mono font-medium text-slate-800 tabular-nums whitespace-nowrap">
                        {formatNumber(v.totalAcres)} ایکڑ
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${irr.class}`}>
                          {irr.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700 tabular-nums whitespace-nowrap">
                        {v.landownersCount} زمیندار
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{v.focalPerson}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5" dir="ltr">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{v.contactNumber}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-800 tabular-nums whitespace-nowrap">
                        {formatPKR(v.estimatedTargetUshr)}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => onDeleteVillage(v.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
