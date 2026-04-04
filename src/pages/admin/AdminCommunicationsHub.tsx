/**
 * Admin Combined: Announcements + Payments (tabs)
 */
import { useState } from 'react';
import { Megaphone, CreditCard } from 'lucide-react';
import AdminAnnouncements from './AdminAnnouncements';
import AdminPayments from './AdminPayments';

const TABS = [
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

const AdminCommunicationsHub = () => {
  const [activeTab, setActiveTab] = useState('announcements');

  return (
    <div>
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'announcements' && <AdminAnnouncements />}
      {activeTab === 'payments' && <AdminPayments />}
    </div>
  );
};

export default AdminCommunicationsHub;
