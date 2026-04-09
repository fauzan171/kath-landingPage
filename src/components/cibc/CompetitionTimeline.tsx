/**
 * Competition Timeline Component
 * Dynamic timeline fetched from database
 */

import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { stagesService, type Stage } from '@/services/cibc.service';
import { competitionService } from '@/services/cibc.service';
import { useLanguage } from '@/contexts/LanguageContext';

interface TimelineProps {
  competitionId?: string;
}

const CompetitionTimeline = ({ competitionId }: TimelineProps) => {
  const { t } = useLanguage();
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStages();
  }, [competitionId]);

  const loadStages = async () => {
    try {
      let compId = competitionId;
      if (!compId) {
        const comp = await competitionService.getActive();
        if (comp) compId = comp.id;
      }
      if (compId) {
        const data = await stagesService.getVisible(compId);
        setStages(data);
      }
    } catch (error) {
      console.error('Failed to load stages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStageStatus = (stage: Stage) => {
    const now = new Date();
    if (stage.start_date && stage.end_date) {
      const start = new Date(stage.start_date);
      const end = new Date(stage.end_date);
      if (now < start) return 'upcoming';
      if (now >= start && now <= end) return 'active';
      return 'completed';
    }
    if (stage.is_active) return 'active';
    return 'upcoming';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cibc-primary" />
      </div>
    );
  }

  if (stages.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-cibc-bgSection">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-4">
            {t('Linimasa Kompetisi', 'Competition Timeline')}
          </h2>
          <p className="text-cibc-textSecondary max-w-2xl mx-auto">
            {t('Ikuti perjalanan dari pendaftaran hingga babak final', 'Follow the journey from registration to the grand final')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-cibc-border hidden md:block" />

            <div className="space-y-6">
              {stages.map((stage) => {
                const status = getStageStatus(stage);
                return (
                  <div
                    key={stage.id}
                    className={`relative flex items-start gap-6 p-6 rounded-xl transition-all ${
                      status === 'active'
                        ? 'bg-cibc-primary/10 border border-cibc-primary/30'
                        : 'bg-cibc-bgCard border border-cibc-border'
                    }`}
                  >
                    {/* Status Icon */}
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center shrink-0
                      ${status === 'completed' ? 'bg-green-500/20 text-green-500' : ''}
                      ${status === 'active' ? 'bg-cibc-primary/20 text-cibc-primary' : ''}
                      ${status === 'upcoming' ? 'bg-cibc-border text-cibc-textMuted' : ''}
                    `}>
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : status === 'active' ? (
                        <Clock className="w-8 h-8" />
                      ) : (
                        <Circle className="w-8 h-8" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white font-display">
                          {stage.name}
                        </h3>
                        {status === 'active' && (
                          <span className="px-2 py-0.5 bg-cibc-primary text-cibc-textDark text-xs font-medium rounded-full">
                            {t('Saat Ini', 'Current')}
                          </span>
                        )}
                      </div>

                      {stage.description && (
                        <p className="text-cibc-textSecondary mb-3">
                          {stage.description}
                        </p>
                      )}

                      {(stage.start_date || stage.end_date) && (
                        <div className="flex items-center gap-2 text-sm text-cibc-textMuted">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatDate(stage.start_date)}
                            {stage.end_date && ` - ${formatDate(stage.end_date)}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Step Number */}
                    <div className="text-4xl font-bold text-cibc-primary/20 font-display">
                      {String(stage.order_index).padStart(2, '0')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitionTimeline;