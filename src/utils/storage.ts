import {
  Village,
  DailyReview,
  JadwalEntry,
  LocationCheckin,
  UshrCalculation,
} from '../types';
import {
  INITIAL_VILLAGES,
  INITIAL_DAILY_REVIEWS,
  INITIAL_JADWAL,
  INITIAL_CHECKINS,
} from '../data/initialData';

const KEYS = {
  VILLAGES: 'ushr_portal_villages_v1',
  REVIEWS: 'ushr_portal_daily_reviews_v1',
  JADWAL: 'ushr_portal_jadwal_v1',
  CHECKINS: 'ushr_portal_checkins_v1',
  RECEIPTS: 'ushr_portal_receipts_v1',
  ROLE: 'ushr_portal_active_role_v1',
};

export const Storage = {
  getVillages: (): Village[] => {
    try {
      const data = localStorage.getItem(KEYS.VILLAGES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load villages from storage', e);
    }
    return INITIAL_VILLAGES;
  },
  saveVillages: (villages: Village[]) => {
    try {
      localStorage.setItem(KEYS.VILLAGES, JSON.stringify(villages));
    } catch (e) {
      console.warn('Failed to save villages to storage', e);
    }
  },

  getReviews: (): DailyReview[] => {
    try {
      const data = localStorage.getItem(KEYS.REVIEWS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load daily reviews from storage', e);
    }
    return INITIAL_DAILY_REVIEWS;
  },
  saveReviews: (reviews: DailyReview[]) => {
    try {
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to save daily reviews to storage', e);
    }
  },

  getJadwal: (): JadwalEntry[] => {
    try {
      const data = localStorage.getItem(KEYS.JADWAL);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load jadwal from storage', e);
    }
    return INITIAL_JADWAL;
  },
  saveJadwal: (jadwal: JadwalEntry[]) => {
    try {
      localStorage.setItem(KEYS.JADWAL, JSON.stringify(jadwal));
    } catch (e) {
      console.warn('Failed to save jadwal to storage', e);
    }
  },

  getCheckins: (): LocationCheckin[] => {
    try {
      const data = localStorage.getItem(KEYS.CHECKINS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load checkins from storage', e);
    }
    return INITIAL_CHECKINS;
  },
  saveCheckins: (checkins: LocationCheckin[]) => {
    try {
      localStorage.setItem(KEYS.CHECKINS, JSON.stringify(checkins));
    } catch (e) {
      console.warn('Failed to save checkins to storage', e);
    }
  },

  getReceipts: (): UshrCalculation[] => {
    try {
      const data = localStorage.getItem(KEYS.RECEIPTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load receipts from storage', e);
    }
    return [];
  },
  saveReceipt: (receipt: UshrCalculation) => {
    try {
      const existing = Storage.getReceipts();
      const updated = [receipt, ...existing];
      localStorage.setItem(KEYS.RECEIPTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save receipt to storage', e);
    }
  },

  resetToDefault: () => {
    try {
      localStorage.removeItem(KEYS.VILLAGES);
      localStorage.removeItem(KEYS.REVIEWS);
      localStorage.removeItem(KEYS.JADWAL);
      localStorage.removeItem(KEYS.CHECKINS);
      localStorage.removeItem(KEYS.RECEIPTS);
    } catch (e) {
      console.warn('Failed to reset storage', e);
    }
  },
};
