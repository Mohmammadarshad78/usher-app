import React from 'react';
import { USER_ROLES } from '../data/initialData';
import { RoleLevel } from '../types';
import { 
  BarChart3, 
  FileText, 
  CalendarDays, 
  MapPin, 
  Calculator, 
  Building2, 
  FileSpreadsheet, 
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRole: RoleLevel;
  setActiveRole: (role: RoleLevel) => void;
  onQuickAction: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeRole,
  setActiveRole,
  onQuickAction,
}) => {
  const navTabs = [
    { id: 'dashboard', label: 'عمومی ڈیش بورڈ', icon: BarChart3 },
    { id: 'daily-review', label: 'روزانہ جائزہ', icon: FileText },
    { id: 'jadwal', label: 'پیشگی جدول', icon: CalendarDays },
    { id: 'villages', label: 'گاؤں سیٹ اپ', icon: Building2 },
    { id: 'live-gps', label: 'جی پی ایس حاضری', icon: MapPin },
    { id: 'ushr-calc', label: 'عشر کیلکولیٹر و رسید', icon: Calculator },
    { id: 'reports', label: 'ماہانہ رپورٹس', icon: FileSpreadsheet },
  ];

  return (
    <header className="border-b border-emerald-950/10 bg-white sticky top-0 z-30 shadow-xs">
      {/* Top Bar: Strict 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <span className="font-nastaliq text-xl font-bold">ع</span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-emerald-950 font-nastaliq block leading-none">
                عشر و تنظیمی جائزہ پورٹل
              </span>
              <span className="text-xs text-slate-500 font-sans mt-0.5 block">
                مرکزی نظام برائے نگرانی و کارکردگی فیلڈ
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Role Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg p-1 border border-slate-200">
              <UserCheck className="w-4 h-4 text-emerald-700 mr-1" />
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as RoleLevel)}
                className="bg-transparent text-xs font-medium text-slate-800 outline-none cursor-pointer pr-1"
                title="عہدہ تبدیل کریں"
              >
                {USER_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.titleUrdu} ({r.levelBadge})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onQuickAction}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-xs whitespace-nowrap"
            >
              + فوری اندراج
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Navigation Scroll */}
      <div className="lg:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-1 overflow-x-auto bg-slate-50">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
