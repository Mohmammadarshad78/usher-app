import React, { useState } from 'react';
import { Village } from '../types';
import { X, Building2, Check } from 'lucide-react';

interface NewVillageModalProps {
  onClose: () => void;
  onSave: (village: Village) => void;
}

export const NewVillageModal: React.FC<NewVillageModalProps> = ({
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [tehsil, setTehsil] = useState('ساہیوال');
  const [district, setDistrict] = useState('ساہیوال');
  const [division, setDivision] = useState('ساہیوال');
  const [totalAcres, setTotalAcres] = useState(1000);
  const [irrigationType, setIrrigationType] = useState<Village['irrigationType']>('canal');
  const [landownersCount, setLandownersCount] = useState(60);
  const [focalPerson, setFocalPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [estimatedTargetUshr, setEstimatedTargetUshr] = useState(400000);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('براہِ کرم گاؤں یا موضع کا نام درج فرمائیں۔');
      return;
    }

    const newVillage: Village = {
      id: `v-${Date.now()}`,
      name,
      tehsil,
      district,
      division,
      totalAcres: Number(totalAcres),
      irrigationType,
      landownersCount: Number(landownersCount),
      focalPerson: focalPerson || 'مقامی نمائندہ',
      contactNumber: contactNumber || '0300-0000000',
      estimatedTargetUshr: Number(estimatedTargetUshr),
      notes,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSave(newVillage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <h2 className="font-bold text-sm">نیا گاؤں / موضع و زرعی رقبہ رجسٹر کریں</h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              گاؤں / چک / موضع کا نام *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: چک 115/12-L، موضع مراد آباد"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white text-slate-800"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">تحصیل</label>
              <input
                type="text"
                required
                value={tehsil}
                onChange={(e) => setTehsil(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">ضلع</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">ڈویژن</label>
              <input
                type="text"
                required
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">کل زیرِ کاشت رقبہ (ایکڑ)</label>
              <input
                type="number"
                min="1"
                value={totalAcres}
                onChange={(e) => setTotalAcres(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">طریقہ آبپاشی (شرعی شرح)</label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
              >
                <option value="canal">نہری (Canal - 5% عشر)</option>
                <option value="tubewell">ٹیوب ویل (Tubewell - 5% عشر)</option>
                <option value="barani">بارانی (Rainfed - 10% عشر)</option>
                <option value="mixed">مخلوط آبپاشی (7.5% عشر)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">کاشتکاروں کی کل تعداد</label>
              <input
                type="number"
                min="1"
                value={landownersCount}
                onChange={(e) => setLandownersCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">متوقع سالانہ ہدف عشر (روپے)</label>
              <input
                type="number"
                min="0"
                value={estimatedTargetUshr}
                onChange={(e) => setEstimatedTargetUshr(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">مقامی رابطہ کار (فوکل پرسن)</label>
              <input
                type="text"
                value={focalPerson}
                onChange={(e) => setFocalPerson(e.target.value)}
                placeholder="نمبردار یا معزز زمیندار کا نام"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">فون نمبر</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="0300-1234567"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">اضافی تفصیلات / نوٹس</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="بڑی فصلیں، اوطاق یا مسجد رابطہ..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
            />
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
              <Check className="w-4 h-4" />
              <span>موضع محفوظ کریں</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
