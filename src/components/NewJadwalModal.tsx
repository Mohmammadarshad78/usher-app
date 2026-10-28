import React, { useState } from 'react';
import { JadwalEntry, Village } from '../types';
import { X, CalendarDays, Check } from 'lucide-react';

interface NewJadwalModalProps {
  villages: Village[];
  onClose: () => void;
  onSave: (entry: JadwalEntry) => void;
}

export const NewJadwalModal: React.FC<NewJadwalModalProps> = ({
  villages,
  onClose,
  onSave,
}) => {
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [officerName, setOfficerName] = useState('محمد ارشد قادری');
  const [targetVillage, setTargetVillage] = useState(villages[0]?.name || 'چک 86/6-R');
  const [tehsil, setTehsil] = useState(villages[0]?.tehsil || 'ساہیوال');
  const [district, setDistrict] = useState(villages[0]?.district || 'ساہیوال');
  const [purpose, setPurpose] = useState<JadwalEntry['purpose']>('عشر بیداری و ترغیب');
  const [teamMembersInput, setTeamMembersInput] = useState('محمد ارشد قادری، قاری طاہر محمود');
  const [expectedTargetPkr, setExpectedTargetPkr] = useState(100000);
  const [notes, setNotes] = useState('');

  const handleVillageSelect = (villageName: string) => {
    setTargetVillage(villageName);
    const found = villages.find((v) => v.name === villageName);
    if (found) {
      setTehsil(found.tehsil);
      setDistrict(found.district);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const members = teamMembersInput
      .split(/[,،]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const newJadwal: JadwalEntry = {
      id: `jd-${Date.now()}`,
      scheduledDate,
      officerName,
      tehsil,
      district,
      targetVillage,
      purpose,
      teamMembers: members.length > 0 ? members : [officerName],
      expectedTargetPkr: Number(expectedTargetPkr),
      status: 'زیرِ جائزہ',
      notes,
    };

    onSave(newJadwal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-emerald-400" />
            <h2 className="font-bold text-sm">نیا پیشگی جدول شیڈول کریں (ٹور پلان)</h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">شیڈول شدہ تاریخ</label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">نگران آفیسر کا نام</label>
              <input
                type="text"
                required
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">ہدف موضع / گاؤں</label>
              <select
                value={targetVillage}
                onChange={(e) => handleVillageSelect(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
              >
                {villages.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name} ({v.tehsil})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">تحصیل</label>
              <input
                type="text"
                value={tehsil}
                onChange={(e) => setTehsil(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">دورے کا بنیادی مقصد</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
            >
              <option value="عشر بیداری و ترغیب">عشر بیداری و ترغیب مہم</option>
              <option value="براہِ راست وصولی عشر">براہِ راست وصولی عشر فیلڈ</option>
              <option value="زمیندار کونسل اجلاس">زمیندار کونسل / اوطاق اجلاس</option>
              <option value="مساجد و ائمہ رابطہ">مساجد، خطباء و ائمہ رابطہ مہم</option>
              <option value="فیلڈ جائزہ و تصدیق">فیلڈ جائزہ، رقبہ تصدیق و تخمینہ</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">ہمراہی ٹیم ارکان (کوما لگا کر لکھیں)</label>
            <input
              type="text"
              value={teamMembersInput}
              onChange={(e) => setTeamMembersInput(e.target.value)}
              placeholder="مثال: محمد ارشد، قاری تنویر، ملک ساجد"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">متوقع وصولی کا تخمینی ہدف (روپے)</label>
            <input
              type="number"
              min="0"
              value={expectedTargetPkr}
              onChange={(e) => setExpectedTargetPkr(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">اضافی ہدایات یا نوٹس</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مقامی رابطہ کار کا نام، مقام وغیرہ..."
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
              <span>پیشگی جدول محفوظ کریں</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
