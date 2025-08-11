export type JourneyType = 'ttc' | 'pregnant' | 'postpartum' | 'general';

export interface CommunityGroup {
  slug: string;
  name: string;
  description: string;
  journey: JourneyType;
  memberCount: number;
  coverImage: string;
  badge?: string;
}

export const groups: CommunityGroup[] = [
  // TTC groups
  {
    slug: 'ttc-journey-support',
    name: 'TTC Journey Support',
    description: 'Share experiences, tips, and encouragement with others trying to conceive.',
    journey: 'ttc',
    memberCount: 892,
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    badge: 'TTC'
  },
  {
    slug: 'fertility-nutrition',
    name: 'Fertility Nutrition',
    description: 'Discuss foods, supplements, and daily habits that support fertility and hormonal balance.',
    journey: 'ttc',
    memberCount: 534,
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    badge: 'FN'
  },
  {
    slug: 'cycle-tracking-buddies',
    name: 'Cycle Tracking Buddies',
    description: 'Compare cycle insights, ovulation windows, and support each other through the TWW.',
    journey: 'ttc',
    memberCount: 617,
    coverImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
    badge: 'CT'
  },
  {
    slug: 'mindful-wellness',
    name: 'Mindful Wellness',
    description: 'Stress relief, yoga, and mindfulness to stay grounded throughout your journey.',
    journey: 'ttc',
    memberCount: 721,
    coverImage: 'https://images.unsplash.com/photo-1519181245277-cffeb31da2fb',
    badge: 'MW'
  },

  // Pregnant groups
  {
    slug: 'first-trimester-crew',
    name: 'First Trimester Crew',
    description: 'Connect with others in their 1st trimester—nausea tips, early scans, and support.',
    journey: 'pregnant',
    memberCount: 1_042,
    coverImage: 'https://images.unsplash.com/photo-1522335789203-9d73c12b9b59',
    badge: 'T1'
  },
  {
    slug: 'prenatal-fitness',
    name: 'Prenatal Fitness',
    description: 'Safe workouts, mobility, and tips to stay active throughout pregnancy.',
    journey: 'pregnant',
    memberCount: 864,
    coverImage: 'https://images.unsplash.com/photo-1518600506278-4e8ef466b810',
    badge: 'PF'
  },

  // Postpartum groups
  {
    slug: 'postpartum-support',
    name: 'Postpartum Support',
    description: 'Recovery, mental health, and gentle fitness—support for the fourth trimester.',
    journey: 'postpartum',
    memberCount: 1_245,
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    badge: 'PP'
  },
  {
    slug: 'working-moms',
    name: 'Working Moms',
    description: 'Balance career and motherhood—time-saving tips, routines, and solidarity.',
    journey: 'postpartum',
    memberCount: 876,
    coverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    badge: 'WM'
  },
  {
    slug: 'fitness-together',
    name: 'Fitness Together',
    description: 'Build strength and energy with short, effective workouts and accountability.',
    journey: 'postpartum',
    memberCount: 2_104,
    coverImage: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186',
    badge: 'FT'
  },
  {
    slug: 'sleep-training-help',
    name: 'Sleep Training Help',
    description: 'Gentle methods, schedules, and real stories to help your little one sleep.',
    journey: 'postpartum',
    memberCount: 1_389,
    coverImage: 'https://images.unsplash.com/photo-1522335789203-9b74779a0527',
    badge: 'ZZ'
  },

  // General groups
  {
    slug: 'nutrition-for-moms',
    name: 'Nutrition for Moms',
    description: 'Healthy, simple recipes and smart planning for busy mom life.',
    journey: 'general',
    memberCount: 1_901,
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    badge: 'NF'
  }
];

export function getGroupsForStage(stage?: string) {
  if (stage === 'ttc') return groups.filter(g => g.journey === 'ttc' || g.journey === 'general');
  if (stage === 'pregnant') return groups.filter(g => g.journey === 'pregnant' || g.journey === 'general');
  // default to postpartum groups if not TTC or pregnant
  return groups.filter(g => g.journey === 'postpartum' || g.journey === 'general');
}
