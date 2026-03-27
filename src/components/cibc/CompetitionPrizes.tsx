/**
 * Competition Prizes Component
 * Dynamic prizes from database
 */

import { useEffect, useState } from 'react';
import { Trophy, DollarSign, Award, Loader2 } from 'lucide-react';
import { cibcContentService } from '@/services/cibc.service';

interface Prize {
  rank: string;
  prize: string;
  description?: string;
}

const CompetitionPrizes = () => {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [totalPrize, setTotalPrize] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrizes();
  }, []);

  const loadPrizes = async () => {
    try {
      const content = await cibcContentService.getSection('prizes');
      if (content) {
        setTotalPrize((content.total as string) || '$10,000+');
        setPrizes((content.categories as Prize[]) || []);
      }
    } catch (error) {
      console.error('Failed to load prizes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default prizes if not loaded
  const defaultPrizes: Prize[] = [
    { rank: '1st Place', prize: '$5,000', description: 'Grand Champion' },
    { rank: '2nd Place', prize: '$3,000', description: 'First Runner Up' },
    { rank: '3rd Place', prize: '$2,000', description: 'Second Runner Up' },
  ];

  const displayPrizes = prizes.length > 0 ? prizes : defaultPrizes;

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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cibc-primary/10 rounded-full mb-4">
            <Trophy className="w-5 h-5 text-cibc-primary" />
            <span className="text-cibc-primary font-medium">Prizes</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-4">
            Win Amazing Prizes
          </h2>
          <div className="flex items-center justify-center gap-2">
            <DollarSign className="w-6 h-6 text-cibc-primary" />
            <span className="text-4xl font-bold text-cibc-primary font-display">
              {totalPrize}
            </span>
          </div>
          <p className="text-cibc-textSecondary mt-4 max-w-2xl mx-auto">
            Compete for the grand prize and showcase your innovative business solutions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {displayPrizes.map((prize, index) => (
              <div
                key={index}
                className={`
                  relative p-6 rounded-2xl text-center transition-all
                  ${index === 0
                    ? 'bg-gradient-to-b from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/30 transform md:-translate-y-4'
                    : 'bg-cibc-bgCard border border-cibc-border hover:border-cibc-primary/30'
                  }
                `}
              >
                {index === 0 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                      GRAND PRIZE
                    </div>
                  </div>
                )}

                <div className={`
                  w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4
                  ${index === 0 ? 'bg-yellow-500/20' : 'bg-cibc-primary/10'}
                `}>
                  <Award className={`w-8 h-8 ${index === 0 ? 'text-yellow-500' : 'text-cibc-primary'}`} />
                </div>

                <h3 className="text-xl font-bold text-white font-display mb-1">
                  {prize.rank}
                </h3>

                <div className={`text-3xl font-bold font-display mb-2 ${index === 0 ? 'text-yellow-500' : 'text-cibc-primary'}`}>
                  {prize.prize}
                </div>

                {prize.description && (
                  <p className="text-cibc-textMuted text-sm">
                    {prize.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitionPrizes;