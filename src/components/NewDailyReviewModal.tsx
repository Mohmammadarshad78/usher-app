import React, { useState } from 'react';
import { DailyReview, RoleLevel, Village } from '../types';
import { X, CheckCircle, FileText } from 'lucide-react';

interface NewDailyReviewModalProps {
  villages: Village[];
  activeRole: RoleLevel;
  onClose: () => void;
  onSave: (review: DailyReview) => void;
}

export const NewDailyReviewModal: React.FC<NewDailyReviewModalProps> = ({
  villages,
  activeRole,
  onClose,
  onSave,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [officerName, setOfficerName] = useState('محمد ارشد قادری');
  const [selectedVillageId, setSelectedVillageId] = useState(villages[0]?.id || '');
  const [customVillage, setCustomVillage] = useState('');
  const [cropType, setCropType] = useState('مکئی و دھان');
  const [farmerMeetings, setFarmerMeetings] = useState(12);
  const [ulamaMeetings, setUlamaMeetings] = useState(2);
  const [cashCollected, setCashCollected] = useState(50000);
  const [grainCollectedMaunds, setGrainCollectedMaunds] = useState(35);
  const [gpsVerified, setGpsVerified] = useState(true);
  const [remarks, setRemarks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = villages.find((x) => x.id === selectedVillageId);
    const finalVillage = customVillage.trim() || (v ? v.name : 'فیلڈ موضع');
    const finalTehsil = v ? v.tehsil : 'ساہیوال';
    const finalDistrict = v ? v.district : 'ساہیوال';

    const newReview: DailyReview = {
      id: `dr-${Date.now()}`,
      date,
      officerName,
      role: activeRole,
      tehsil: finalTehsil,
      district: finalDistrict,
      villageVisited: finalVillage,
      farmerMeetings: Number(farmerMeetings),
      ulamaMeetings: Number(ulamaMeetings),
      cashCollected: Number(cashCollected),
      grainCollectedMaunds: Number(grainCollectedMaunds),
      cropType,
      targetAchievedPercent: 90,
      gpsVerified,
      remarks: remarks || 'فیلڈ وزٹ مکمل کیا گیا، کسانوں نے تعاون کی یقین دہانی کروائی۔',
    };

    onSave(newReview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h2 className="font-bold text-sm">نیا روزانہ جائزہ درج کریں (فیلڈ رپورٹ)</h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">تاریخ فیلڈ وزٹ</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">ذمہ دار کا نام</label>
              <input
                type="text"
                required
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">گاؤں / موضع کا انتخاب</label>
            <select
              value={selectedVillageId}
              onChange={(e) => setSelectedVillageId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
            >
              {villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (تحصیل {v.tehsil})
                </option>
              ))}
            </select>
            <div className="mt-1">
              <input
                type="text"
                placeholder="یا نیا گاؤں کا نام خود لکھیں (اختیاری)"
                value={customVillage}
                onChange={(e) => setCustomVillage(e.target.value)}
                className="w-full px-3 py-1.5 text-[11px] bg-slate-50 border border-slate-200 rounded outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">کسانوں سے ملاقاتیں</label>
              <input
                type="number"
                min="0"
                value={farmerMeetings}
                onChange={(e) => setFarmerMeetings(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">علمائے کرام سے رابطہ</label>
              <input
                type="number"
                min="0"
                value={ulamaMeetings}
                onChange={(e) => setUlamaMeetings(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">نقد وصولی عشر (روپے)</label>
              <input
                type="number"
                min="0"
                value={cashCollected}
                onChange={(e) => setCashCollected(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 font-mono font-bold text-emerald-800"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">غلہ وصولی (من میں)</label>
              <input
                type="number"
                min="0"
                value={grainCollectedMaunds}
                onChange={(e) => setGrainCollectedMaunds(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 font-mono font-bold text-amber-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">فصل کی قسم</label>
            <input
              type="text"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              placeholder="مثال: گندم، دھان، مکئی، کپاس"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">کیفیات، پیش رفت و ریمارکس</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="زمینداروں سے بات چیت کا خلاصہ، آئندہ کے وعدے..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="gpsCheck"
              checked={gpsVerified}
              onChange={(e) => setGpsVerified(e.target.checked)}
              className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="gpsCheck" className="text-slate-700 text-xs font-medium cursor-pointer">
              موقع پر فیلڈ موجودگی (جی پی ایس مصدقہ وزٹ)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              منسوخ کریں
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>جائزہ محفوظ کریں</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
