export type RoleLevel = 'provincial' | 'divisional' | 'district' | 'tehsil' | 'field_officer';

export interface UserRole {
  id: RoleLevel;
  titleUrdu: string;
  titleEnglish: string;
  levelBadge: string;
}

export interface Village {
  id: string;
  name: string; // e.g. چک 86/6-R, موضع کوٹ بخش
  tehsil: string; // e.g. ساہیوال
  district: string; // e.g. ساہیوال
  division: string; // e.g. ساہیوال
  totalAcres: number;
  irrigationType: 'canal' | 'tubewell' | 'barani' | 'mixed'; // 5% or 10%
  landownersCount: number;
  focalPerson: string;
  contactNumber: string;
  estimatedTargetUshr: number; // in Rupees
  notes?: string;
  createdAt: string;
}

export interface DailyReview {
  id: string;
  date: string;
  officerName: string;
  role: RoleLevel;
  tehsil: string;
  district: string;
  villageVisited: string;
  farmerMeetings: number;
  ulamaMeetings: number;
  cashCollected: number; // in PKR
  grainCollectedMaunds: number; // in Maunds (من)
  cropType: string; // گندم، چاول، کپاس، مکئی وغیرہ
  targetAchievedPercent: number;
  gpsVerified: boolean;
  remarks: string;
}

export interface JadwalEntry {
  id: string;
  scheduledDate: string;
  officerName: string;
  tehsil: string;
  district: string;
  targetVillage: string;
  purpose: 'عشر بیداری و ترغیب' | 'براہِ راست وصولی عشر' | 'زمیندار کونسل اجلاس' | 'مساجد و ائمہ رابطہ' | 'فیلڈ جائزہ و تصدیق';
  teamMembers: string[];
  expectedTargetPkr: number;
  status: 'منظور شدہ' | 'جاری' | 'زیرِ جائزہ' | 'مکمل';
  notes?: string;
}

export interface LocationCheckin {
  id: string;
  timestamp: string;
  officerName: string;
  role: string;
  villageName: string;
  tehsil: string;
  latitude: number;
  longitude: number;
  accuracy: number; // meters
  status: 'بر وقت حاضر' | 'فیلڈ وزٹ' | 'وصولی مقام';
  notes: string;
}

export interface UshrCalculation {
  landownerName: string;
  phone: string;
  village: string;
  cropName: string;
  totalProductionMaunds: number;
  ratePerMaund: number;
  irrigationMethod: 'barani' | 'canal_tubewell' | 'mixed';
  ratePercentage: number; // 10%, 5%, 7.5%
  ushrDueMaunds: number;
  ushrDueCash: number;
  paidAmount: number;
  paymentMethod: 'cash' | 'grain' | 'bank_transfer';
  date: string;
  receiptNumber: string;
  officerName: string;
}
