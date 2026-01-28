import { ContentItem } from '@/types';

export const contentPool: ContentItem[] = [
  // POLITICS - LEFT (3)
  {
    id: 'pol_l_1',
    headline: 'Study Shows Universal Basic Income Reduces Poverty Without Reducing Employment',
    category: 'politics_left',
    tags: ['economics', 'social policy', 'ubi'],
  },
  {
    id: 'pol_l_2',
    headline: 'Climate Activists Demand Immediate Ban on New Fossil Fuel Projects',
    category: 'politics_left',
    tags: ['climate', 'activism', 'environment'],
  },
  {
    id: 'pol_l_3',
    headline: 'Healthcare Workers Union Wins Historic Contract with Major Hospital Chain',
    category: 'politics_left',
    tags: ['labor', 'healthcare', 'unions'],
  },

  // POLITICS - RIGHT (3)
  {
    id: 'pol_r_1',
    headline: 'Small Business Owners Say New Regulations Are Killing Main Street',
    category: 'politics_right',
    tags: ['business', 'regulation', 'economy'],
  },
  {
    id: 'pol_r_2',
    headline: 'Parents Group Demands More Control Over School Curriculum',
    category: 'politics_right',
    tags: ['education', 'parental rights', 'schools'],
  },
  {
    id: 'pol_r_3',
    headline: 'Border Security Officials Report Record Crossings This Month',
    category: 'politics_right',
    tags: ['immigration', 'border', 'security'],
  },

  // POLITICS - CENTER (2)
  {
    id: 'pol_c_1',
    headline: 'Bipartisan Infrastructure Bill Passes with Rare Cross-Party Support',
    category: 'politics_center',
    tags: ['infrastructure', 'bipartisan', 'congress'],
  },
  {
    id: 'pol_c_2',
    headline: 'New Poll Shows Americans Want Compromise on Major Issues',
    category: 'politics_center',
    tags: ['polling', 'politics', 'compromise'],
  },

  // TECH - OPTIMIST (3)
  {
    id: 'tech_o_1',
    headline: 'AI System Discovers New Antibiotic That Kills Drug-Resistant Bacteria',
    category: 'tech_optimist',
    tags: ['ai', 'medicine', 'breakthrough'],
  },
  {
    id: 'tech_o_2',
    headline: 'Solar Power Now Cheaper Than Coal in Most Countries',
    category: 'tech_optimist',
    tags: ['solar', 'energy', 'climate'],
  },
  {
    id: 'tech_o_3',
    headline: 'New Brain-Computer Interface Helps Paralyzed Patient Walk Again',
    category: 'tech_optimist',
    tags: ['neurotech', 'medicine', 'innovation'],
  },

  // TECH - PESSIMIST (3)
  {
    id: 'tech_p_1',
    headline: 'AI Experts Warn: We Have 10 Years to Solve Alignment Problem',
    category: 'tech_pessimist',
    tags: ['ai', 'safety', 'risk'],
  },
  {
    id: 'tech_p_2',
    headline: 'Report: Social Media Algorithms Linked to Rising Teen Depression',
    category: 'tech_pessimist',
    tags: ['social media', 'mental health', 'teens'],
  },
  {
    id: 'tech_p_3',
    headline: 'Deepfakes Now Indistinguishable from Real Video, Researchers Warn',
    category: 'tech_pessimist',
    tags: ['deepfakes', 'misinformation', 'ai'],
  },

  // ENTERTAINMENT - CELEBRITY (2)
  {
    id: 'ent_c_1',
    headline: 'Pop Star Reveals Shocking Secret in Tell-All Interview',
    category: 'entertainment_celebrity',
    tags: ['celebrity', 'gossip', 'interview'],
  },
  {
    id: 'ent_c_2',
    headline: 'Famous Couple Announces Split After 12 Years of Marriage',
    category: 'entertainment_celebrity',
    tags: ['celebrity', 'relationship', 'news'],
  },

  // ENTERTAINMENT - MOVIES (2)
  {
    id: 'ent_m_1',
    headline: 'Marvel Announces Surprising New Direction for Next Phase',
    category: 'entertainment_movies',
    tags: ['marvel', 'movies', 'mcu'],
  },
  {
    id: 'ent_m_2',
    headline: 'Indie Film Wins Top Prize at Sundance, Studios in Bidding War',
    category: 'entertainment_movies',
    tags: ['sundance', 'indie', 'film'],
  },

  // ENTERTAINMENT - GAMING (2)
  {
    id: 'ent_g_1',
    headline: 'GTA 6 Trailer Breaks All-Time YouTube Record in 24 Hours',
    category: 'entertainment_gaming',
    tags: ['gaming', 'gta', 'rockstar'],
  },
  {
    id: 'ent_g_2',
    headline: 'New Study: Professional Esports Players Have Reflexes of Fighter Pilots',
    category: 'entertainment_gaming',
    tags: ['esports', 'gaming', 'science'],
  },

  // SPORTS - MAINSTREAM (2)
  {
    id: 'spt_m_1',
    headline: 'NBA Star Signs Record-Breaking $300 Million Contract Extension',
    category: 'sports_mainstream',
    tags: ['nba', 'basketball', 'contract'],
  },
  {
    id: 'spt_m_2',
    headline: 'World Cup Final Draws 1.5 Billion Viewers Worldwide',
    category: 'sports_mainstream',
    tags: ['soccer', 'world cup', 'fifa'],
  },

  // SPORTS - NICHE (2)
  {
    id: 'spt_n_1',
    headline: 'Underwater Hockey World Championship Draws Surprising Crowds',
    category: 'sports_niche',
    tags: ['underwater hockey', 'niche sports', 'championship'],
  },
  {
    id: 'spt_n_2',
    headline: 'Competitive Rock Paper Scissors League Announces $100K Prize Pool',
    category: 'sports_niche',
    tags: ['weird sports', 'competition', 'prize'],
  },

  // SCIENCE - CLIMATE (2)
  {
    id: 'sci_cl_1',
    headline: 'Arctic Ice Loss Accelerating Faster Than Any Model Predicted',
    category: 'science_climate',
    tags: ['climate', 'arctic', 'research'],
  },
  {
    id: 'sci_cl_2',
    headline: 'New Carbon Capture Technology Could Remove 1 Billion Tons Annually',
    category: 'science_climate',
    tags: ['climate', 'carbon capture', 'technology'],
  },

  // SCIENCE - SPACE (2)
  {
    id: 'sci_sp_1',
    headline: 'James Webb Telescope Discovers New Type of Galaxy Never Seen Before',
    category: 'science_space',
    tags: ['space', 'jwst', 'astronomy'],
  },
  {
    id: 'sci_sp_2',
    headline: 'SpaceX Announces Mars Mission Timeline: First Humans by 2030',
    category: 'science_space',
    tags: ['space', 'spacex', 'mars'],
  },

  // SCIENCE - HEALTH (2)
  {
    id: 'sci_h_1',
    headline: 'Breakthrough Cancer Treatment Shows 90% Response Rate in Trial',
    category: 'science_health',
    tags: ['cancer', 'medicine', 'treatment'],
  },
  {
    id: 'sci_h_2',
    headline: 'Scientists Reverse Aging in Mice, Human Trials Next',
    category: 'science_health',
    tags: ['aging', 'longevity', 'research'],
  },

  // LIFESTYLE - FITNESS (2)
  {
    id: 'life_f_1',
    headline: '10-Minute Daily Walk More Effective Than Gym Membership, Study Finds',
    category: 'lifestyle_fitness',
    tags: ['fitness', 'walking', 'health'],
  },
  {
    id: 'life_f_2',
    headline: 'CrossFit vs. Yoga: Which Burns More Calories? The Answer May Surprise You',
    category: 'lifestyle_fitness',
    tags: ['fitness', 'exercise', 'comparison'],
  },

  // LIFESTYLE - FOOD (2)
  {
    id: 'life_fd_1',
    headline: 'This TikTok Pasta Recipe Has Been Viewed 500 Million Times',
    category: 'lifestyle_food',
    tags: ['food', 'tiktok', 'recipe'],
  },
  {
    id: 'life_fd_2',
    headline: 'Michelin-Star Chef Reveals the One Ingredient That Changes Everything',
    category: 'lifestyle_food',
    tags: ['food', 'cooking', 'chef'],
  },

  // LIFESTYLE - TRAVEL (2)
  {
    id: 'life_t_1',
    headline: "The Hidden Beach That Instagram Hasn't Discovered Yet",
    category: 'lifestyle_travel',
    tags: ['travel', 'beach', 'hidden gem'],
  },
  {
    id: 'life_t_2',
    headline: 'Budget Airline Announces $49 Flights to Europe',
    category: 'lifestyle_travel',
    tags: ['travel', 'flights', 'budget'],
  },

  // FINANCE - CRYPTO (2)
  {
    id: 'fin_c_1',
    headline: 'Bitcoin Breaks $100,000 as Institutional Investors Pile In',
    category: 'finance_crypto',
    tags: ['bitcoin', 'crypto', 'investing'],
  },
  {
    id: 'fin_c_2',
    headline: 'New Meme Coin Up 10,000% in 24 Hours: What You Need to Know',
    category: 'finance_crypto',
    tags: ['crypto', 'meme coin', 'trading'],
  },

  // FINANCE - TRADITIONAL (2)
  {
    id: 'fin_t_1',
    headline: "Warren Buffett's Latest Investment Move Surprises Wall Street",
    category: 'finance_traditional',
    tags: ['investing', 'buffett', 'stocks'],
  },
  {
    id: 'fin_t_2',
    headline: 'Simple Trick to Max Out Your 401(k) That Most People Miss',
    category: 'finance_traditional',
    tags: ['retirement', '401k', 'personal finance'],
  },

  // ANIMALS - CUTE (2)
  {
    id: 'ani_c_1',
    headline: 'Golden Retriever Becomes Best Friends with Baby Duck',
    category: 'animals_cute',
    tags: ['animals', 'cute', 'dog'],
  },
  {
    id: 'ani_c_2',
    headline: 'Rescue Cat Adopted After 500 Days in Shelter: See the Heartwarming Photos',
    category: 'animals_cute',
    tags: ['animals', 'cat', 'adoption'],
  },

  // ANIMALS - WILD (2)
  {
    id: 'ani_w_1',
    headline: 'Octopus Escapes Aquarium Tank Through Tiny Drain Pipe',
    category: 'animals_wild',
    tags: ['animals', 'octopus', 'escape'],
  },
  {
    id: 'ani_w_2',
    headline: 'Scientists Discover New Species of Deep Sea Fish with Transparent Head',
    category: 'animals_wild',
    tags: ['animals', 'discovery', 'ocean'],
  },
];

// Get all content IDs
export function getAllContentIds(): string[] {
  return contentPool.map((item) => item.id);
}

// Shuffle array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Category groups for ensuring diversity
const categoryGroups: Record<string, string[]> = {
  politics: ['politics_left', 'politics_right', 'politics_center'],
  tech: ['tech_optimist', 'tech_pessimist'],
  entertainment: ['entertainment_celebrity', 'entertainment_movies', 'entertainment_gaming'],
  science: ['science_climate', 'science_space', 'science_health'],
  sports: ['sports_mainstream', 'sports_niche'],
  lifestyle: ['lifestyle_fitness', 'lifestyle_food', 'lifestyle_travel'],
  finance: ['finance_crypto', 'finance_traditional'],
  animals: ['animals_cute', 'animals_wild'],
};

// Ensure diverse start - first N cards have variety
function ensureDiverseStart(items: ContentItem[], firstN: number): ContentItem[] {
  const result: ContentItem[] = [];
  const remaining = [...items];
  const usedGroups = new Set<string>();

  // First, pick one from each major category group
  for (const [group, categories] of Object.entries(categoryGroups)) {
    if (result.length >= firstN) break;

    const index = remaining.findIndex((item) =>
      categories.includes(item.category) && !usedGroups.has(group)
    );

    if (index !== -1) {
      result.push(remaining[index]);
      remaining.splice(index, 1);
      usedGroups.add(group);
    }
  }

  // Fill remaining slots with shuffled items
  const shuffledRemaining = shuffleArray(remaining);
  while (result.length < firstN && shuffledRemaining.length > 0) {
    result.push(shuffledRemaining.shift()!);
  }

  // Shuffle the first N to avoid predictable order
  const diverseStart = shuffleArray(result);

  // Add the rest
  return [...diverseStart, ...shuffledRemaining];
}

// Generate content queue for a participant
export function generateContentQueue(count: number = 40): ContentItem[] {
  const shuffled = shuffleArray([...contentPool]);
  const diverse = ensureDiverseStart(shuffled, 10);
  return diverse.slice(0, count);
}

// Get category color for visualization
export function getCategoryColor(category: string): string {
  const prefix = category.split('_')[0];
  const colorMap: Record<string, string> = {
    politics: '#EF4444',
    tech: '#6366F1',
    entertainment: '#EC4899',
    science: '#22C55E',
    sports: '#F59E0B',
    lifestyle: '#14B8A6',
    finance: '#8B5CF6',
    animals: '#F97316',
  };
  return colorMap[prefix] || '#6366F1';
}

// Get category group from category
export function getCategoryGroup(category: string): string {
  return category.split('_')[0];
}
