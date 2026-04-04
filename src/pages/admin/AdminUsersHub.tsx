/**
 * Admin Combined: User Approval + User Management + Judge Assignments (tabs)
 */
import { useState } from 'react';
import { UserCheck, Key, Scale } from 'lucide-react';
import AdminUserApproval from './AdminUserApproval';
import AdminUserManagement from './AdminUserManagement';
import AdminJudges from './AdminJudges';

const TABS = [
  { id: 'approval', label: 'Approval', icon: UserCheck },
  { id: 'management', label: 'Management', icon: Key },
  { id: 'judges', label: 'Judges', icon: Scale },
];

const AdminUsersHub = () => {
  const [activeTab, setActiveTab] = useState('approval');

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

      {activeTab === 'approval' && <AdminUserApproval />}
      {activeTab === 'management' && <AdminUserManagement />}
      {activeTab === 'judges' && <AdminJudges />}
    </div>
  );
};

export default AdminUsersHub;
