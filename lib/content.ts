import { ContentItem, ContentCategory } from '@/types';

export const contentPool: ContentItem[] = [
  // POLITICS - LEFT (8)
  { id: 'pol_l_1', headline: 'Study Shows Universal Basic Income Reduces Poverty Without Reducing Employment', category: 'politics_left', tags: ['economics', 'ubi'] },
  { id: 'pol_l_2', headline: 'Climate Activists Demand Immediate Ban on New Fossil Fuel Projects', category: 'politics_left', tags: ['climate', 'activism'] },
  { id: 'pol_l_3', headline: 'Healthcare Workers Union Wins Historic Contract with Major Hospital Chain', category: 'politics_left', tags: ['labor', 'healthcare'] },
  { id: 'pol_l_4', headline: 'New Report: Wealth Gap Reaches Historic Levels, Calls for Tax Reform', category: 'politics_left', tags: ['inequality', 'taxes'] },
  { id: 'pol_l_5', headline: 'Progressive Candidate Wins Upset Victory in Key District', category: 'politics_left', tags: ['elections', 'progressive'] },
  { id: 'pol_l_6', headline: 'Study Links Corporate Lobbying to Weakened Environmental Regulations', category: 'politics_left', tags: ['corruption', 'environment'] },
  { id: 'pol_l_7', headline: 'Workers Rights Advocates Push for 4-Day Work Week Legislation', category: 'politics_left', tags: ['labor', 'work'] },
  { id: 'pol_l_8', headline: 'Free College Program Shows Promising Results in First Year', category: 'politics_left', tags: ['education', 'policy'] },

  // POLITICS - RIGHT (8)
  { id: 'pol_r_1', headline: 'Small Business Owners Say New Regulations Are Killing Main Street', category: 'politics_right', tags: ['business', 'regulation'] },
  { id: 'pol_r_2', headline: 'Parents Group Demands More Control Over School Curriculum', category: 'politics_right', tags: ['education', 'parental rights'] },
  { id: 'pol_r_3', headline: 'Border Security Officials Report Record Crossings This Month', category: 'politics_right', tags: ['immigration', 'border'] },
  { id: 'pol_r_4', headline: 'Tax Cuts Lead to Record Small Business Growth, Study Shows', category: 'politics_right', tags: ['taxes', 'economy'] },
  { id: 'pol_r_5', headline: 'Second Amendment Groups Celebrate Court Victory on Gun Rights', category: 'politics_right', tags: ['guns', 'rights'] },
  { id: 'pol_r_6', headline: 'Energy Independence: New Drilling Projects Create Thousands of Jobs', category: 'politics_right', tags: ['energy', 'jobs'] },
  { id: 'pol_r_7', headline: 'Religious Liberty Bill Passes After Years of Debate', category: 'politics_right', tags: ['religion', 'freedom'] },
  { id: 'pol_r_8', headline: 'Veterans Group Praises Increased Military Spending Bill', category: 'politics_right', tags: ['military', 'veterans'] },

  // POLITICS - CENTER (4)
  { id: 'pol_c_1', headline: 'Bipartisan Infrastructure Bill Passes with Rare Cross-Party Support', category: 'politics_center', tags: ['infrastructure', 'bipartisan'] },
  { id: 'pol_c_2', headline: 'New Poll Shows Americans Want Compromise on Major Issues', category: 'politics_center', tags: ['polling', 'compromise'] },
  { id: 'pol_c_3', headline: 'Moderate Lawmakers Form New Caucus to Bridge Political Divide', category: 'politics_center', tags: ['congress', 'unity'] },
  { id: 'pol_c_4', headline: 'Both Parties Agree: Social Media Needs Better Regulation', category: 'politics_center', tags: ['tech', 'regulation'] },

  // TECH - OPTIMIST (8)
  { id: 'tech_o_1', headline: 'AI System Discovers New Antibiotic That Kills Drug-Resistant Bacteria', category: 'tech_optimist', tags: ['ai', 'medicine'] },
  { id: 'tech_o_2', headline: 'Solar Power Now Cheaper Than Coal in Most Countries', category: 'tech_optimist', tags: ['solar', 'energy'] },
  { id: 'tech_o_3', headline: 'New Brain-Computer Interface Helps Paralyzed Patient Walk Again', category: 'tech_optimist', tags: ['neurotech', 'medicine'] },
  { id: 'tech_o_4', headline: 'Quantum Computer Solves Problem That Would Take Classical Computers 10,000 Years', category: 'tech_optimist', tags: ['quantum', 'computing'] },
  { id: 'tech_o_5', headline: 'Self-Driving Cars Reduce Traffic Deaths by 90% in Pilot City', category: 'tech_optimist', tags: ['autonomous', 'safety'] },
  { id: 'tech_o_6', headline: 'New Battery Technology Could Give EVs 1000-Mile Range', category: 'tech_optimist', tags: ['ev', 'battery'] },
  { id: 'tech_o_7', headline: 'AI Tutors Help Students Improve Test Scores by 40%', category: 'tech_optimist', tags: ['ai', 'education'] },
  { id: 'tech_o_8', headline: 'Gene Therapy Cures Inherited Blindness in Clinical Trial', category: 'tech_optimist', tags: ['genetics', 'medicine'] },

  // TECH - PESSIMIST (8)
  { id: 'tech_p_1', headline: 'AI Experts Warn: We Have 10 Years to Solve Alignment Problem', category: 'tech_pessimist', tags: ['ai', 'safety'] },
  { id: 'tech_p_2', headline: 'Report: Social Media Algorithms Linked to Rising Teen Depression', category: 'tech_pessimist', tags: ['social media', 'mental health'] },
  { id: 'tech_p_3', headline: 'Deepfakes Now Indistinguishable from Real Video, Researchers Warn', category: 'tech_pessimist', tags: ['deepfakes', 'misinformation'] },
  { id: 'tech_p_4', headline: 'Study: Automation Could Eliminate 40% of Jobs in Next Decade', category: 'tech_pessimist', tags: ['automation', 'jobs'] },
  { id: 'tech_p_5', headline: 'Major Data Breach Exposes 500 Million Users Personal Information', category: 'tech_pessimist', tags: ['privacy', 'security'] },
  { id: 'tech_p_6', headline: 'Tech Giants Face Antitrust Action Over Monopoly Concerns', category: 'tech_pessimist', tags: ['monopoly', 'regulation'] },
  { id: 'tech_p_7', headline: 'Smartphone Addiction Now Classified as Mental Health Disorder', category: 'tech_pessimist', tags: ['addiction', 'phones'] },
  { id: 'tech_p_8', headline: 'AI-Generated Fake News Floods Social Media Before Election', category: 'tech_pessimist', tags: ['ai', 'misinformation'] },

  // ENTERTAINMENT - CELEBRITY (6)
  { id: 'ent_c_1', headline: 'Pop Star Reveals Shocking Secret in Tell-All Interview', category: 'entertainment_celebrity', tags: ['celebrity', 'gossip'] },
  { id: 'ent_c_2', headline: 'Famous Couple Announces Split After 12 Years of Marriage', category: 'entertainment_celebrity', tags: ['celebrity', 'relationship'] },
  { id: 'ent_c_3', headline: 'A-List Actor Opens Up About Struggle with Anxiety', category: 'entertainment_celebrity', tags: ['celebrity', 'mental health'] },
  { id: 'ent_c_4', headline: 'Billionaire CEO Dating Rumors Spark Internet Frenzy', category: 'entertainment_celebrity', tags: ['celebrity', 'tech'] },
  { id: 'ent_c_5', headline: 'Singer Announces Surprise World Tour After 5-Year Hiatus', category: 'entertainment_celebrity', tags: ['music', 'tour'] },
  { id: 'ent_c_6', headline: 'Reality TV Star Launches New Fashion Line to Mixed Reviews', category: 'entertainment_celebrity', tags: ['fashion', 'tv'] },

  // ENTERTAINMENT - MOVIES (6)
  { id: 'ent_m_1', headline: 'Marvel Announces Surprising New Direction for Next Phase', category: 'entertainment_movies', tags: ['marvel', 'movies'] },
  { id: 'ent_m_2', headline: 'Indie Film Wins Top Prize at Sundance, Studios in Bidding War', category: 'entertainment_movies', tags: ['sundance', 'indie'] },
  { id: 'ent_m_3', headline: 'Beloved 90s Franchise Getting Reboot with Original Cast', category: 'entertainment_movies', tags: ['reboot', 'nostalgia'] },
  { id: 'ent_m_4', headline: 'Director Reveals Alternate Ending That Was Too Dark for Theaters', category: 'entertainment_movies', tags: ['movies', 'behind scenes'] },
  { id: 'ent_m_5', headline: 'Oscar Predictions: Critics Say This Years Race Is Wide Open', category: 'entertainment_movies', tags: ['oscars', 'awards'] },
  { id: 'ent_m_6', headline: 'Streaming Service Drops Entire Season of Hit Show Early', category: 'entertainment_movies', tags: ['streaming', 'tv'] },

  // ENTERTAINMENT - GAMING (6)
  { id: 'ent_g_1', headline: 'GTA 6 Trailer Breaks All-Time YouTube Record in 24 Hours', category: 'entertainment_gaming', tags: ['gaming', 'gta'] },
  { id: 'ent_g_2', headline: 'Professional Esports Players Have Reflexes of Fighter Pilots', category: 'entertainment_gaming', tags: ['esports', 'science'] },
  { id: 'ent_g_3', headline: 'Nintendo Announces Surprise New Console for Holiday Season', category: 'entertainment_gaming', tags: ['nintendo', 'console'] },
  { id: 'ent_g_4', headline: 'Indie Game Made by One Person Sells 10 Million Copies', category: 'entertainment_gaming', tags: ['indie', 'success'] },
  { id: 'ent_g_5', headline: 'VR Gaming Finally Goes Mainstream with New Affordable Headset', category: 'entertainment_gaming', tags: ['vr', 'gaming'] },
  { id: 'ent_g_6', headline: 'Classic RPG Series Returns After 15 Years to Critical Acclaim', category: 'entertainment_gaming', tags: ['rpg', 'nostalgia'] },

  // SPORTS - MAINSTREAM (6)
  { id: 'spt_m_1', headline: 'NBA Star Signs Record-Breaking $300 Million Contract Extension', category: 'sports_mainstream', tags: ['nba', 'contract'] },
  { id: 'spt_m_2', headline: 'World Cup Final Draws 1.5 Billion Viewers Worldwide', category: 'sports_mainstream', tags: ['soccer', 'world cup'] },
  { id: 'spt_m_3', headline: 'Underdog Team Wins Championship in Stunning Upset', category: 'sports_mainstream', tags: ['football', 'upset'] },
  { id: 'spt_m_4', headline: 'Tennis Legend Announces Retirement After 20-Year Career', category: 'sports_mainstream', tags: ['tennis', 'retirement'] },
  { id: 'spt_m_5', headline: 'Olympic Athlete Breaks 30-Year-Old World Record', category: 'sports_mainstream', tags: ['olympics', 'record'] },
  { id: 'spt_m_6', headline: 'Major League Expands to New Cities in Historic Move', category: 'sports_mainstream', tags: ['expansion', 'baseball'] },

  // SPORTS - NICHE (6)
  { id: 'spt_n_1', headline: 'Underwater Hockey World Championship Draws Surprising Crowds', category: 'sports_niche', tags: ['underwater hockey', 'niche'] },
  { id: 'spt_n_2', headline: 'Competitive Rock Paper Scissors League Announces $100K Prize', category: 'sports_niche', tags: ['weird sports', 'competition'] },
  { id: 'spt_n_3', headline: 'Professional Drone Racing Becomes Fastest-Growing Sport', category: 'sports_niche', tags: ['drones', 'racing'] },
  { id: 'spt_n_4', headline: 'Extreme Ironing Championship Held on Mountain Peak', category: 'sports_niche', tags: ['extreme', 'weird'] },
  { id: 'spt_n_5', headline: 'Competitive Eating Record Shattered at Annual Hot Dog Contest', category: 'sports_niche', tags: ['eating', 'contest'] },
  { id: 'spt_n_6', headline: 'Chess Boxing Gains Popularity as Ultimate Mind-Body Sport', category: 'sports_niche', tags: ['chess', 'boxing'] },

  // SCIENCE - CLIMATE (6)
  { id: 'sci_cl_1', headline: 'Arctic Ice Loss Accelerating Faster Than Any Model Predicted', category: 'science_climate', tags: ['climate', 'arctic'] },
  { id: 'sci_cl_2', headline: 'New Carbon Capture Technology Could Remove 1 Billion Tons Annually', category: 'science_climate', tags: ['climate', 'carbon'] },
  { id: 'sci_cl_3', headline: 'Ocean Temperatures Hit Record High for Third Straight Year', category: 'science_climate', tags: ['ocean', 'warming'] },
  { id: 'sci_cl_4', headline: 'Scientists Discover New Method to Turn CO2 Into Solid Rock', category: 'science_climate', tags: ['carbon', 'innovation'] },
  { id: 'sci_cl_5', headline: 'Coral Reef Shows Signs of Recovery After Conservation Efforts', category: 'science_climate', tags: ['coral', 'conservation'] },
  { id: 'sci_cl_6', headline: 'City Plants Million Trees to Combat Urban Heat Island Effect', category: 'science_climate', tags: ['urban', 'trees'] },

  // SCIENCE - SPACE (6)
  { id: 'sci_sp_1', headline: 'James Webb Telescope Discovers New Type of Galaxy Never Seen Before', category: 'science_space', tags: ['jwst', 'astronomy'] },
  { id: 'sci_sp_2', headline: 'SpaceX Announces Mars Mission Timeline: First Humans by 2030', category: 'science_space', tags: ['spacex', 'mars'] },
  { id: 'sci_sp_3', headline: 'Scientists Detect Signal That Could Be Signs of Alien Technology', category: 'science_space', tags: ['aliens', 'seti'] },
  { id: 'sci_sp_4', headline: 'NASA Confirms Water Ice at Lunar South Pole Location', category: 'science_space', tags: ['moon', 'water'] },
  { id: 'sci_sp_5', headline: 'Asteroid Mining Company Successfully Extracts First Samples', category: 'science_space', tags: ['asteroid', 'mining'] },
  { id: 'sci_sp_6', headline: 'New Propulsion System Could Cut Mars Travel Time in Half', category: 'science_space', tags: ['propulsion', 'mars'] },

  // SCIENCE - HEALTH (6)
  { id: 'sci_h_1', headline: 'Breakthrough Cancer Treatment Shows 90% Response Rate in Trial', category: 'science_health', tags: ['cancer', 'treatment'] },
  { id: 'sci_h_2', headline: 'Scientists Reverse Aging in Mice, Human Trials Next', category: 'science_health', tags: ['aging', 'longevity'] },
  { id: 'sci_h_3', headline: 'New Alzheimers Drug Shows Promise in Slowing Disease', category: 'science_health', tags: ['alzheimers', 'brain'] },
  { id: 'sci_h_4', headline: 'Sleep Study Reveals Surprising Benefits of Afternoon Naps', category: 'science_health', tags: ['sleep', 'health'] },
  { id: 'sci_h_5', headline: 'Universal Flu Vaccine Could Be Available Within 5 Years', category: 'science_health', tags: ['vaccine', 'flu'] },
  { id: 'sci_h_6', headline: 'Gut Bacteria Found to Influence Mental Health More Than Expected', category: 'science_health', tags: ['gut', 'mental health'] },

  // LIFESTYLE - FITNESS (6)
  { id: 'life_f_1', headline: '10-Minute Daily Walk More Effective Than Gym, Study Finds', category: 'lifestyle_fitness', tags: ['walking', 'health'] },
  { id: 'life_f_2', headline: 'CrossFit vs. Yoga: Which Burns More Calories? The Answer Surprises', category: 'lifestyle_fitness', tags: ['crossfit', 'yoga'] },
  { id: 'life_f_3', headline: 'New Fitness Trend Takes Social Media by Storm', category: 'lifestyle_fitness', tags: ['trend', 'viral'] },
  { id: 'life_f_4', headline: 'Study: Morning Workouts Boost Productivity by 30%', category: 'lifestyle_fitness', tags: ['morning', 'productivity'] },
  { id: 'life_f_5', headline: 'Olympic Athlete Shares Simple Home Workout Routine', category: 'lifestyle_fitness', tags: ['home', 'workout'] },
  { id: 'life_f_6', headline: 'Cold Plunge Benefits: Trend or Science-Backed Therapy?', category: 'lifestyle_fitness', tags: ['cold', 'recovery'] },

  // LIFESTYLE - FOOD (6)
  { id: 'life_fd_1', headline: 'TikTok Pasta Recipe Has Been Viewed 500 Million Times', category: 'lifestyle_food', tags: ['tiktok', 'recipe'] },
  { id: 'life_fd_2', headline: 'Michelin Chef Reveals the One Ingredient That Changes Everything', category: 'lifestyle_food', tags: ['chef', 'cooking'] },
  { id: 'life_fd_3', headline: 'Lab-Grown Meat Finally Tastes as Good as the Real Thing', category: 'lifestyle_food', tags: ['lab meat', 'future'] },
  { id: 'life_fd_4', headline: 'Ancient Grain Makes Comeback as Superfood of the Year', category: 'lifestyle_food', tags: ['superfood', 'grain'] },
  { id: 'life_fd_5', headline: 'Coffee Study: 4 Cups a Day Linked to Longer Life', category: 'lifestyle_food', tags: ['coffee', 'health'] },
  { id: 'life_fd_6', headline: 'The $1000 Dinner Experience Everyone Is Talking About', category: 'lifestyle_food', tags: ['luxury', 'dining'] },

  // LIFESTYLE - TRAVEL (6)
  { id: 'life_t_1', headline: 'The Hidden Beach That Instagram Hasnt Discovered Yet', category: 'lifestyle_travel', tags: ['beach', 'hidden'] },
  { id: 'life_t_2', headline: 'Budget Airline Announces $49 Flights to Europe', category: 'lifestyle_travel', tags: ['budget', 'flights'] },
  { id: 'life_t_3', headline: 'Digital Nomad Visa: Countries That Want You to Work Remotely', category: 'lifestyle_travel', tags: ['nomad', 'remote'] },
  { id: 'life_t_4', headline: 'Overtourism Crisis: Famous Destination Limits Visitors', category: 'lifestyle_travel', tags: ['overtourism', 'limits'] },
  { id: 'life_t_5', headline: 'Solo Travel Surge: Why More People Are Exploring Alone', category: 'lifestyle_travel', tags: ['solo', 'trend'] },
  { id: 'life_t_6', headline: 'Train Travel Renaissance: Luxury Rails Making a Comeback', category: 'lifestyle_travel', tags: ['train', 'luxury'] },

  // FINANCE - CRYPTO (6)
  { id: 'fin_c_1', headline: 'Bitcoin Breaks $100,000 as Institutional Investors Pile In', category: 'finance_crypto', tags: ['bitcoin', 'investing'] },
  { id: 'fin_c_2', headline: 'New Meme Coin Up 10,000% in 24 Hours: What to Know', category: 'finance_crypto', tags: ['meme coin', 'trading'] },
  { id: 'fin_c_3', headline: 'Major Bank Launches Cryptocurrency Trading for All Customers', category: 'finance_crypto', tags: ['bank', 'adoption'] },
  { id: 'fin_c_4', headline: 'NFT Market Shows Signs of Recovery After Year-Long Slump', category: 'finance_crypto', tags: ['nft', 'market'] },
  { id: 'fin_c_5', headline: 'Country Becomes First to Make Bitcoin Legal Tender', category: 'finance_crypto', tags: ['bitcoin', 'legal'] },
  { id: 'fin_c_6', headline: 'DeFi Protocol Hacked: $200 Million in Crypto Stolen', category: 'finance_crypto', tags: ['defi', 'hack'] },

  // FINANCE - TRADITIONAL (6)
  { id: 'fin_t_1', headline: 'Warren Buffetts Latest Investment Move Surprises Wall Street', category: 'finance_traditional', tags: ['buffett', 'investing'] },
  { id: 'fin_t_2', headline: 'Simple Trick to Max Out Your 401(k) That Most People Miss', category: 'finance_traditional', tags: ['retirement', '401k'] },
  { id: 'fin_t_3', headline: 'Housing Market Forecast: What Experts Predict for Next Year', category: 'finance_traditional', tags: ['housing', 'forecast'] },
  { id: 'fin_t_4', headline: 'Fed Announces Interest Rate Decision: What It Means for You', category: 'finance_traditional', tags: ['fed', 'rates'] },
  { id: 'fin_t_5', headline: 'Stock Market Hits All-Time High Despite Economic Concerns', category: 'finance_traditional', tags: ['stocks', 'market'] },
  { id: 'fin_t_6', headline: 'Side Hustle Economy: Americans Average $1,000 Extra Monthly', category: 'finance_traditional', tags: ['side hustle', 'income'] },

  // ANIMALS - CUTE (6)
  { id: 'ani_c_1', headline: 'Golden Retriever Becomes Best Friends with Baby Duck', category: 'animals_cute', tags: ['dog', 'duck'] },
  { id: 'ani_c_2', headline: 'Rescue Cat Adopted After 500 Days: Heartwarming Photos', category: 'animals_cute', tags: ['cat', 'adoption'] },
  { id: 'ani_c_3', headline: 'Unlikely Animal Friendship: Bear and Wolf Spotted Together', category: 'animals_cute', tags: ['bear', 'wolf'] },
  { id: 'ani_c_4', headline: 'Puppy Born with Heart-Shaped Marking Goes Viral', category: 'animals_cute', tags: ['puppy', 'viral'] },
  { id: 'ani_c_5', headline: 'Zoo Celebrates Birth of Endangered Baby Panda', category: 'animals_cute', tags: ['panda', 'zoo'] },
  { id: 'ani_c_6', headline: 'Dog Waits at Train Station for Owner Every Day for 10 Years', category: 'animals_cute', tags: ['loyalty', 'dog'] },

  // ANIMALS - WILD (6)
  { id: 'ani_w_1', headline: 'Octopus Escapes Aquarium Tank Through Tiny Drain Pipe', category: 'animals_wild', tags: ['octopus', 'escape'] },
  { id: 'ani_w_2', headline: 'Scientists Discover Deep Sea Fish with Transparent Head', category: 'animals_wild', tags: ['fish', 'discovery'] },
  { id: 'ani_w_3', headline: 'Great White Shark Tracked Swimming Across Entire Ocean', category: 'animals_wild', tags: ['shark', 'migration'] },
  { id: 'ani_w_4', headline: 'New Species of Dinosaur Discovered in Unexpected Location', category: 'animals_wild', tags: ['dinosaur', 'discovery'] },
  { id: 'ani_w_5', headline: 'Wolves Return to Region After 100-Year Absence', category: 'animals_wild', tags: ['wolves', 'conservation'] },
  { id: 'ani_w_6', headline: 'Crow Solves Complex Puzzle That Stumped Researchers', category: 'animals_wild', tags: ['crow', 'intelligence'] },
];

// Get category group from full category name
export function getCategoryGroup(category: ContentCategory): string {
  return category.split('_')[0];
}

// Get color for a category
export function getCategoryColor(categoryGroup: string): string {
  const colors: Record<string, string> = {
    politics: '#FF0055',
    tech: '#00F0FF',
    entertainment: '#FF00E5',
    science: '#39FF14',
    sports: '#FF6B00',
    lifestyle: '#BF00FF',
    finance: '#FFE500',
    animals: '#FF8800',
  };
  return colors[categoryGroup] || '#00F0FF';
}

// Shuffle array using Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate content queue for a participant
export function generateContentQueue(count: number = 40): ContentItem[] {
  const shuffled = shuffleArray(contentPool);

  // Ensure diversity in first 10 cards
  const categoryGroups = ['politics', 'tech', 'entertainment', 'science', 'sports', 'lifestyle', 'finance', 'animals'];
  const diverseStart: ContentItem[] = [];
  const remaining = [...shuffled];

  // Pick one from each category for diverse start
  for (const group of categoryGroups) {
    const index = remaining.findIndex(item => getCategoryGroup(item.category) === group);
    if (index !== -1) {
      diverseStart.push(remaining[index]);
      remaining.splice(index, 1);
    }
  }

  // Add remaining shuffled items
  const finalQueue = [...shuffleArray(diverseStart), ...shuffleArray(remaining)];

  return finalQueue.slice(0, count);
}
