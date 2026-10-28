/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Village, 
  DailyReview, 
  JadwalEntry, 
  LocationCheckin, 
  UshrCalculation, 
  RoleLevel 
} from './types';
import { Storage } from './utils/storage';
import { USER_ROLES } from './data/initialData';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { DailyReviewView } from './components/DailyReviewView';
import { AdvanceJadwalView } from './components/AdvanceJadwalView';
import { VillageSetupView } from './components/VillageSetupView';
import { LiveLocationView } from './components/LiveLocationView';
import { UshrCalculatorView } from './components/UshrCalculatorView';
import { ReportsView } from './components/ReportsView';
import { ReceiptModal } from './components/ReceiptModal';
import { NewDailyReviewModal } from './components/NewDailyReviewModal';
import { NewJadwalModal } from './components/NewJadwalModal';
import { NewVillageModal } from './components/NewVillageModal';
import { RotateCcw, Calendar, ShieldCheck, MapPin } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeRole, setActiveRole] = useState<RoleLevel>('field_officer');

  // State loaded from Storage
  const [villages, setVillages] = useState<Village[]>(() => Storage.getVillages());
  const [reviews, setReviews] = useState<DailyReview[]>(() => Storage.getReviews());
  const [jadwal, setJadwal] = useState<JadwalEntry[]>(() => Storage.getJadwal());
  const [checkins, setCheckins] = useState<LocationCheckin[]>(() => Storage.getCheckins());
  const [savedReceipts, setSavedReceipts] = useState<UshrCalculation[]>(() => Storage.getReceipts());

  // Modals state
  const [showNewReviewModal, setShowNewReviewModal] = useState<boolean>(false);
  const [showNewJadwalModal, setShowNewJadwalModal] = useState<boolean>(false);
  const [showNewVillageModal, setShowNewVillageModal] = useState<boolean>(false);
  const [activeReceiptForModal, setActiveReceiptForModal] = useState<UshrCalculation | null>(null);

  // Sync state to LocalStorage
  const handleAddReview = (newReview: DailyReview) => {
    const updated = [newReview, ...reviews];
    setReviews(updated);
    Storage.saveReviews(updated);
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('کیا آپ واقعی اس فیلڈ جائزے کو حذف کرنا چاہتے ہیں؟')) {
      const updated = reviews.filter((r) => r.id !== id);
      setReviews(updated);
      Storage.saveReviews(updated);
    }
  };

  const handleAddJadwal = (newEntry: JadwalEntry) => {
    const updated = [newEntry, ...jadwal];
    setJadwal(updated);
    Storage.saveJadwal(updated);
  };

  const handleUpdateJadwalStatus = (id: string, status: JadwalEntry['status']) => {
    const updated = jadwal.map((j) => (j.id === id ? { ...j, status } : j));
    setJadwal(updated);
    Storage.saveJadwal(updated);
  };

  const handleAddVillage = (newVillage: Village) => {
    const updated = [newVillage, ...villages];
    setVillages(updated);
    Storage.saveVillages(updated);
  };

  const handleDeleteVillage = (id: string) => {
    if (window.confirm('کیا آپ واقعی اس گاؤں/موضع کا ریکارڈ حذف کرنا چاہتے ہیں؟')) {
      const updated = villages.filter((v) => v.id !== id);
      setVillages(updated);
      Storage.saveVillages(updated);
    }
  };

  const handleAddCheckin = (newCheckin: LocationCheckin) => {
    const updated = [newCheckin, ...checkins];
    setCheckins(updated);
    Storage.saveCheckins(updated);
  };

  const handleGenerateReceipt = (receipt: UshrCalculation) => {
    Storage.saveReceipt(receipt);
    setSavedReceipts(Storage.getReceipts());
    setActiveReceiptForModal(receipt);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'کیا آپ تمام ریکارڈز کو ابتدائی معیاری ڈیٹا پر ری سیٹ کرنا چاہتے ہیں؟'
      )
    ) {
      Storage.resetToDefault();
      setVillages(Storage.getVillages());
      setReviews(Storage.getReviews());
      setJadwal(Storage.getJadwal());
      setCheckins(Storage.getCheckins());
      setSavedReceipts(Storage.getReceipts());
    }
  };

  const currentRoleInfo =
    USER_ROLES.find((r) => r.id === activeRole) || USER_ROLES[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        onQuickAction={() => setShowNewReviewModal(true)}
      />

      {/* Sub-bar / Contextual Status Bar */}
      <div className="no-print bg-emerald-950 text-white text-xs border-b border-emerald-900 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Calendar className="w-3.5 h-3.5" />
              <span>مہم خریف و ربیع ۲۰۲۶ء</span>
            </span>
            <span aria-hidden="true" className="text-emerald-700">·</span>
            <span className="flex items-center gap-1 text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>فعال نگران: {currentRoleInfo.titleUrdu} ({currentRoleInfo.levelBadge})</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-emerald-300 hidden sm:inline">
              مرکزی کنٹرول روم: فعال
            </span>
            <button
              onClick={handleResetDefaults}
              className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
              title="ابتدائی نمونہ ڈیٹا بحال کریں"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ڈیفالٹ ڈیٹا بحال کریں</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            villages={villages}
            reviews={reviews}
            jadwal={jadwal}
            checkins={checkins}
            activeRole={activeRole}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenNewReview={() => setShowNewReviewModal(true)}
            onOpenNewJadwal={() => setShowNewJadwalModal(true)}
          />
        )}

        {activeTab === 'daily-review' && (
          <DailyReviewView
            reviews={reviews}
            onOpenNewReview={() => setShowNewReviewModal(true)}
            onDeleteReview={handleDeleteReview}
          />
        )}

        {activeTab === 'jadwal' && (
          <AdvanceJadwalView
            jadwal={jadwal}
            onOpenNewJadwal={() => setShowNewJadwalModal(true)}
            onUpdateStatus={handleUpdateJadwalStatus}
          />
        )}

        {activeTab === 'villages' && (
          <VillageSetupView
            villages={villages}
            onOpenNewVillage={() => setShowNewVillageModal(true)}
            onDeleteVillage={handleDeleteVillage}
          />
        )}

        {activeTab === 'live-gps' && (
          <LiveLocationView
            checkins={checkins}
            villages={villages}
            onAddCheckin={handleAddCheckin}
          />
        )}

        {activeTab === 'ushr-calc' && (
          <UshrCalculatorView
            villages={villages}
            onGenerateReceipt={handleGenerateReceipt}
            savedReceipts={savedReceipts}
            onViewReceipt={(receipt) => setActiveReceiptForModal(receipt)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            reviews={reviews}
            villages={villages}
            jadwal={jadwal}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-nastaliq text-sm text-slate-700">
            عشر و تنظیمی ذمہ داران جائزہ و کارکردگی پورٹل
          </p>
          <p className="text-[11px] text-slate-400">
            شعبہ عشر و تنظیمی جائزہ · تمام حقوق محفوظ ہیں ۲۰۲۶ء
          </p>
        </div>
      </footer>

      {/* Modals */}
      {showNewReviewModal && (
        <NewDailyReviewModal
          villages={villages}
          activeRole={activeRole}
          onClose={() => setShowNewReviewModal(false)}
          onSave={handleAddReview}
        />
      )}

      {showNewJadwalModal && (
        <NewJadwalModal
          villages={villages}
          onClose={() => setShowNewJadwalModal(false)}
          onSave={handleAddJadwal}
        />
      )}

      {showNewVillageModal && (
        <NewVillageModal
          onClose={() => setShowNewVillageModal(false)}
          onSave={handleAddVillage}
        />
      )}

      {activeReceiptForModal && (
        <ReceiptModal
          receipt={activeReceiptForModal}
          onClose={() => setActiveReceiptForModal(null)}
        />
      )}
    </div>
  );
}
