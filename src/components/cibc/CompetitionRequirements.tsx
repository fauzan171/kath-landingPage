/**
 * Competition Requirements Component
 */

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { cibcContentService } from '@/services/cibc.service';

const CompetitionRequirements = () => {
  const [requirements, setRequirements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    try {
      const content = await cibcContentService.getSection('requirements');
      if (content && content.items) {
        setRequirements(content.items as string[]);
      }
    } catch (error) {
      console.error('Failed to load requirements:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultRequirements = [
    'Team of 3-5 members',
    'Valid student ID (for student category)',
    'Registration fee: $50/team',
    'Original work only - no plagiarism',
    'Submit before deadline'
  ];

  const displayRequirements = requirements.length > 0 ? requirements : defaultRequirements;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cibc-primary" />
      </div>
    );
  }

  return (
    <section className="py-16 bg-cibc-bgMain">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-4">
            Requirements
          </h2>
          <p className="text-cibc-textSecondary max-w-2xl mx-auto">
            Make sure your team meets all requirements before registering
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-2xl bg-cibc-bgCard border border-cibc-border">
            <ul className="space-y-4">
              {displayRequirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-cibc-primary shrink-0 mt-0.5" />
                  <span className="text-white">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitionRequirements;