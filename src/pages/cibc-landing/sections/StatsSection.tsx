import { AnimatedCounter } from '../components/AnimatedCounter';
import { COMPETITION_DATA } from '../data/cibcData';

export const StatsSection = () => {
    return (
        <section className="py-24 border-y border-gray-200 bg-white relative z-10">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 divide-x divide-gray-100/0 md:divide-gray-200">
                    {COMPETITION_DATA.stats.map((stat, index) => (
                        <AnimatedCounter key={index} value={stat.value} label={stat.label} />
                    ))}
                </div>
            </div>
        </section>
    );
};