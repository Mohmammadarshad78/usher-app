import React, { useState } from 'react';
import { JadwalEntry } from '../types';
import { formatPKR } from '../utils/formatters';
import { 
  CalendarDays, 
  Plus, 
  Search, 
  MapPin, 
  Users, 
  Target, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Check
} from 'lucide-react';

interface AdvanceJadwalViewProps {
  jadwal: JadwalEntry[];
  onOpenNewJadwal: () => void;
  onUpdateStatus: (id: string, status: JadwalEntry['status']) => void;
}

export const AdvanceJadwalView: React.FC<AdvanceJadwalViewProps> = ({
  jadwal,
  onOpenNewJadwal,
  onUpdateStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = jadwal.filter((j) => {
    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    const matchesSearch =
      j.officerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.targetVillage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.tehsil.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-nastaliq">
            پیشگی جدول و فیلڈ شیڈولر
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            آئندہ ایام کے فیلڈ دورہ جات، عشر بیداری مہم، براہِ راست وصولی اور زمینداری کونسل کی منصوبہ بندی
          </p>
        </div>

        <button
          onClick={onOpenNewJadwal}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>نیا پیشگی جدول شیڈول کریں</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ذمہ دار، ہدف گاؤں، یا مقصد تلاش کریں..."
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white text-slate-800"
          />
        </div>

        {/* Status segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {['all', 'منظور شدہ', 'جاری', 'زیرِ جائزہ', 'مکمل'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? 'تمام شیڈول' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Jadwal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center text-slate-400 rounded-xl border border-slate-200">
            کوئی شیڈول شدہ پیشگی جدول دستیاب نہیں۔ نیا جدول شامل کرنے کے لیے بٹن دبائیں۔
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                    <CalendarDays className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{item.scheduledDate}</span>
                  </div>

                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      item.status === 'منظور شدہ'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'جاری'
                        ? 'bg-amber-100 text-amber-800'
                        : item.status === 'مکمل'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Target & Tehsil */}
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {item.targetVillage}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>تحصیل {item.tehsil}، ضلع {item.district}</span>
                </div>

                {/* Purpose Tag */}
                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-slate-700 mb-0.5">بنیادی ہدف / نوعیت:</div>
                  <div className="text-xs text-emerald-950 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {item.purpose}
                  </div>
                </div>

                {/* Team Members */}
                <div className="mb-4 space-y-1">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>ہمراہی ٹیم:</span>
                  </div>
                  <div className="text-xs text-slate-700">
                    {item.teamMembers.join('، ')}
                  </div>
                </div>

                {/* Expected Target */}
                {item.expectedTargetPkr > 0 && (
                  <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100 text-slate-600">
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-slate-400" />
                      <span>متوقع وصولی ہدف:</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-700 tabular-nums">
                      {formatPKR(item.expectedTargetPkr)}
                    </span>
                  </div>
                )}

                {item.notes && (
                  <div className="mt-2 text-[11px] text-slate-500 bg-slate-50/60 p-2 rounded border border-slate-100">
                    {item.notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">حالت تبدیل کریں:</span>
                <div className="flex items-center gap-1">
                  {item.status !== 'منظور شدہ' && (
                    <button
                      onClick={() => onUpdateStatus(item.id, 'منظور شدہ')}
                      className="px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
                      title="منظور کریں"
                    >
                      منظور
                    </button>
                  )}
                  {item.status !== 'جاری' && (
                    <button
                      onClick={() => onUpdateStatus(item.id, 'جاری')}
                      className="px-2 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded transition-colors"
                      title="جاری حالت میں تبدیل کریں"
                    >
                      جاری
                    </button>
                  )}
                  {item.status !== 'مکمل' && (
                    <button
                      onClick={() => onUpdateStatus(item.id, 'مکمل')}
                      className="px-2 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                      title="مکمل نشان زد کریں"
                    >
                      مکمل
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
