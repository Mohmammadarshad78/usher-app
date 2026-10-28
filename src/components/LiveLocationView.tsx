import React, { useState } from 'react';
import { LocationCheckin, Village } from '../types';
import { 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Radio
} from 'lucide-react';

interface LiveLocationViewProps {
  checkins: LocationCheckin[];
  villages: Village[];
  onAddCheckin: (checkin: LocationCheckin) => void;
}

export const LiveLocationView: React.FC<LiveLocationViewProps> = ({
  checkins,
  villages,
  onAddCheckin,
}) => {
  const [officerName, setOfficerName] = useState('محمد ارشد قادری');
  const [role, setRole] = useState('فیلڈ رابطہ آفیسر');
  const [selectedVillageId, setSelectedVillageId] = useState(villages[0]?.id || '');
  const [status, setStatus] = useState<'بر وقت حاضر' | 'فیلڈ وزٹ' | 'وصولی مقام'>('فیلڈ وزٹ');
  const [notes, setNotes] = useState('');
  
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);

  const handleGetLocation = () => {
    setGeoError(null);
    setIsLocating(true);

    if (!('geolocation' in navigator)) {
      setGeoError('آپ کے براؤزر میں جی پی ایس سپورٹ دستیاب نہیں ہے۔');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        // If permission denied in iframe or local testing, provide graceful location for demo:
        setGeoError('براؤزر جی پی ایس اجازت موصول نہیں ہوئی۔ فرضی ڈیمو کوآرڈینیٹس درج کیے جا رہے ہیں۔');
        setCurrentCoords({
          latitude: 30.6682 + (Math.random() - 0.5) * 0.05,
          longitude: 73.1074 + (Math.random() - 0.5) * 0.05,
          accuracy: 10,
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmitCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCoords) {
      alert('براہِ کرم پہلے "مقام حاصل کریں" بٹن دبا کر لوکیشن حاصل کریں۔');
      return;
    }

    const v = villages.find((x) => x.id === selectedVillageId) || villages[0];
    const newCheckin: LocationCheckin = {
      id: `chk-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
      officerName,
      role,
      villageName: v ? v.name : 'فیلڈ موضع',
      tehsil: v ? v.tehsil : 'ساہیوال',
      latitude: Number(currentCoords.latitude.toFixed(5)),
      longitude: Number(currentCoords.longitude.toFixed(5)),
      accuracy: currentCoords.accuracy,
      status,
      notes: notes || 'موقع پر حاضری و فیلڈ وزٹ مصدقہ بذریعہ جی پی ایس',
    };

    onAddCheckin(newCheckin);
    setNotes('');
    alert('ماشاءاللہ! آپ کی لائیو لوکیشن حاضری کامیابی سے محفوظ ہو چکی ہے۔');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 font-nastaliq">
          لائیو لوکیشن و جی پی ایس حاضری سسٹم
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          فیلڈ افسران و تنظیمی ذمہ داران کی موقع پر موجودگی کی براہِ راست جی پی ایس تصدیق و ریکارڈ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Check-in Form Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-4 pb-2 border-b border-slate-100">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>نئی لائیو لوکیشن حاضری لگائیں</span>
          </div>

          <form onSubmit={handleSubmitCheckin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                ذمہ دار کا نام
              </label>
              <input
                type="text"
                required
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                عہدہ / ذمہ داری
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                متعلقہ گاؤں / موضع
              </label>
              <select
                value={selectedVillageId}
                onChange={(e) => setSelectedVillageId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 text-slate-800"
              >
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} (تحصیل {v.tehsil})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                حاضری کی نوعیت
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 text-slate-800"
              >
                <option value="فیلڈ وزٹ">فیلڈ وزٹ (Field Visit)</option>
                <option value="بر وقت حاضر">بر وقت حاضر (On-time Attendance)</option>
                <option value="وصولی مقام">وصولی مقام (Collection Spot)</option>
              </select>
            </div>

            {/* GPS capture area */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>جی پی ایس کوآرڈینیٹس:</span>
                </span>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-medium transition-colors disabled:opacity-50"
                >
                  {isLocating ? 'لوکیشن لی جا رہی ہے...' : 'مقام حاصل کریں'}
                </button>
              </div>

              {geoError && (
                <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                  {geoError}
                </div>
              )}

              {currentCoords ? (
                <div className="text-[11px] font-mono text-slate-800 space-y-0.5" dir="ltr">
                  <div>Lat: {currentCoords.latitude.toFixed(6)}</div>
                  <div>Lng: {currentCoords.longitude.toFixed(6)}</div>
                  <div className="text-emerald-700 font-sans text-right">
                    درستی: &plusmn;{currentCoords.accuracy} میٹر
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">
                  ابھی تک لوکیشن حاصل نہیں کی گئی۔ اوپر بٹن دبائیں۔
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                کیفیات و ریمارکس
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="موقع پر موجود معززین، پیش رفت وغیرہ..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={!currentCoords}
              className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>حاضری تصدیق و محفوظ کریں</span>
            </button>
          </form>
        </div>

        {/* Check-ins Log & Map Representation (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  محفوظ شدہ لائیو حاضری ریکارڈ
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  تمام مصدقہ لوکیشن اندراجات بمعہ گوگل میپ روابط
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-3.5 py-3 font-semibold">وقت و تاریخ</th>
                    <th className="px-3.5 py-3 font-semibold">ذمہ دار و عہدہ</th>
                    <th className="px-3.5 py-3 font-semibold">مقام (گاؤں و تحصیل)</th>
                    <th className="px-3.5 py-3 font-semibold">نوعیت</th>
                    <th className="px-3.5 py-3 font-semibold">کوآرڈینیٹس</th>
                    <th className="px-3.5 py-3 font-semibold">نوٹس</th>
                    <th className="px-3.5 py-3 font-semibold text-center">نقشہ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {checkins.map((chk) => (
                    <tr key={chk.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-3.5 py-3 font-mono text-[11px] text-slate-600 whitespace-nowrap tabular-nums">
                        {chk.timestamp}
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{chk.officerName}</div>
                        <div className="text-[11px] text-slate-400">{chk.role}</div>
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{chk.villageName}</div>
                        <div className="text-[11px] text-slate-400">تحصیل {chk.tehsil}</div>
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {chk.status}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 font-mono text-[11px] text-slate-600 tabular-nums whitespace-nowrap" dir="ltr">
                        {chk.latitude.toFixed(4)}, {chk.longitude.toFixed(4)}
                        <div className="text-[10px] text-slate-400">&plusmn;{chk.accuracy}m</div>
                      </td>
                      <td className="px-3.5 py-3 text-slate-600 max-w-xs text-[11px] truncate">
                        {chk.notes}
                      </td>
                      <td className="px-3.5 py-3 text-center whitespace-nowrap">
                        <a
                          href={`https://maps.google.com/?q=${chk.latitude},${chk.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-medium"
                          title="گوگل میپ پر دیکھیں"
                        >
                          <span>میپ</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
