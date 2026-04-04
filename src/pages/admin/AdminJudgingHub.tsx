/**
 * Admin Combined: Submissions + Grading + Leaderboard (tabs)
 */
import { useState } from 'react';
import { FileText, Star, Trophy } from 'lucide-react';
import AdminSubmissions from './AdminSubmissions';
import AdminGrading from './AdminGrading';
import AdminLeaderboard from './AdminLeaderboard';

const TABS = [
  { id: 'submissions', label: 'Submissions', icon: FileText },
  { id: 'grading', label: 'Grading', icon: Star },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
];

const AdminJudgingHub = () => {
  const [activeTab, setActiveTab] = useState('submissions');

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

      {activeTab === 'submissions' && <AdminSubmissions />}
      {activeTab === 'grading' && <AdminGrading />}
      {activeTab === 'leaderboard' && <AdminLeaderboard />}
    </div>
  );
};

export default AdminJudgingHub;
