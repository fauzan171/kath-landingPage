/**
 * Admin Combined: Registrations + Teams (tabs)
 */
import { useState } from 'react';
import { ClipboardList, Users } from 'lucide-react';
import AdminRegistrations from './AdminRegistrations';
import AdminUsers from './AdminUsers'; // AdminUsers = Teams page

const TABS = [
  { id: 'registrations', label: 'Registrations', icon: ClipboardList },
  { id: 'teams', label: 'Teams', icon: Users },
];

const AdminRegistrationsHub = () => {
  const [activeTab, setActiveTab] = useState('registrations');

  return (
    <div className="space-y-0">
      {/* Tab Bar */}
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

      {/* Content */}
      {activeTab === 'registrations' && <AdminRegistrations />}
      {activeTab === 'teams' && <AdminUsers />}
    </div>
  );
};

export default AdminRegistrationsHub;
