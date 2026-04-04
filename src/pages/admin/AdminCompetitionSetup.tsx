/**
 * Admin Combined: Timeline (Stages) + Tasks (tabs)
 */
import { useState } from 'react';
import { Calendar, ListChecks } from 'lucide-react';
import AdminStages from './AdminStages';
import AdminTasks from './AdminTasks';

const TABS = [
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'tasks', label: 'Tasks', icon: ListChecks },
];

const AdminCompetitionSetup = () => {
  const [activeTab, setActiveTab] = useState('timeline');

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

      {activeTab === 'timeline' && <AdminStages />}
      {activeTab === 'tasks' && <AdminTasks />}
    </div>
  );
};

export default AdminCompetitionSetup;
