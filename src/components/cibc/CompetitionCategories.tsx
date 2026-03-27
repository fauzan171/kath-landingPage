/**
 * Competition Categories Component
 */

import { useEffect, useState } from 'react';
import { Users, GraduationCap, Briefcase, Loader2 } from 'lucide-react';
import { cibcContentService } from '@/services/cibc.service';

interface Category {
  name: string;
  description: string;
  icon?: string;
}

const CompetitionCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const content = await cibcContentService.getSection('categories');
      if (content && content.items) {
        setCategories(content.items as Category[]);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultCategories: Category[] = [
    {
      name: 'Student Category',
      description: 'Open to all undergraduate students with valid student ID',
      icon: 'graduation'
    },
    {
      name: 'Open Category',
      description: 'Open to professionals, graduates, and general public',
      icon: 'briefcase'
    }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  const getIcon = (icon?: string) => {
    switch (icon) {
      case 'graduation': return GraduationCap;
      case 'briefcase': return Briefcase;
      default: return Users;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cibc-primary" />
      </div>
    );
  }

  return (
    <section className="py-16 bg-cibc-bgSection">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-4">
            Competition Categories
          </h2>
          <p className="text-cibc-textSecondary max-w-2xl mx-auto">
            Choose the category that fits your profile
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {displayCategories.map((category, index) => {
              const Icon = getIcon(category.icon);
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-cibc-bgCard border border-cibc-border hover:border-cibc-primary/30 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-cibc-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-cibc-primary" />
                  </div>

                  <h3 className="text-xl font-bold text-white font-display mb-2">
                    {category.name}
                  </h3>

                  <p className="text-cibc-textSecondary">
                    {category.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitionCategories;