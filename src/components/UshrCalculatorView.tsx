import React, { useState } from 'react';
import { UshrCalculation, Village } from '../types';
import { formatPKR, formatMaunds, formatNumber } from '../utils/formatters';
import { 
  Calculator, 
  Receipt, 
  HelpCircle, 
  BookOpen, 
  Check, 
  Printer, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface UshrCalculatorViewProps {
  villages: Village[];
  onGenerateReceipt: (receipt: UshrCalculation) => void;
  savedReceipts: UshrCalculation[];
  onViewReceipt: (receipt: UshrCalculation) => void;
}

const COMMON_CROPS = [
  { name: 'گندم (Wheat)', defaultRate: 3900 },
  { name: 'دھان / چاول (Rice Paddy)', defaultRate: 4200 },
  { name: 'مکئی (Maize / Corn)', defaultRate: 2800 },
  { name: 'کپاس / پھٹی (Cotton)', defaultRate: 8500 },
  { name: 'کماد / گنا (Sugarcane)', defaultRate: 450 },
  { name: 'سرسوں / رایا (Mustard Seed)', defaultRate: 6500 },
  { name: 'باغات و پھل (Orchards / Fruits)', defaultRate: 3500 },
];

export const UshrCalculatorView: React.FC<UshrCalculatorViewProps> = ({
  villages,
  onGenerateReceipt,
  savedReceipts,
  onViewReceipt,
}) => {
  const [landownerName, setLandownerName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedVillage, setSelectedVillage] = useState(villages[0]?.name || '');
  const [cropName, setCropName] = useState(COMMON_CROPS[0].name);
  const [productionMaunds, setProductionMaunds] = useState<number>(100);
  const [ratePerMaund, setRatePerMaund] = useState<number>(3900);
  const [irrigationMethod, setIrrigationMethod] = useState<'canal_tubewell' | 'barani' | 'mixed'>('canal_tubewell');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'grain' | 'bank_transfer'>('cash');
  const [officerName, setOfficerName] = useState('محمد ارشد قادری');

  // Rate % determination
  const ratePercentage = irrigationMethod === 'barani' ? 10 : irrigationMethod === 'canal_tubewell' ? 5 : 7.5;
  const ushrDueMaunds = (productionMaunds * ratePercentage) / 100;
  const ushrDueCash = ushrDueMaunds * ratePerMaund;

  const handleCropChange = (crop: string) => {
    setCropName(crop);
    const found = COMMON_CROPS.find((c) => c.name === crop);
    if (found) {
      setRatePerMaund(found.defaultRate);
    }
  };

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landownerName.trim()) {
      alert('براہِ کرم زمیندار کا نام درج فرمائیں۔');
      return;
    }

    const receipt: UshrCalculation = {
      landownerName,
      phone,
      village: selectedVillage || 'موضع زیرِ انتظام',
      cropName,
      totalProductionMaunds: Number(productionMaunds),
      ratePerMaund: Number(ratePerMaund),
      irrigationMethod,
      ratePercentage,
      ushrDueMaunds: Number(ushrDueMaunds.toFixed(2)),
      ushrDueCash: Math.round(ushrDueCash),
      paidAmount: Math.round(ushrDueCash),
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
      receiptNumber: `USH-${Math.floor(100000 + Math.random() * 900000)}`,
      officerName,
    };

    onGenerateReceipt(receipt);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 font-nastaliq">
          عشر شرعی کیلکولیٹر و سرکاری رسید جنریٹر
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          قرآن و سنت کی روشنی میں بارانی (10%) اور نہری/ٹیوب ویل (5%) شرعی شرح کے مطابق درست حساب اور رسید کی تیاری
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleCreateReceipt} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-700" />
                <span>فصل و پیداوار کی تفصیلات درج کریں</span>
              </span>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                شرح عشر: {ratePercentage}% ({irrigationMethod === 'barani' ? 'دسواں حصہ' : 'بیسواں حصہ'})
              </span>
            </div>

            {/* Donor / Landowner info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  نام زمیندار / کاشتکار *
                </label>
                <input
                  type="text"
                  required
                  value={landownerName}
                  onChange={(e) => setLandownerName(e.target.value)}
                  placeholder="مثال: چوہدری فاروق احمد"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  رابطہ نمبر (موبائل)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white text-slate-800 font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  متعلقہ موضع / گاؤں
                </label>
                <select
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 text-slate-800"
                >
                  {villages.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name} (تحصیل {v.tehsil})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Irrigation selection */}
            <div>
              <label className="block text-slate-700 font-medium text-xs mb-2">
                طریقہ آبپاشی (شرعی شرح کا تعین):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setIrrigationMethod('canal_tubewell')}
                  className={`p-3 rounded-lg border text-right transition-all ${
                    irrigationMethod === 'canal_tubewell'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900 text-xs flex items-center justify-between">
                    <span>مصنوعی آبپاشی / نہر و ٹیوب ویل</span>
                    {irrigationMethod === 'canal_tubewell' && <Check className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-bold mt-1">شرح: 5% (نصف العشر)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">جس میں محنت یا پانی خریدنے کے اخراجات ہوں</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIrrigationMethod('barani')}
                  className={`p-3 rounded-lg border text-right transition-all ${
                    irrigationMethod === 'barani'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900 text-xs flex items-center justify-between">
                    <span>قدرتی بارش / چشمے / ندی نالے</span>
                    {irrigationMethod === 'barani' && <Check className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <div className="text-[11px] text-amber-800 font-bold mt-1">شرح: 10% (العشر پورا)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">بارانی رقبہ جات جہاں آبپاشی کا خرچ نہ ہو</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIrrigationMethod('mixed')}
                  className={`p-3 rounded-lg border text-right transition-all ${
                    irrigationMethod === 'mixed'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900 text-xs flex items-center justify-between">
                    <span>مخلوط آبپاشی (دونوں ذرائع)</span>
                    {irrigationMethod === 'mixed' && <Check className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <div className="text-[11px] text-purple-800 font-bold mt-1">شرح: 7.5% (مخلوط شرح)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">آدھی فصل بارش اور آدھی ٹیوب ویل وغیرہ پر</div>
                </button>
              </div>
            </div>

            {/* Crop & Production values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  فصل کا انتخاب
                </label>
                <select
                  value={cropName}
                  onChange={(e) => handleCropChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 text-slate-800"
                >
                  {COMMON_CROPS.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  کل پیداوار (من میں) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={productionMaunds}
                  onChange={(e) => setProductionMaunds(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white text-slate-800 font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  مارکیٹ ریٹ فی من (روپے میں)
                </label>
                <input
                  type="number"
                  min="1"
                  value={ratePerMaund}
                  onChange={(e) => setRatePerMaund(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white text-slate-800 font-mono tabular-nums"
                />
              </div>
            </div>

            {/* Payment Method & Officer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  طریقہ ادائیگی
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 text-slate-800"
                >
                  <option value="cash">نقد رقم (Cash Payment)</option>
                  <option value="grain">براہِ راست غلہ / اجناس (Grain/Maunds)</option>
                  <option value="bank_transfer">آن لائن بینک ٹرانسفر (Online Transfer)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  وصول کنندہ ذمہ دار کا نام
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white text-slate-800"
                />
              </div>
            </div>

            {/* Live Calculation Result Preview Card */}
            <div className="p-4 bg-emerald-900 text-white rounded-xl space-y-3">
              <div className="text-xs text-emerald-200 flex items-center justify-between">
                <span>فوری حسابی نتیجہ برائے عشر:</span>
                <span className="font-mono">{ratePercentage}% شرعی تناسب</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1 border-t border-emerald-800">
                <div>
                  <div className="text-[11px] text-emerald-300">واجب الادا عشر غلہ (من):</div>
                  <div className="text-2xl font-bold font-mono tabular-nums">
                    {formatMaunds(Number(ushrDueMaunds.toFixed(2)))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-emerald-300">مساوی نقد قیمت (روپے):</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-emerald-100">
                    {formatPKR(ushrDueCash)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs flex items-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                <span>سرکاری رسید تیار کریں و پرنٹ کریں</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Info: Shariah Guidelines & History (1 col) */}
        <div className="space-y-6">
          {/* Shariah Guidance Box */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs pb-2 border-b border-slate-100">
              <BookOpen className="w-4 h-4" />
              <span>شرعی احکام و رہنما اصول برائے عشر</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              عشر زمین کی پیداوار کی زکوٰۃ ہے، جس کی ادائیگی ہر صاحبِ زراعت پر فصل کی کٹائی کے وقت فرض ہے۔
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg">
                <div className="font-bold text-amber-900">1. بارانی زمین (العشر - 10%):</div>
                <div className="text-slate-600 text-[11px] mt-0.5">
                  جو زمین بارش یا ندی نالوں سے سیراب ہو، اس میں پوری پیداوار کا دسواں حصہ واجب ہے۔
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                <div className="font-bold text-emerald-900">2. نہری و ٹیوب ویل (نصف العشر - 5%):</div>
                <div className="text-slate-600 text-[11px] mt-0.5">
                  جس زمین پر ٹیوب ویل یا نہری پانی کے محنت و اخراجات ہوں، اس میں بیسواں حصہ (5%) واجب ہے۔
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              فتویٰ و ہدایات: نصاب کے حوالے سے جمہور فقہاء کے نزدیک زمین کی تمام اجناس و پھل پر عشر لاگو ہے۔
            </div>
          </div>

          {/* Recently Issued Receipts */}
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">حالیہ جاری کردہ رسیدات</span>
              <span className="text-xs text-slate-400 font-mono">{savedReceipts.length} رسیدیں</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {savedReceipts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  ابھی تک کوئی رسید جاری نہیں کی گئی۔ فارم بھر کر "رسید تیار کریں" دبائیں۔
                </div>
              ) : (
                savedReceipts.slice(0, 5).map((rec) => (
                  <div key={rec.receiptNumber} className="p-3 text-xs hover:bg-slate-50/60 transition-colors flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{rec.landownerName}</div>
                      <div className="text-[11px] text-slate-500">
                        {rec.cropName} · {rec.village}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{rec.receiptNumber}</div>
                    </div>
                    <div className="text-left">
                      <div className="font-mono font-bold text-emerald-800 tabular-nums">
                        {formatPKR(rec.paidAmount)}
                      </div>
                      <button
                        onClick={() => onViewReceipt(rec)}
                        className="mt-1 text-[11px] text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-medium"
                      >
                        <Printer className="w-3 h-3" />
                        <span>پرنٹ</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
