import { ContentItem, ContentCategory } from '@/types';

export const contentPool: ContentItem[] = [
  // ═══════════════════════════════════════════════════════════════
  // POLITICS - LEFT (~30)
  // ═══════════════════════════════════════════════════════════════
  { id: 'pl01', headline: 'Study Shows Universal Basic Income Reduces Poverty Without Reducing Employment', category: 'politics_left', tags: ['economics', 'ubi'] },
  { id: 'pl02', headline: 'Climate Activists Demand Immediate Ban on New Fossil Fuel Projects', category: 'politics_left', tags: ['climate', 'activism'] },
  { id: 'pl03', headline: 'Healthcare Workers Union Wins Historic Contract with Major Hospital Chain', category: 'politics_left', tags: ['labor', 'healthcare'] },
  { id: 'pl04', headline: 'New Report: Wealth Gap Reaches Historic Levels, Calls for Tax Reform', category: 'politics_left', tags: ['inequality', 'taxes'] },
  { id: 'pl05', headline: 'Progressive Candidate Wins Upset Victory in Key District', category: 'politics_left', tags: ['elections', 'progressive'] },
  { id: 'pl06', headline: 'Study Links Corporate Lobbying to Weakened Environmental Regulations', category: 'politics_left', tags: ['corruption', 'environment'] },
  { id: 'pl07', headline: 'Workers Rights Advocates Push for 4-Day Work Week Legislation', category: 'politics_left', tags: ['labor', 'work'] },
  { id: 'pl08', headline: 'Free College Program Shows Promising Results in First Year', category: 'politics_left', tags: ['education', 'policy'] },
  { id: 'pl09', headline: 'Minimum Wage Increase Boosts Local Economies, New Data Shows', category: 'politics_left', tags: ['wages', 'economy'] },
  { id: 'pl10', headline: 'Rent Control Saves Thousands of Families from Displacement, Study Finds', category: 'politics_left', tags: ['housing', 'policy'] },
  { id: 'pl11', headline: 'Billionaire Tax Would Fund Universal Childcare for Every Family', category: 'politics_left', tags: ['taxes', 'childcare'] },
  { id: 'pl12', headline: 'Medicare Expansion Cuts Emergency Room Visits by 40% in Pilot States', category: 'politics_left', tags: ['healthcare', 'policy'] },
  { id: 'pl13', headline: 'Defunding Police and Investing in Social Workers: One Citys Success Story', category: 'politics_left', tags: ['police reform', 'social'] },
  { id: 'pl14', headline: 'Green New Deal Could Create 10 Million Jobs, Report Says', category: 'politics_left', tags: ['climate', 'jobs'] },
  { id: 'pl15', headline: 'Student Debt Cancellation Would Boost GDP by $1 Trillion', category: 'politics_left', tags: ['education', 'debt'] },
  { id: 'pl16', headline: 'Indigenous Communities Win Landmark Victory Against Pipeline Construction', category: 'politics_left', tags: ['indigenous', 'environment'] },
  { id: 'pl17', headline: 'Co-Op Model Proves Worker-Owned Businesses Outperform Traditional Ones', category: 'politics_left', tags: ['labor', 'business'] },
  { id: 'pl18', headline: 'Paid Family Leave Countries Have Happier, Healthier Children', category: 'politics_left', tags: ['family', 'policy'] },
  { id: 'pl19', headline: 'Corporate Greed Is the Real Cause of Inflation, Economists Argue', category: 'politics_left', tags: ['economy', 'corporate'] },
  { id: 'pl20', headline: 'Universal Pre-K Program Closes Achievement Gap in Major City', category: 'politics_left', tags: ['education', 'equality'] },
  { id: 'pl21', headline: 'Fossil Fuel Subsidies Cost Taxpayers $20 Billion Annually', category: 'politics_left', tags: ['energy', 'subsidies'] },
  { id: 'pl22', headline: 'Gender Pay Gap Costs Women $400,000 Over Their Careers', category: 'politics_left', tags: ['equality', 'wages'] },
  { id: 'pl23', headline: 'Public Housing Renaissance: How Vienna Does It Right', category: 'politics_left', tags: ['housing', 'international'] },
  { id: 'pl24', headline: 'Community Land Trusts Offer Alternative to Housing Crisis', category: 'politics_left', tags: ['housing', 'community'] },
  { id: 'pl25', headline: 'Labor Unions See Biggest Membership Surge in Decades', category: 'politics_left', tags: ['labor', 'unions'] },
  { id: 'pl26', headline: 'Wealth Tax in Norway Drives Down Inequality Without Hurting Growth', category: 'politics_left', tags: ['taxes', 'international'] },
  { id: 'pl27', headline: 'Free School Lunch Program Improves Test Scores Across the Board', category: 'politics_left', tags: ['education', 'nutrition'] },
  { id: 'pl28', headline: 'Pharmaceutical Companies Exposed for Price Gouging Life-Saving Drugs', category: 'politics_left', tags: ['healthcare', 'corporate'] },
  { id: 'pl29', headline: 'Immigrant Communities Contribute $2 Trillion to Economy, Study Shows', category: 'politics_left', tags: ['immigration', 'economy'] },
  { id: 'pl30', headline: 'Ranked Choice Voting Gives Third Parties a Fighting Chance', category: 'politics_left', tags: ['elections', 'reform'] },

  // ═══════════════════════════════════════════════════════════════
  // POLITICS - RIGHT (~30)
  // ═══════════════════════════════════════════════════════════════
  { id: 'pr01', headline: 'Small Business Owners Say New Regulations Are Killing Main Street', category: 'politics_right', tags: ['business', 'regulation'] },
  { id: 'pr02', headline: 'Parents Group Demands More Control Over School Curriculum', category: 'politics_right', tags: ['education', 'parental rights'] },
  { id: 'pr03', headline: 'Border Security Officials Report Record Crossings This Month', category: 'politics_right', tags: ['immigration', 'border'] },
  { id: 'pr04', headline: 'Tax Cuts Lead to Record Small Business Growth, Study Shows', category: 'politics_right', tags: ['taxes', 'economy'] },
  { id: 'pr05', headline: 'Second Amendment Groups Celebrate Court Victory on Gun Rights', category: 'politics_right', tags: ['guns', 'rights'] },
  { id: 'pr06', headline: 'Energy Independence: New Drilling Projects Create Thousands of Jobs', category: 'politics_right', tags: ['energy', 'jobs'] },
  { id: 'pr07', headline: 'Religious Liberty Bill Passes After Years of Debate', category: 'politics_right', tags: ['religion', 'freedom'] },
  { id: 'pr08', headline: 'Veterans Group Praises Increased Military Spending Bill', category: 'politics_right', tags: ['military', 'veterans'] },
  { id: 'pr09', headline: 'Deregulation Sparks Manufacturing Boom in Midwest States', category: 'politics_right', tags: ['regulation', 'manufacturing'] },
  { id: 'pr10', headline: 'School Choice Programs Show Higher Graduation Rates', category: 'politics_right', tags: ['education', 'choice'] },
  { id: 'pr11', headline: 'Flat Tax Proposal Would Simplify Filing for 90% of Americans', category: 'politics_right', tags: ['taxes', 'reform'] },
  { id: 'pr12', headline: 'Tough-on-Crime Policies Lead to 30% Drop in Violent Crime', category: 'politics_right', tags: ['crime', 'law enforcement'] },
  { id: 'pr13', headline: 'Family Values Coalition Rallies Against New Social Studies Curriculum', category: 'politics_right', tags: ['education', 'values'] },
  { id: 'pr14', headline: 'Constitutional Carry Law Passes in Three More States', category: 'politics_right', tags: ['guns', 'rights'] },
  { id: 'pr15', headline: 'Farmers Praise Rollback of EPA Regulations on Land Use', category: 'politics_right', tags: ['agriculture', 'regulation'] },
  { id: 'pr16', headline: 'Military Families Say Troop Readiness Must Be Top Priority', category: 'politics_right', tags: ['military', 'defense'] },
  { id: 'pr17', headline: 'Small Town Revival: How Low Taxes Brought Businesses Back', category: 'politics_right', tags: ['taxes', 'rural'] },
  { id: 'pr18', headline: 'Parents Fight Back Against Social Media Companies Targeting Kids', category: 'politics_right', tags: ['parental rights', 'tech'] },
  { id: 'pr19', headline: 'National Debt Hits Record: Fiscal Conservatives Sound Alarm', category: 'politics_right', tags: ['spending', 'debt'] },
  { id: 'pr20', headline: 'Private Sector Outperforms Government in Every Metric, Report Shows', category: 'politics_right', tags: ['government', 'private sector'] },
  { id: 'pr21', headline: 'Home School Students Outperform Public School Peers on Standardized Tests', category: 'politics_right', tags: ['education', 'homeschool'] },
  { id: 'pr22', headline: 'Anti-Illegal Immigration Policies Boost Wages for Working Class', category: 'politics_right', tags: ['immigration', 'wages'] },
  { id: 'pr23', headline: 'Property Rights Victory: Court Blocks Government Land Seizure', category: 'politics_right', tags: ['property', 'rights'] },
  { id: 'pr24', headline: 'Free Market Healthcare Would Cut Costs by 40%, Economists Say', category: 'politics_right', tags: ['healthcare', 'free market'] },
  { id: 'pr25', headline: 'States Banning ESG Investing See Better Returns for Pensioners', category: 'politics_right', tags: ['finance', 'esg'] },
  { id: 'pr26', headline: 'Law Enforcement Officers Honored at Ceremony for Community Service', category: 'politics_right', tags: ['police', 'community'] },
  { id: 'pr27', headline: 'Church Attendance Rising Among Young Adults Seeking Community', category: 'politics_right', tags: ['religion', 'youth'] },
  { id: 'pr28', headline: 'Energy CEO: We Can Power America Without Foreign Dependence', category: 'politics_right', tags: ['energy', 'independence'] },
  { id: 'pr29', headline: 'Trade Schools See Record Enrollment as Alternative to College Debt', category: 'politics_right', tags: ['education', 'trades'] },
  { id: 'pr30', headline: 'Patriot Rally Draws Thousands in Support of Constitutional Rights', category: 'politics_right', tags: ['rights', 'rally'] },

  // ═══════════════════════════════════════════════════════════════
  // POLITICS - CENTER (~15)
  // ═══════════════════════════════════════════════════════════════
  { id: 'pc01', headline: 'Bipartisan Infrastructure Bill Passes with Rare Cross-Party Support', category: 'politics_center', tags: ['infrastructure', 'bipartisan'] },
  { id: 'pc02', headline: 'New Poll Shows Americans Want Compromise on Major Issues', category: 'politics_center', tags: ['polling', 'compromise'] },
  { id: 'pc03', headline: 'Moderate Lawmakers Form New Caucus to Bridge Political Divide', category: 'politics_center', tags: ['congress', 'unity'] },
  { id: 'pc04', headline: 'Both Parties Agree: Social Media Needs Better Regulation', category: 'politics_center', tags: ['tech', 'regulation'] },
  { id: 'pc05', headline: 'Problem Solvers Caucus Finds Common Ground on Immigration Reform', category: 'politics_center', tags: ['immigration', 'bipartisan'] },
  { id: 'pc06', headline: 'Americans Increasingly Identify as Independent Over Party', category: 'politics_center', tags: ['polling', 'independent'] },
  { id: 'pc07', headline: 'Cross-Party Bill Tackles Housing Crisis with Mixed Approach', category: 'politics_center', tags: ['housing', 'bipartisan'] },
  { id: 'pc08', headline: 'Local Governments Show Bipartisan Solutions Work Better', category: 'politics_center', tags: ['local', 'solutions'] },
  { id: 'pc09', headline: 'Majority of Voters Support Both Border Security AND Path to Citizenship', category: 'politics_center', tags: ['immigration', 'compromise'] },
  { id: 'pc10', headline: 'Veterans Affairs Reform Passes with Unanimous Senate Vote', category: 'politics_center', tags: ['veterans', 'bipartisan'] },
  { id: 'pc11', headline: 'New Study: Most Policy Solutions Work Better When Combining Left and Right Ideas', category: 'politics_center', tags: ['policy', 'compromise'] },
  { id: 'pc12', headline: 'Town Hall Experiment Brings Left and Right Voters Together Successfully', category: 'politics_center', tags: ['community', 'dialogue'] },
  { id: 'pc13', headline: 'Centrist Candidates Win Big in Swing District Elections', category: 'politics_center', tags: ['elections', 'moderate'] },
  { id: 'pc14', headline: 'Healthcare Compromise Includes Market Competition AND Safety Net', category: 'politics_center', tags: ['healthcare', 'compromise'] },
  { id: 'pc15', headline: 'Balanced Budget Amendment Gains Support from Both Sides', category: 'politics_center', tags: ['budget', 'bipartisan'] },

  // ═══════════════════════════════════════════════════════════════
  // TECH - OPTIMIST (~30)
  // ═══════════════════════════════════════════════════════════════
  { id: 'to01', headline: 'AI System Discovers New Antibiotic That Kills Drug-Resistant Bacteria', category: 'tech_optimist', tags: ['ai', 'medicine'] },
  { id: 'to02', headline: 'Solar Power Now Cheaper Than Coal in Most Countries', category: 'tech_optimist', tags: ['solar', 'energy'] },
  { id: 'to03', headline: 'New Brain-Computer Interface Helps Paralyzed Patient Walk Again', category: 'tech_optimist', tags: ['neurotech', 'medicine'] },
  { id: 'to04', headline: 'Quantum Computer Solves Problem That Would Take Classical Computers 10,000 Years', category: 'tech_optimist', tags: ['quantum', 'computing'] },
  { id: 'to05', headline: 'Self-Driving Cars Reduce Traffic Deaths by 90% in Pilot City', category: 'tech_optimist', tags: ['autonomous', 'safety'] },
  { id: 'to06', headline: 'New Battery Technology Could Give EVs 1000-Mile Range', category: 'tech_optimist', tags: ['ev', 'battery'] },
  { id: 'to07', headline: 'AI Tutors Help Students Improve Test Scores by 40%', category: 'tech_optimist', tags: ['ai', 'education'] },
  { id: 'to08', headline: 'Gene Therapy Cures Inherited Blindness in Clinical Trial', category: 'tech_optimist', tags: ['genetics', 'medicine'] },
  { id: 'to09', headline: 'Robot Surgeons Perform Flawless Operations with Zero Complications', category: 'tech_optimist', tags: ['robotics', 'medicine'] },
  { id: 'to10', headline: 'Fusion Reactor Achieves Net Energy Gain for First Time Ever', category: 'tech_optimist', tags: ['fusion', 'energy'] },
  { id: 'to11', headline: 'AI Translates Languages in Real-Time, Breaking Down Global Barriers', category: 'tech_optimist', tags: ['ai', 'language'] },
  { id: 'to12', headline: '3D-Printed Homes Built in 24 Hours for $10,000 Each', category: 'tech_optimist', tags: ['3dprinting', 'housing'] },
  { id: 'to13', headline: 'Lab-Grown Organs Could End Transplant Waiting Lists Forever', category: 'tech_optimist', tags: ['biotech', 'medicine'] },
  { id: 'to14', headline: 'New Desalination Tech Provides Clean Water for Pennies a Gallon', category: 'tech_optimist', tags: ['water', 'innovation'] },
  { id: 'to15', headline: 'Vertical Farms Produce 100x More Food Per Acre Than Traditional Fields', category: 'tech_optimist', tags: ['agriculture', 'innovation'] },
  { id: 'to16', headline: 'Wearable Device Detects Cancer 5 Years Before Symptoms Appear', category: 'tech_optimist', tags: ['wearables', 'health'] },
  { id: 'to17', headline: 'AI Compose Music That Moves Listeners to Tears', category: 'tech_optimist', tags: ['ai', 'creativity'] },
  { id: 'to18', headline: 'Autonomous Drones Deliver Medicine to Remote Villages', category: 'tech_optimist', tags: ['drones', 'healthcare'] },
  { id: 'to19', headline: 'Internet From Space: Satellite Network Connects Last Billion People', category: 'tech_optimist', tags: ['internet', 'space'] },
  { id: 'to20', headline: 'CRISPR Treatment Eliminates Sickle Cell Disease in Patients', category: 'tech_optimist', tags: ['genetics', 'cure'] },
  { id: 'to21', headline: 'AI-Powered Grid Reduces Energy Waste by 50% Across Entire City', category: 'tech_optimist', tags: ['ai', 'energy'] },
  { id: 'to22', headline: 'New Plastic-Eating Enzyme Could Clean Oceans in a Decade', category: 'tech_optimist', tags: ['biotech', 'environment'] },
  { id: 'to23', headline: 'Augmented Reality Glasses Replace Smartphones, Transform Daily Life', category: 'tech_optimist', tags: ['ar', 'devices'] },
  { id: 'to24', headline: 'Brain Implant Restores Memory in Alzheimers Patients', category: 'tech_optimist', tags: ['neurotech', 'memory'] },
  { id: 'to25', headline: 'Electric Aircraft Complete First Commercial Passenger Flight', category: 'tech_optimist', tags: ['aviation', 'electric'] },
  { id: 'to26', headline: 'AI Drug Discovery Cuts Development Time from 10 Years to 6 Months', category: 'tech_optimist', tags: ['ai', 'pharma'] },
  { id: 'to27', headline: 'Hyperloop Successfully Transports Passengers at 700mph', category: 'tech_optimist', tags: ['transport', 'innovation'] },
  { id: 'to28', headline: 'Smart Contact Lenses Monitor Blood Sugar Levels Continuously', category: 'tech_optimist', tags: ['wearables', 'diabetes'] },
  { id: 'to29', headline: 'Renewable Energy Powers Entire Country for 100 Consecutive Days', category: 'tech_optimist', tags: ['renewable', 'energy'] },
  { id: 'to30', headline: 'AI Personal Assistants Now Handle 80% of Admin Work Automatically', category: 'tech_optimist', tags: ['ai', 'productivity'] },

  // ═══════════════════════════════════════════════════════════════
  // TECH - PESSIMIST (~30)
  // ═══════════════════════════════════════════════════════════════
  { id: 'tp01', headline: 'AI Experts Warn: We Have 10 Years to Solve Alignment Problem', category: 'tech_pessimist', tags: ['ai', 'safety'] },
  { id: 'tp02', headline: 'Report: Social Media Algorithms Linked to Rising Teen Depression', category: 'tech_pessimist', tags: ['social media', 'mental health'] },
  { id: 'tp03', headline: 'Deepfakes Now Indistinguishable from Real Video, Researchers Warn', category: 'tech_pessimist', tags: ['deepfakes', 'misinformation'] },
  { id: 'tp04', headline: 'Study: Automation Could Eliminate 40% of Jobs in Next Decade', category: 'tech_pessimist', tags: ['automation', 'jobs'] },
  { id: 'tp05', headline: 'Major Data Breach Exposes 500 Million Users Personal Information', category: 'tech_pessimist', tags: ['privacy', 'security'] },
  { id: 'tp06', headline: 'Tech Giants Face Antitrust Action Over Monopoly Concerns', category: 'tech_pessimist', tags: ['monopoly', 'regulation'] },
  { id: 'tp07', headline: 'Smartphone Addiction Now Classified as Mental Health Disorder', category: 'tech_pessimist', tags: ['addiction', 'phones'] },
  { id: 'tp08', headline: 'AI-Generated Fake News Floods Social Media Before Election', category: 'tech_pessimist', tags: ['ai', 'misinformation'] },
  { id: 'tp09', headline: 'Facial Recognition Wrongly Identifies Thousands, Sparks Outrage', category: 'tech_pessimist', tags: ['surveillance', 'bias'] },
  { id: 'tp10', headline: 'Children Spending 8 Hours Daily on Screens: Doctors Sound Alarm', category: 'tech_pessimist', tags: ['screens', 'children'] },
  { id: 'tp11', headline: 'Self-Driving Car Kills Pedestrian, Raises Legal Questions', category: 'tech_pessimist', tags: ['autonomous', 'safety'] },
  { id: 'tp12', headline: 'AI Chatbot Gives Dangerous Medical Advice to Millions of Users', category: 'tech_pessimist', tags: ['ai', 'health'] },
  { id: 'tp13', headline: 'Smart Home Devices Record Private Conversations Without Consent', category: 'tech_pessimist', tags: ['privacy', 'iot'] },
  { id: 'tp14', headline: 'Ransomware Attack Shuts Down Hospital, Patients Lives at Risk', category: 'tech_pessimist', tags: ['cybercrime', 'healthcare'] },
  { id: 'tp15', headline: 'Algorithm Bias Denies Loans to Minorities at 3x Higher Rate', category: 'tech_pessimist', tags: ['bias', 'finance'] },
  { id: 'tp16', headline: 'Tech Workers Report Burnout Crisis as Industry Pushes 80-Hour Weeks', category: 'tech_pessimist', tags: ['labor', 'burnout'] },
  { id: 'tp17', headline: 'E-Waste Crisis: 50 Million Tons of Electronics Dumped Annually', category: 'tech_pessimist', tags: ['waste', 'environment'] },
  { id: 'tp18', headline: 'AI Voice Cloning Used in $25 Million Corporate Fraud Scheme', category: 'tech_pessimist', tags: ['ai', 'fraud'] },
  { id: 'tp19', headline: 'Social Media Platform Caught Selling User Data to Foreign Governments', category: 'tech_pessimist', tags: ['privacy', 'geopolitics'] },
  { id: 'tp20', headline: 'Robot Workers Replace Entire Factory Staff of 2,000 Overnight', category: 'tech_pessimist', tags: ['automation', 'jobs'] },
  { id: 'tp21', headline: 'Teens Who Quit Social Media Report Dramatic Improvement in Well-Being', category: 'tech_pessimist', tags: ['social media', 'mental health'] },
  { id: 'tp22', headline: 'AI-Powered Surveillance State: How China Monitors 1.4 Billion People', category: 'tech_pessimist', tags: ['surveillance', 'china'] },
  { id: 'tp23', headline: 'Crypto Mining Consumes More Energy Than Some Countries', category: 'tech_pessimist', tags: ['crypto', 'environment'] },
  { id: 'tp24', headline: 'Dating Apps Are Making People Lonelier, Psychologists Warn', category: 'tech_pessimist', tags: ['apps', 'loneliness'] },
  { id: 'tp25', headline: 'Kids Cant Hold Pencils Anymore Due to Tablet Overuse', category: 'tech_pessimist', tags: ['children', 'development'] },
  { id: 'tp26', headline: 'Autonomous Weapons: The AI Arms Race Nobody Is Talking About', category: 'tech_pessimist', tags: ['ai', 'military'] },
  { id: 'tp27', headline: 'Your Smart TV Is Watching You: Hidden Cameras Found in Millions of Sets', category: 'tech_pessimist', tags: ['privacy', 'surveillance'] },
  { id: 'tp28', headline: 'AI Art Generators Threaten to Eliminate Creative Jobs Entirely', category: 'tech_pessimist', tags: ['ai', 'creative'] },
  { id: 'tp29', headline: 'Brain Implant Hacked: Scientists Demonstrate Terrifying Vulnerability', category: 'tech_pessimist', tags: ['neurotech', 'security'] },
  { id: 'tp30', headline: 'Gig Economy Workers Earn Less Than Minimum Wage After Expenses', category: 'tech_pessimist', tags: ['gig', 'labor'] },

  // ═══════════════════════════════════════════════════════════════
  // ENTERTAINMENT - CELEBRITY (~25)
  // ═══════════════════════════════════════════════════════════════
  { id: 'ec01', headline: 'Pop Star Reveals Shocking Secret in Tell-All Interview', category: 'entertainment_celebrity', tags: ['celebrity', 'gossip'] },
  { id: 'ec02', headline: 'Famous Couple Announces Split After 12 Years of Marriage', category: 'entertainment_celebrity', tags: ['celebrity', 'relationship'] },
  { id: 'ec03', headline: 'A-List Actor Opens Up About Struggle with Anxiety', category: 'entertainment_celebrity', tags: ['celebrity', 'mental health'] },
  { id: 'ec04', headline: 'Billionaire CEO Dating Rumors Spark Internet Frenzy', category: 'entertainment_celebrity', tags: ['celebrity', 'tech'] },
  { id: 'ec05', headline: 'Singer Announces Surprise World Tour After 5-Year Hiatus', category: 'entertainment_celebrity', tags: ['music', 'tour'] },
  { id: 'ec06', headline: 'Reality TV Star Launches New Fashion Line to Mixed Reviews', category: 'entertainment_celebrity', tags: ['fashion', 'tv'] },
  { id: 'ec07', headline: 'Supermodel Claps Back at Body Shamers with Powerful Instagram Post', category: 'entertainment_celebrity', tags: ['model', 'social media'] },
  { id: 'ec08', headline: 'Rapper Buys Entire Neighborhood for His Childhood Friends', category: 'entertainment_celebrity', tags: ['rapper', 'generosity'] },
  { id: 'ec09', headline: 'Child Star Reveals Dark Side of Growing Up in Hollywood', category: 'entertainment_celebrity', tags: ['celebrity', 'memoir'] },
  { id: 'ec10', headline: 'Celebrity Chef Caught in Restaurant Scandal, Loses TV Deal', category: 'entertainment_celebrity', tags: ['chef', 'scandal'] },
  { id: 'ec11', headline: 'K-Pop Group Breaks Every Streaming Record in Music History', category: 'entertainment_celebrity', tags: ['kpop', 'records'] },
  { id: 'ec12', headline: 'Influencer Wedding Costs $10 Million, Sparks Debate on Wealth', category: 'entertainment_celebrity', tags: ['influencer', 'wealth'] },
  { id: 'ec13', headline: 'Actor Donates Entire Movie Salary to Childrens Hospital', category: 'entertainment_celebrity', tags: ['celebrity', 'charity'] },
  { id: 'ec14', headline: 'Former Disney Stars Toxic Relationship Drama Goes Viral', category: 'entertainment_celebrity', tags: ['disney', 'drama'] },
  { id: 'ec15', headline: 'Celebrity Couple Adopts Fifth Child, Documents Journey on YouTube', category: 'entertainment_celebrity', tags: ['celebrity', 'family'] },
  { id: 'ec16', headline: 'Music Mogul Accused of Exploiting Young Artists in New Documentary', category: 'entertainment_celebrity', tags: ['music', 'scandal'] },
  { id: 'ec17', headline: 'TikTok Star Lands Major Film Role with Zero Acting Experience', category: 'entertainment_celebrity', tags: ['tiktok', 'movies'] },
  { id: 'ec18', headline: 'Legendary Rock Band Reunites for One Final Concert', category: 'entertainment_celebrity', tags: ['music', 'reunion'] },
  { id: 'ec19', headline: 'Actress Feuds with Director on Set, Production Halted for Weeks', category: 'entertainment_celebrity', tags: ['hollywood', 'drama'] },
  { id: 'ec20', headline: 'Celebrity Fitness Guru Exposed for Promoting Dangerous Diet', category: 'entertainment_celebrity', tags: ['fitness', 'controversy'] },
  { id: 'ec21', headline: 'Fan Frenzy: Pop Star Spotted at Local Coffee Shop Causes Stampede', category: 'entertainment_celebrity', tags: ['fan', 'viral'] },
  { id: 'ec22', headline: 'Hollywood A-Lister Secretly Married for 3 Years, Nobody Knew', category: 'entertainment_celebrity', tags: ['celebrity', 'secret'] },
  { id: 'ec23', headline: 'Comedian Goes Viral for Roasting Tech Billionaires at Award Show', category: 'entertainment_celebrity', tags: ['comedy', 'viral'] },
  { id: 'ec24', headline: 'Model Agency Scandal: Industry Insiders Speak Out', category: 'entertainment_celebrity', tags: ['model', 'scandal'] },
  { id: 'ec25', headline: 'Retired Athlete Becomes Surprise Hit as TV Talk Show Host', category: 'entertainment_celebrity', tags: ['sports', 'tv'] },

  // ═══════════════════════════════════════════════════════════════
  // ENTERTAINMENT - MOVIES (~25)
  // ═══════════════════════════════════════════════════════════════
  { id: 'em01', headline: 'Marvel Announces Surprising New Direction for Next Phase', category: 'entertainment_movies', tags: ['marvel', 'movies'] },
  { id: 'em02', headline: 'Indie Film Wins Top Prize at Sundance, Studios in Bidding War', category: 'entertainment_movies', tags: ['sundance', 'indie'] },
  { id: 'em03', headline: 'Beloved 90s Franchise Getting Reboot with Original Cast', category: 'entertainment_movies', tags: ['reboot', 'nostalgia'] },
  { id: 'em04', headline: 'Director Reveals Alternate Ending That Was Too Dark for Theaters', category: 'entertainment_movies', tags: ['movies', 'behind scenes'] },
  { id: 'em05', headline: 'Oscar Predictions: Critics Say This Years Race Is Wide Open', category: 'entertainment_movies', tags: ['oscars', 'awards'] },
  { id: 'em06', headline: 'Streaming Service Drops Entire Season of Hit Show Early', category: 'entertainment_movies', tags: ['streaming', 'tv'] },
  { id: 'em07', headline: 'Horror Film Made for $5 Million Earns $500 Million at Box Office', category: 'entertainment_movies', tags: ['horror', 'box office'] },
  { id: 'em08', headline: 'Anime Film Becomes Highest-Grossing Movie of the Year', category: 'entertainment_movies', tags: ['anime', 'box office'] },
  { id: 'em09', headline: 'Controversial Film Banned in 12 Countries, Streaming Numbers Soar', category: 'entertainment_movies', tags: ['controversy', 'censorship'] },
  { id: 'em10', headline: 'TV Show Finale Breaks Internet: Fans Divided Over Shocking Ending', category: 'entertainment_movies', tags: ['tv', 'finale'] },
  { id: 'em11', headline: 'AI-Generated Movie Script Gets Greenlit by Major Studio', category: 'entertainment_movies', tags: ['ai', 'writing'] },
  { id: 'em12', headline: 'Documentary About Climate Crisis Wins Every Major Film Award', category: 'entertainment_movies', tags: ['documentary', 'awards'] },
  { id: 'em13', headline: 'Streaming Wars: Netflix Loses 5 Million Subscribers to Rival', category: 'entertainment_movies', tags: ['streaming', 'competition'] },
  { id: 'em14', headline: 'Star Wars Announces Completely New Trilogy Unconnected to Skywalkers', category: 'entertainment_movies', tags: ['star wars', 'franchise'] },
  { id: 'em15', headline: 'Actors Strike Forces Hollywood to Shut Down for Months', category: 'entertainment_movies', tags: ['strike', 'hollywood'] },
  { id: 'em16', headline: 'First Film Shot Entirely on iPhone Wins Best Cinematography', category: 'entertainment_movies', tags: ['iphone', 'innovation'] },
  { id: 'em17', headline: 'Binge-Watching Culture Killing Cinema? Theater Attendance Drops 40%', category: 'entertainment_movies', tags: ['cinema', 'streaming'] },
  { id: 'em18', headline: 'Foreign Film Dominates American Box Office for First Time', category: 'entertainment_movies', tags: ['international', 'box office'] },
  { id: 'em19', headline: 'CGI De-Aging Technology Brings Late Actor Back for Sequel', category: 'entertainment_movies', tags: ['cgi', 'technology'] },
  { id: 'em20', headline: 'True Crime Series Leads to Reopening of Cold Case After 30 Years', category: 'entertainment_movies', tags: ['true crime', 'impact'] },
  { id: 'em21', headline: 'Movie Theater Chain Introduces $5 Unlimited Monthly Pass', category: 'entertainment_movies', tags: ['cinema', 'deal'] },
  { id: 'em22', headline: 'Director Fires Entire Cast Mid-Production, Starts Over', category: 'entertainment_movies', tags: ['drama', 'production'] },
  { id: 'em23', headline: 'Criterion Collection Adds Viral TikTok Short Film to Catalog', category: 'entertainment_movies', tags: ['tiktok', 'film'] },
  { id: 'em24', headline: 'Superhero Fatigue? Latest Blockbuster Bombs at Box Office', category: 'entertainment_movies', tags: ['superhero', 'box office'] },
  { id: 'em25', headline: 'Limited Series Format Takes Over: Why Nobody Wants Season 2', category: 'entertainment_movies', tags: ['tv', 'trend'] },

  // ═══════════════════════════════════════════════════════════════
  // ENTERTAINMENT - GAMING (~25)
  // ═══════════════════════════════════════════════════════════════
  { id: 'eg01', headline: 'GTA 6 Trailer Breaks All-Time YouTube Record in 24 Hours', category: 'entertainment_gaming', tags: ['gaming', 'gta'] },
  { id: 'eg02', headline: 'Professional Esports Players Have Reflexes of Fighter Pilots', category: 'entertainment_gaming', tags: ['esports', 'science'] },
  { id: 'eg03', headline: 'Nintendo Announces Surprise New Console for Holiday Season', category: 'entertainment_gaming', tags: ['nintendo', 'console'] },
  { id: 'eg04', headline: 'Indie Game Made by One Person Sells 10 Million Copies', category: 'entertainment_gaming', tags: ['indie', 'success'] },
  { id: 'eg05', headline: 'VR Gaming Finally Goes Mainstream with New Affordable Headset', category: 'entertainment_gaming', tags: ['vr', 'gaming'] },
  { id: 'eg06', headline: 'Classic RPG Series Returns After 15 Years to Critical Acclaim', category: 'entertainment_gaming', tags: ['rpg', 'nostalgia'] },
  { id: 'eg07', headline: 'Speedrunner Beats Dark Souls in Under 20 Minutes Blindfolded', category: 'entertainment_gaming', tags: ['speedrun', 'challenge'] },
  { id: 'eg08', headline: 'Fortnite Concert Attracts 30 Million Simultaneous Players', category: 'entertainment_gaming', tags: ['fortnite', 'event'] },
  { id: 'eg09', headline: 'Gaming Disorder: WHO Classifies Excessive Gaming as Health Condition', category: 'entertainment_gaming', tags: ['health', 'addiction'] },
  { id: 'eg10', headline: 'Esports Tournament Prize Pool Exceeds $40 Million', category: 'entertainment_gaming', tags: ['esports', 'prize'] },
  { id: 'eg11', headline: 'AI Beats World Champion at StarCraft in Landmark Achievement', category: 'entertainment_gaming', tags: ['ai', 'competition'] },
  { id: 'eg12', headline: 'Cloud Gaming Eliminates Need for Expensive Hardware', category: 'entertainment_gaming', tags: ['cloud', 'technology'] },
  { id: 'eg13', headline: 'Modding Community Creates Entire New Game Inside Skyrim', category: 'entertainment_gaming', tags: ['modding', 'skyrim'] },
  { id: 'eg14', headline: 'Console Wars: PlayStation vs Xbox vs Nintendo - Who Wins 2025?', category: 'entertainment_gaming', tags: ['console', 'competition'] },
  { id: 'eg15', headline: 'Minecraft Education Edition Used by 100 Million Students Worldwide', category: 'entertainment_gaming', tags: ['minecraft', 'education'] },
  { id: 'eg16', headline: 'Game Developer Crunch Culture Exposed in Whistleblower Report', category: 'entertainment_gaming', tags: ['industry', 'labor'] },
  { id: 'eg17', headline: 'Retro Gaming Market Explodes: Original NES Sells for $50,000', category: 'entertainment_gaming', tags: ['retro', 'collecting'] },
  { id: 'eg18', headline: 'Mobile Game Generates $1 Billion in Revenue in First Month', category: 'entertainment_gaming', tags: ['mobile', 'revenue'] },
  { id: 'eg19', headline: 'Gaming Streamer Signs $100 Million Exclusive Platform Deal', category: 'entertainment_gaming', tags: ['streaming', 'deal'] },
  { id: 'eg20', headline: 'Open-World Game Map Is Literally the Size of Real Country', category: 'entertainment_gaming', tags: ['open world', 'scale'] },
  { id: 'eg21', headline: 'Haptic Suit Lets You Feel Every Hit in VR Games', category: 'entertainment_gaming', tags: ['vr', 'haptic'] },
  { id: 'eg22', headline: 'Parents Shocked: Kids Earning More Than Them Playing Roblox', category: 'entertainment_gaming', tags: ['roblox', 'kids'] },
  { id: 'eg23', headline: 'Game Studio Unionizes in Historic First for the Industry', category: 'entertainment_gaming', tags: ['union', 'industry'] },
  { id: 'eg24', headline: 'Zelda Wins Game of the Year for Record Third Time', category: 'entertainment_gaming', tags: ['zelda', 'awards'] },
  { id: 'eg25', headline: 'Scientists Use Video Games to Successfully Treat PTSD in Veterans', category: 'entertainment_gaming', tags: ['health', 'therapy'] },

  // ═══════════════════════════════════════════════════════════════
  // SPORTS - MAINSTREAM (~25)
  // ═══════════════════════════════════════════════════════════════
  { id: 'sm01', headline: 'NBA Star Signs Record-Breaking $300 Million Contract Extension', category: 'sports_mainstream', tags: ['nba', 'contract'] },
  { id: 'sm02', headline: 'World Cup Final Draws 1.5 Billion Viewers Worldwide', category: 'sports_mainstream', tags: ['soccer', 'world cup'] },
  { id: 'sm03', headline: 'Underdog Team Wins Championship in Stunning Upset', category: 'sports_mainstream', tags: ['football', 'upset'] },
  { id: 'sm04', headline: 'Tennis Legend Announces Retirement After 20-Year Career', category: 'sports_mainstream', tags: ['tennis', 'retirement'] },
  { id: 'sm05', headline: 'Olympic Athlete Breaks 30-Year-Old World Record', category: 'sports_mainstream', tags: ['olympics', 'record'] },
  { id: 'sm06', headline: 'Major League Expands to New Cities in Historic Move', category: 'sports_mainstream', tags: ['expansion', 'baseball'] },
  { id: 'sm07', headline: 'Rookie Quarterback Leads Team to Super Bowl in First Season', category: 'sports_mainstream', tags: ['nfl', 'rookie'] },
  { id: 'sm08', headline: 'Soccer Star Transfer Fee Breaks $300 Million Barrier', category: 'sports_mainstream', tags: ['soccer', 'transfer'] },
  { id: 'sm09', headline: 'March Madness Buzzer Beater Called Greatest Shot in Tournament History', category: 'sports_mainstream', tags: ['basketball', 'march madness'] },
  { id: 'sm10', headline: 'Female Athlete Earns More Than Any Male Counterpart for First Time', category: 'sports_mainstream', tags: ['equality', 'earnings'] },
  { id: 'sm11', headline: 'Boxing Match of the Century Generates $500 Million in Revenue', category: 'sports_mainstream', tags: ['boxing', 'event'] },
  { id: 'sm12', headline: 'Perfect Game Pitched in World Series for First Time Since 1956', category: 'sports_mainstream', tags: ['baseball', 'history'] },
  { id: 'sm13', headline: 'F1 Introduces New Sprint Race Format, Fans Divided', category: 'sports_mainstream', tags: ['f1', 'format'] },
  { id: 'sm14', headline: 'College Athlete NIL Deal Worth $10 Million Sparks Debate', category: 'sports_mainstream', tags: ['college', 'nil'] },
  { id: 'sm15', headline: 'Golf Prodigy, Age 16, Wins Major Championship', category: 'sports_mainstream', tags: ['golf', 'prodigy'] },
  { id: 'sm16', headline: 'NBA Expands to Europe with London and Paris Franchises', category: 'sports_mainstream', tags: ['nba', 'expansion'] },
  { id: 'sm17', headline: 'Olympic Host City Faces Billion-Dollar Cost Overrun', category: 'sports_mainstream', tags: ['olympics', 'cost'] },
  { id: 'sm18', headline: 'Concussion Research Forces Major Rule Changes in Football', category: 'sports_mainstream', tags: ['football', 'safety'] },
  { id: 'sm19', headline: 'Stadium Built for $5 Billion Is Most Expensive Structure Ever', category: 'sports_mainstream', tags: ['stadium', 'construction'] },
  { id: 'sm20', headline: 'Tennis Introduces Shot Clock: Fans Love It, Players Hate It', category: 'sports_mainstream', tags: ['tennis', 'rules'] },
  { id: 'sm21', headline: 'Marathon World Record Shattered by Over 2 Minutes', category: 'sports_mainstream', tags: ['running', 'record'] },
  { id: 'sm22', headline: 'Relegation Drama: Historic Club Drops to Lower Division', category: 'sports_mainstream', tags: ['soccer', 'relegation'] },
  { id: 'sm23', headline: 'Sports Betting Legalization Transforms Fan Experience', category: 'sports_mainstream', tags: ['betting', 'legal'] },
  { id: 'sm24', headline: 'Womens League Attendance Surpasses Mens for First Time', category: 'sports_mainstream', tags: ['womens', 'attendance'] },
  { id: 'sm25', headline: 'Doping Scandal Strips Olympic Gold Medalists of Titles', category: 'sports_mainstream', tags: ['doping', 'scandal'] },

  // ═══════════════════════════════════════════════════════════════
  // SPORTS - NICHE (~20)
  // ═══════════════════════════════════════════════════════════════
  { id: 'sn01', headline: 'Underwater Hockey World Championship Draws Surprising Crowds', category: 'sports_niche', tags: ['underwater hockey', 'niche'] },
  { id: 'sn02', headline: 'Competitive Rock Paper Scissors League Announces $100K Prize', category: 'sports_niche', tags: ['weird sports', 'competition'] },
  { id: 'sn03', headline: 'Professional Drone Racing Becomes Fastest-Growing Sport', category: 'sports_niche', tags: ['drones', 'racing'] },
  { id: 'sn04', headline: 'Extreme Ironing Championship Held on Mountain Peak', category: 'sports_niche', tags: ['extreme', 'weird'] },
  { id: 'sn05', headline: 'Competitive Eating Record Shattered at Annual Hot Dog Contest', category: 'sports_niche', tags: ['eating', 'contest'] },
  { id: 'sn06', headline: 'Chess Boxing Gains Popularity as Ultimate Mind-Body Sport', category: 'sports_niche', tags: ['chess', 'boxing'] },
  { id: 'sn07', headline: 'Wife Carrying Championship Winner Claims Prize in Beer', category: 'sports_niche', tags: ['wife carrying', 'weird'] },
  { id: 'sn08', headline: 'Competitive Tag League Signs ESPN Broadcasting Deal', category: 'sports_niche', tags: ['tag', 'broadcast'] },
  { id: 'sn09', headline: 'Axe Throwing Bars Open in Every Major City Across America', category: 'sports_niche', tags: ['axe throwing', 'trend'] },
  { id: 'sn10', headline: 'Shin Kicking Championship Draws International Competitors', category: 'sports_niche', tags: ['weird', 'traditional'] },
  { id: 'sn11', headline: 'Pickleball Is Now Fastest Growing Sport in America', category: 'sports_niche', tags: ['pickleball', 'growth'] },
  { id: 'sn12', headline: 'Quidditch League Rebrands After Rowling Controversy', category: 'sports_niche', tags: ['quidditch', 'controversy'] },
  { id: 'sn13', headline: 'Cheese Rolling Race Down Steep Hill Goes Viral Every Year', category: 'sports_niche', tags: ['cheese rolling', 'viral'] },
  { id: 'sn14', headline: 'Parkour Officially Recognized as Sport by International Committee', category: 'sports_niche', tags: ['parkour', 'official'] },
  { id: 'sn15', headline: 'Bog Snorkeling World Championships Attract Record Entries', category: 'sports_niche', tags: ['bog snorkeling', 'weird'] },
  { id: 'sn16', headline: 'Disc Golf Courses Now Outnumber Traditional Golf Courses in 5 States', category: 'sports_niche', tags: ['disc golf', 'growth'] },
  { id: 'sn17', headline: 'Robot Fighting League Gets Prime-Time TV Slot', category: 'sports_niche', tags: ['robots', 'tv'] },
  { id: 'sn18', headline: 'Slacklining Across Grand Canyon Sets New World Record', category: 'sports_niche', tags: ['slacklining', 'record'] },
  { id: 'sn19', headline: 'Underwater Basket Weaving Becomes Legitimate Competition', category: 'sports_niche', tags: ['underwater', 'weird'] },
  { id: 'sn20', headline: 'Competitive Rock Stacking Festival Draws Zen Enthusiasts', category: 'sports_niche', tags: ['rock stacking', 'zen'] },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE - CLIMATE (~25)
  // ═══════════════════════════════════════════════════════════════
  { id: 'sc01', headline: 'Arctic Ice Loss Accelerating Faster Than Any Model Predicted', category: 'science_climate', tags: ['climate', 'arctic'] },
  { id: 'sc02', headline: 'New Carbon Capture Technology Could Remove 1 Billion Tons Annually', category: 'science_climate', tags: ['climate', 'carbon'] },
  { id: 'sc03', headline: 'Ocean Temperatures Hit Record High for Third Straight Year', category: 'science_climate', tags: ['ocean', 'warming'] },
  { id: 'sc04', headline: 'Scientists Discover New Method to Turn CO2 Into Solid Rock', category: 'science_climate', tags: ['carbon', 'innovation'] },
  { id: 'sc05', headline: 'Coral Reef Shows Signs of Recovery After Conservation Efforts', category: 'science_climate', tags: ['coral', 'conservation'] },
  { id: 'sc06', headline: 'City Plants Million Trees to Combat Urban Heat Island Effect', category: 'science_climate', tags: ['urban', 'trees'] },
  { id: 'sc07', headline: 'Permafrost Melting Releases Ancient Viruses Scientists Thought Were Extinct', category: 'science_climate', tags: ['permafrost', 'virus'] },
  { id: 'sc08', headline: 'Sahara Desert Gets Snow for Second Time in Recorded History', category: 'science_climate', tags: ['weather', 'anomaly'] },
  { id: 'sc09', headline: 'Kelp Farming Could Absorb Carbon Faster Than Forests', category: 'science_climate', tags: ['kelp', 'carbon'] },
  { id: 'sc10', headline: 'Antarctic Ice Sheet Collapse Would Raise Sea Levels 10 Feet', category: 'science_climate', tags: ['antarctica', 'sea level'] },
  { id: 'sc11', headline: 'White Paint Reflects Sunlight So Well It Cools Buildings Without AC', category: 'science_climate', tags: ['innovation', 'cooling'] },
  { id: 'sc12', headline: 'Amazon Rainforest Nearing Irreversible Tipping Point, Scientists Warn', category: 'science_climate', tags: ['amazon', 'deforestation'] },
  { id: 'sc13', headline: 'Microplastics Found in Human Blood for First Time', category: 'science_climate', tags: ['pollution', 'health'] },
  { id: 'sc14', headline: 'Rewilding Project Restores 1 Million Acres of Natural Habitat', category: 'science_climate', tags: ['rewilding', 'conservation'] },
  { id: 'sc15', headline: 'Solar Geoengineering Experiment Could Cool Planet by 1 Degree', category: 'science_climate', tags: ['geoengineering', 'solution'] },
  { id: 'sc16', headline: 'Electric Cargo Ships Could Cut Shipping Emissions by 90%', category: 'science_climate', tags: ['shipping', 'electric'] },
  { id: 'sc17', headline: 'Climate Migration: 200 Million People Could Be Displaced by 2050', category: 'science_climate', tags: ['migration', 'prediction'] },
  { id: 'sc18', headline: 'Mangrove Restoration Proves Most Effective Natural Climate Solution', category: 'science_climate', tags: ['mangrove', 'nature'] },
  { id: 'sc19', headline: 'Greenlands Ice Sheet Lost Record Amount of Mass Last Summer', category: 'science_climate', tags: ['greenland', 'ice'] },
  { id: 'sc20', headline: 'New Satellite Network Monitors Every Carbon Emission Source on Earth', category: 'science_climate', tags: ['satellite', 'monitoring'] },
  { id: 'sc21', headline: 'Extreme Weather Events Have Tripled in Frequency Since 1980', category: 'science_climate', tags: ['extreme weather', 'data'] },
  { id: 'sc22', headline: 'Biochar Could Lock Carbon in Soil for Thousands of Years', category: 'science_climate', tags: ['biochar', 'soil'] },
  { id: 'sc23', headline: 'Pacific Island Nation Becomes First Country Entirely Lost to Rising Seas', category: 'science_climate', tags: ['sea level', 'loss'] },
  { id: 'sc24', headline: 'Youth Climate Lawsuit Wins Against Government in Historic Ruling', category: 'science_climate', tags: ['legal', 'youth'] },
  { id: 'sc25', headline: 'Algae-Based Biofuel Could Replace Jet Fuel Within 10 Years', category: 'science_climate', tags: ['biofuel', 'aviation'] },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE - SPACE (~25)
  // ═══════════════════════════════════════════════════════════════
  { id: 'ss01', headline: 'James Webb Telescope Discovers New Type of Galaxy Never Seen Before', category: 'science_space', tags: ['jwst', 'astronomy'] },
  { id: 'ss02', headline: 'SpaceX Announces Mars Mission Timeline: First Humans by 2030', category: 'science_space', tags: ['spacex', 'mars'] },
  { id: 'ss03', headline: 'Scientists Detect Signal That Could Be Signs of Alien Technology', category: 'science_space', tags: ['aliens', 'seti'] },
  { id: 'ss04', headline: 'NASA Confirms Water Ice at Lunar South Pole Location', category: 'science_space', tags: ['moon', 'water'] },
  { id: 'ss05', headline: 'Asteroid Mining Company Successfully Extracts First Samples', category: 'science_space', tags: ['asteroid', 'mining'] },
  { id: 'ss06', headline: 'New Propulsion System Could Cut Mars Travel Time in Half', category: 'science_space', tags: ['propulsion', 'mars'] },
  { id: 'ss07', headline: 'Black Hole Photographed Eating a Star in Real Time', category: 'science_space', tags: ['black hole', 'observation'] },
  { id: 'ss08', headline: 'Private Space Station to Replace ISS by 2030', category: 'science_space', tags: ['space station', 'commercial'] },
  { id: 'ss09', headline: 'Mars Rover Discovers Possible Fossilized Microbial Life', category: 'science_space', tags: ['mars', 'life'] },
  { id: 'ss10', headline: 'Space Tourism Prices Drop to $100K, Making It Accessible to More', category: 'science_space', tags: ['tourism', 'commercial'] },
  { id: 'ss11', headline: 'Astronomers Find Earth-Like Planet Only 11 Light Years Away', category: 'science_space', tags: ['exoplanet', 'habitable'] },
  { id: 'ss12', headline: 'First Baby Born in Space Changes Everything About Human Future', category: 'science_space', tags: ['space', 'reproduction'] },
  { id: 'ss13', headline: 'Mysterious Object at Edge of Solar System Defies All Known Physics', category: 'science_space', tags: ['mystery', 'physics'] },
  { id: 'ss14', headline: 'China Builds Permanent Moon Base, Starting Space Race 2.0', category: 'science_space', tags: ['china', 'moon'] },
  { id: 'ss15', headline: 'Gravitational Wave Detectors Hear Echoes of the Big Bang', category: 'science_space', tags: ['physics', 'cosmology'] },
  { id: 'ss16', headline: 'Solar Sail Spacecraft Accelerates to 10% Speed of Light', category: 'science_space', tags: ['solar sail', 'speed'] },
  { id: 'ss17', headline: 'Jupiter Moon Europa Confirmed to Have Subsurface Ocean', category: 'science_space', tags: ['europa', 'ocean'] },
  { id: 'ss18', headline: 'Space Debris Crisis: Satellites Dodging Collisions Daily', category: 'science_space', tags: ['debris', 'danger'] },
  { id: 'ss19', headline: 'Telescope Captures Most Detailed Image of Another Star Ever Taken', category: 'science_space', tags: ['telescope', 'image'] },
  { id: 'ss20', headline: 'First Space-Manufactured Product Returns to Earth for Sale', category: 'science_space', tags: ['manufacturing', 'commercial'] },
  { id: 'ss21', headline: 'Voyager Spacecraft Sends Unexpected Data from Interstellar Space', category: 'science_space', tags: ['voyager', 'mystery'] },
  { id: 'ss22', headline: 'SpaceX Starship Completes Full Orbit and Lands Successfully', category: 'science_space', tags: ['spacex', 'starship'] },
  { id: 'ss23', headline: 'Dwarf Planet Beyond Pluto Has Its Own Moon, Astronomers Discover', category: 'science_space', tags: ['discovery', 'dwarf planet'] },
  { id: 'ss24', headline: 'Nuclear Fusion Rocket Could Reach Mars in 30 Days', category: 'science_space', tags: ['fusion', 'mars'] },
  { id: 'ss25', headline: 'Alien Megastructure Theory Revived After New Observations', category: 'science_space', tags: ['aliens', 'theory'] },

  // ═══════════════════════════════════════════════════════════════
  // SCIENCE - HEALTH (~25)
  // ═══════════════════════════════════════════════════════════════
  { id: 'sh01', headline: 'Breakthrough Cancer Treatment Shows 90% Response Rate in Trial', category: 'science_health', tags: ['cancer', 'treatment'] },
  { id: 'sh02', headline: 'Scientists Reverse Aging in Mice, Human Trials Next', category: 'science_health', tags: ['aging', 'longevity'] },
  { id: 'sh03', headline: 'New Alzheimers Drug Shows Promise in Slowing Disease', category: 'science_health', tags: ['alzheimers', 'brain'] },
  { id: 'sh04', headline: 'Sleep Study Reveals Surprising Benefits of Afternoon Naps', category: 'science_health', tags: ['sleep', 'health'] },
  { id: 'sh05', headline: 'Universal Flu Vaccine Could Be Available Within 5 Years', category: 'science_health', tags: ['vaccine', 'flu'] },
  { id: 'sh06', headline: 'Gut Bacteria Found to Influence Mental Health More Than Expected', category: 'science_health', tags: ['gut', 'mental health'] },
  { id: 'sh07', headline: 'Blood Test Detects 50 Types of Cancer Before Symptoms Appear', category: 'science_health', tags: ['cancer', 'detection'] },
  { id: 'sh08', headline: 'Psilocybin Therapy Outperforms Antidepressants in Clinical Trial', category: 'science_health', tags: ['psychedelics', 'depression'] },
  { id: 'sh09', headline: 'Personalized mRNA Vaccines Could Treat Individual Cancers', category: 'science_health', tags: ['mrna', 'cancer'] },
  { id: 'sh10', headline: 'Exercise Proven More Effective Than Drugs for Depression Treatment', category: 'science_health', tags: ['exercise', 'depression'] },
  { id: 'sh11', headline: 'Human Lifespan Could Reach 150 with New Anti-Aging Compound', category: 'science_health', tags: ['longevity', 'compound'] },
  { id: 'sh12', headline: 'Stem Cell Therapy Regenerates Heart Tissue After Heart Attack', category: 'science_health', tags: ['stem cells', 'heart'] },
  { id: 'sh13', headline: 'Fasting 3 Days Resets Entire Immune System, Study Finds', category: 'science_health', tags: ['fasting', 'immunity'] },
  { id: 'sh14', headline: 'Scientists Map Every Neuron in Human Brain for First Time', category: 'science_health', tags: ['brain', 'mapping'] },
  { id: 'sh15', headline: 'Diabetes Type 1 Cure Found: Insulin Production Restored Permanently', category: 'science_health', tags: ['diabetes', 'cure'] },
  { id: 'sh16', headline: 'Walking 10,000 Steps Myth Debunked: 4,400 Is Enough for Benefits', category: 'science_health', tags: ['walking', 'myth'] },
  { id: 'sh17', headline: 'Antibiotic Resistance Declared Global Health Emergency', category: 'science_health', tags: ['antibiotics', 'crisis'] },
  { id: 'sh18', headline: 'Screen Time Before Bed Damages Brain More Than Previously Thought', category: 'science_health', tags: ['screens', 'sleep'] },
  { id: 'sh19', headline: 'Gene Editing Eliminates Hereditary Heart Disease in Embryos', category: 'science_health', tags: ['genetics', 'heart'] },
  { id: 'sh20', headline: 'Cold Water Swimming Boosts Immune System by 300%, Study Shows', category: 'science_health', tags: ['cold water', 'immunity'] },
  { id: 'sh21', headline: 'Ultra-Processed Foods Linked to 30% Higher Mortality Rate', category: 'science_health', tags: ['nutrition', 'mortality'] },
  { id: 'sh22', headline: 'New Hearing Restoration Treatment Gives Deaf Patients Full Hearing', category: 'science_health', tags: ['hearing', 'treatment'] },
  { id: 'sh23', headline: 'Scientists Discover Why Some People Never Get Sick', category: 'science_health', tags: ['immunity', 'genetics'] },
  { id: 'sh24', headline: 'Meditation Changes Brain Structure in Just 8 Weeks', category: 'science_health', tags: ['meditation', 'brain'] },
  { id: 'sh25', headline: 'Worm Parasites Deliberately Swallowed as Allergy Treatment Shows Results', category: 'science_health', tags: ['allergy', 'treatment'] },

  // ═══════════════════════════════════════════════════════════════
  // LIFESTYLE - FITNESS (~20)
  // ═══════════════════════════════════════════════════════════════
  { id: 'lf01', headline: '10-Minute Daily Walk More Effective Than Gym, Study Finds', category: 'lifestyle_fitness', tags: ['walking', 'health'] },
  { id: 'lf02', headline: 'CrossFit vs. Yoga: Which Burns More Calories? The Answer Surprises', category: 'lifestyle_fitness', tags: ['crossfit', 'yoga'] },
  { id: 'lf03', headline: 'New Fitness Trend Takes Social Media by Storm', category: 'lifestyle_fitness', tags: ['trend', 'viral'] },
  { id: 'lf04', headline: 'Study: Morning Workouts Boost Productivity by 30%', category: 'lifestyle_fitness', tags: ['morning', 'productivity'] },
  { id: 'lf05', headline: 'Olympic Athlete Shares Simple Home Workout Routine', category: 'lifestyle_fitness', tags: ['home', 'workout'] },
  { id: 'lf06', headline: 'Cold Plunge Benefits: Trend or Science-Backed Therapy?', category: 'lifestyle_fitness', tags: ['cold', 'recovery'] },
  { id: 'lf07', headline: '75 Hard Challenge: Life-Changing or Dangerously Extreme?', category: 'lifestyle_fitness', tags: ['challenge', 'debate'] },
  { id: 'lf08', headline: 'Running a Marathon Reverses 10 Years of Aging on Blood Vessels', category: 'lifestyle_fitness', tags: ['running', 'aging'] },
  { id: 'lf09', headline: 'Zone 2 Training: Why Exercising Slower Gets Better Results', category: 'lifestyle_fitness', tags: ['training', 'cardio'] },
  { id: 'lf10', headline: 'Gym Memberships Hit All-Time High as Fitness Obsession Grows', category: 'lifestyle_fitness', tags: ['gym', 'trend'] },
  { id: 'lf11', headline: 'Deadlifting 3x Per Week Reduces Back Pain Better Than Physical Therapy', category: 'lifestyle_fitness', tags: ['strength', 'back pain'] },
  { id: 'lf12', headline: 'Wearable Fitness Tech Causes Anxiety, Not Health, Experts Warn', category: 'lifestyle_fitness', tags: ['wearables', 'anxiety'] },
  { id: 'lf13', headline: 'Protein Obsession: Are We Eating Too Much Protein?', category: 'lifestyle_fitness', tags: ['protein', 'nutrition'] },
  { id: 'lf14', headline: 'Sauna Use 4x Weekly Cuts Heart Disease Risk in Half', category: 'lifestyle_fitness', tags: ['sauna', 'heart'] },
  { id: 'lf15', headline: 'Couch to 5K: How One Program Changed Millions of Lives', category: 'lifestyle_fitness', tags: ['running', 'beginner'] },
  { id: 'lf16', headline: 'Standing Desks Dont Actually Help, New Study Reveals', category: 'lifestyle_fitness', tags: ['desk', 'myth'] },
  { id: 'lf17', headline: 'Calisthenics Comeback: Why Bodyweight Training Is Trending', category: 'lifestyle_fitness', tags: ['calisthenics', 'trend'] },
  { id: 'lf18', headline: 'Personal Trainer Industry Exposed for Pseudoscience Claims', category: 'lifestyle_fitness', tags: ['trainers', 'science'] },
  { id: 'lf19', headline: 'Pilates Reformer Classes Now Have 6-Month Waiting Lists', category: 'lifestyle_fitness', tags: ['pilates', 'trend'] },
  { id: 'lf20', headline: 'Walking Pad Under Desk: Office Workers Log 15,000 Steps Daily', category: 'lifestyle_fitness', tags: ['walking', 'office'] },

  // ═══════════════════════════════════════════════════════════════
  // LIFESTYLE - FOOD (~20)
  // ═══════════════════════════════════════════════════════════════
  { id: 'ld01', headline: 'TikTok Pasta Recipe Has Been Viewed 500 Million Times', category: 'lifestyle_food', tags: ['tiktok', 'recipe'] },
  { id: 'ld02', headline: 'Michelin Chef Reveals the One Ingredient That Changes Everything', category: 'lifestyle_food', tags: ['chef', 'cooking'] },
  { id: 'ld03', headline: 'Lab-Grown Meat Finally Tastes as Good as the Real Thing', category: 'lifestyle_food', tags: ['lab meat', 'future'] },
  { id: 'ld04', headline: 'Ancient Grain Makes Comeback as Superfood of the Year', category: 'lifestyle_food', tags: ['superfood', 'grain'] },
  { id: 'ld05', headline: 'Coffee Study: 4 Cups a Day Linked to Longer Life', category: 'lifestyle_food', tags: ['coffee', 'health'] },
  { id: 'ld06', headline: 'The $1000 Dinner Experience Everyone Is Talking About', category: 'lifestyle_food', tags: ['luxury', 'dining'] },
  { id: 'ld07', headline: 'Sourdough Bread Craze Continues: Home Bakers Share Secrets', category: 'lifestyle_food', tags: ['sourdough', 'baking'] },
  { id: 'ld08', headline: 'Ultra-Processed Foods Make Up 60% of American Diet', category: 'lifestyle_food', tags: ['processed', 'health'] },
  { id: 'ld09', headline: 'Street Food Vendor Earns Michelin Star, A First in History', category: 'lifestyle_food', tags: ['street food', 'michelin'] },
  { id: 'ld10', headline: 'Intermittent Fasting Debunked: New Study Says It Doesnt Work', category: 'lifestyle_food', tags: ['fasting', 'debunked'] },
  { id: 'ld11', headline: 'Japanese Fruit That Costs $200 Each Becomes TikTok Sensation', category: 'lifestyle_food', tags: ['japan', 'luxury'] },
  { id: 'ld12', headline: 'Seed Oils: Are They Really As Toxic As Influencers Claim?', category: 'lifestyle_food', tags: ['seed oils', 'debate'] },
  { id: 'ld13', headline: 'Ghost Kitchen Chains Now Deliver More Food Than Traditional Restaurants', category: 'lifestyle_food', tags: ['delivery', 'ghost kitchen'] },
  { id: 'ld14', headline: 'Wine Sales Plummet as Gen Z Chooses Not to Drink', category: 'lifestyle_food', tags: ['alcohol', 'gen z'] },
  { id: 'ld15', headline: 'Fermented Foods Trend: Kimchi Sales Up 500% in Five Years', category: 'lifestyle_food', tags: ['fermented', 'trend'] },
  { id: 'ld16', headline: 'AI Chef Creates Flavor Combinations Humans Never Imagined', category: 'lifestyle_food', tags: ['ai', 'cooking'] },
  { id: 'ld17', headline: 'Meal Prep Industry Worth $15 Billion as Workers Abandon Cooking', category: 'lifestyle_food', tags: ['meal prep', 'industry'] },
  { id: 'ld18', headline: 'Hot Sauce Market Explodes: Americans Now Consume 200 Million Bottles Yearly', category: 'lifestyle_food', tags: ['hot sauce', 'trend'] },
  { id: 'ld19', headline: 'Chocolate Shortage Could Make Your Favorite Bar Cost $10', category: 'lifestyle_food', tags: ['chocolate', 'shortage'] },
  { id: 'ld20', headline: 'Carnivore Diet: Doctors Alarmed as Meat-Only Eating Goes Mainstream', category: 'lifestyle_food', tags: ['carnivore', 'diet'] },

  // ═══════════════════════════════════════════════════════════════
  // LIFESTYLE - TRAVEL (~20)
  // ═══════════════════════════════════════════════════════════════
  { id: 'lt01', headline: 'The Hidden Beach That Instagram Hasnt Discovered Yet', category: 'lifestyle_travel', tags: ['beach', 'hidden'] },
  { id: 'lt02', headline: 'Budget Airline Announces $49 Flights to Europe', category: 'lifestyle_travel', tags: ['budget', 'flights'] },
  { id: 'lt03', headline: 'Digital Nomad Visa: Countries That Want You to Work Remotely', category: 'lifestyle_travel', tags: ['nomad', 'remote'] },
  { id: 'lt04', headline: 'Overtourism Crisis: Famous Destination Limits Visitors', category: 'lifestyle_travel', tags: ['overtourism', 'limits'] },
  { id: 'lt05', headline: 'Solo Travel Surge: Why More People Are Exploring Alone', category: 'lifestyle_travel', tags: ['solo', 'trend'] },
  { id: 'lt06', headline: 'Train Travel Renaissance: Luxury Rails Making a Comeback', category: 'lifestyle_travel', tags: ['train', 'luxury'] },
  { id: 'lt07', headline: 'This Country Was Just Named Safest Destination in the World', category: 'lifestyle_travel', tags: ['safety', 'ranking'] },
  { id: 'lt08', headline: 'Flight Prices Drop 40% as New Airlines Enter Market', category: 'lifestyle_travel', tags: ['flights', 'competition'] },
  { id: 'lt09', headline: 'Van Life Movement: Thousands Quit Jobs to Travel Full-Time', category: 'lifestyle_travel', tags: ['van life', 'lifestyle'] },
  { id: 'lt10', headline: 'Underwater Hotel Opens in Maldives at $50,000 Per Night', category: 'lifestyle_travel', tags: ['luxury', 'hotel'] },
  { id: 'lt11', headline: 'Travel Hack: First Class Flights for Economy Prices Using Points', category: 'lifestyle_travel', tags: ['hack', 'points'] },
  { id: 'lt12', headline: 'Climate-Conscious Travel: Flight Shame Movement Grows in Europe', category: 'lifestyle_travel', tags: ['climate', 'flying'] },
  { id: 'lt13', headline: 'Japan Reopens to Tourists: Here Is What Changed', category: 'lifestyle_travel', tags: ['japan', 'reopening'] },
  { id: 'lt14', headline: 'Worst Tourist Traps in the World Revealed by Travel Experts', category: 'lifestyle_travel', tags: ['tourist trap', 'advice'] },
  { id: 'lt15', headline: 'Work From Anywhere: Companies Now Pay Employees to Travel', category: 'lifestyle_travel', tags: ['remote', 'work'] },
  { id: 'lt16', headline: 'Cruise Ship Industry Faces Backlash Over Environmental Impact', category: 'lifestyle_travel', tags: ['cruise', 'environment'] },
  { id: 'lt17', headline: 'Passport Power: Which Nationality Gets You Into Most Countries?', category: 'lifestyle_travel', tags: ['passport', 'ranking'] },
  { id: 'lt18', headline: 'Glamping Industry Doubles as Camping Goes Upscale', category: 'lifestyle_travel', tags: ['glamping', 'trend'] },
  { id: 'lt19', headline: 'Airline Introduces Standing Seats for Ultra-Cheap Fares', category: 'lifestyle_travel', tags: ['airline', 'budget'] },
  { id: 'lt20', headline: 'Most Instagrammed Locations Are Actually Disappointing in Person', category: 'lifestyle_travel', tags: ['instagram', 'reality'] },

  // ═══════════════════════════════════════════════════════════════
  // FINANCE - CRYPTO (~20)
  // ═══════════════════════════════════════════════════════════════
  { id: 'fc01', headline: 'Bitcoin Breaks $100,000 as Institutional Investors Pile In', category: 'finance_crypto', tags: ['bitcoin', 'investing'] },
  { id: 'fc02', headline: 'New Meme Coin Up 10,000% in 24 Hours: What to Know', category: 'finance_crypto', tags: ['meme coin', 'trading'] },
  { id: 'fc03', headline: 'Major Bank Launches Cryptocurrency Trading for All Customers', category: 'finance_crypto', tags: ['bank', 'adoption'] },
  { id: 'fc04', headline: 'NFT Market Shows Signs of Recovery After Year-Long Slump', category: 'finance_crypto', tags: ['nft', 'market'] },
  { id: 'fc05', headline: 'Country Becomes First to Make Bitcoin Legal Tender', category: 'finance_crypto', tags: ['bitcoin', 'legal'] },
  { id: 'fc06', headline: 'DeFi Protocol Hacked: $200 Million in Crypto Stolen', category: 'finance_crypto', tags: ['defi', 'hack'] },
  { id: 'fc07', headline: 'Crypto Whale Moves $1 Billion in Single Transaction', category: 'finance_crypto', tags: ['whale', 'transaction'] },
  { id: 'fc08', headline: '19-Year-Old Becomes Crypto Billionaire, Youngest Self-Made Ever', category: 'finance_crypto', tags: ['billionaire', 'youth'] },
  { id: 'fc09', headline: 'Ethereum Upgrade Slashes Energy Use by 99.9%', category: 'finance_crypto', tags: ['ethereum', 'energy'] },
  { id: 'fc10', headline: 'Crypto Exchange Collapse Wipes Out $30 Billion in Customer Funds', category: 'finance_crypto', tags: ['exchange', 'collapse'] },
  { id: 'fc11', headline: 'Bitcoin ETF Approved: Wall Street Finally Embraces Crypto', category: 'finance_crypto', tags: ['etf', 'wallstreet'] },
  { id: 'fc12', headline: 'Memecoin Frenzy: Dog-Themed Tokens Now Worth More Than Ford', category: 'finance_crypto', tags: ['meme', 'valuation'] },
  { id: 'fc13', headline: 'Central Bank Digital Currencies Threaten Crypto Independence', category: 'finance_crypto', tags: ['cbdc', 'regulation'] },
  { id: 'fc14', headline: 'Crypto Scammer Sentenced to 100 Years in Largest Fraud Case', category: 'finance_crypto', tags: ['scam', 'legal'] },
  { id: 'fc15', headline: 'Layer 2 Solutions Make Crypto Transactions Instant and Free', category: 'finance_crypto', tags: ['layer2', 'technology'] },
  { id: 'fc16', headline: 'Stablecoin Depegs Causing $40 Billion Panic Selloff', category: 'finance_crypto', tags: ['stablecoin', 'crash'] },
  { id: 'fc17', headline: 'Bitcoin Mining Now Uses 100% Renewable Energy in Some Countries', category: 'finance_crypto', tags: ['mining', 'renewable'] },
  { id: 'fc18', headline: 'Play-to-Earn Games Let Users in Developing Countries Earn Living Wage', category: 'finance_crypto', tags: ['gaming', 'earnings'] },
  { id: 'fc19', headline: 'Crypto Winter Is Over: Market Rallies Back to All-Time Highs', category: 'finance_crypto', tags: ['market', 'recovery'] },
  { id: 'fc20', headline: 'Smart Contracts Replace Lawyers in $500 Million Real Estate Deal', category: 'finance_crypto', tags: ['smart contracts', 'real estate'] },

  // ═══════════════════════════════════════════════════════════════
  // FINANCE - TRADITIONAL (~20)
  // ═══════════════════════════════════════════════════════════════
  { id: 'ft01', headline: 'Warren Buffetts Latest Investment Move Surprises Wall Street', category: 'finance_traditional', tags: ['buffett', 'investing'] },
  { id: 'ft02', headline: 'Simple Trick to Max Out Your 401(k) That Most People Miss', category: 'finance_traditional', tags: ['retirement', '401k'] },
  { id: 'ft03', headline: 'Housing Market Forecast: What Experts Predict for Next Year', category: 'finance_traditional', tags: ['housing', 'forecast'] },
  { id: 'ft04', headline: 'Fed Announces Interest Rate Decision: What It Means for You', category: 'finance_traditional', tags: ['fed', 'rates'] },
  { id: 'ft05', headline: 'Stock Market Hits All-Time High Despite Economic Concerns', category: 'finance_traditional', tags: ['stocks', 'market'] },
  { id: 'ft06', headline: 'Side Hustle Economy: Americans Average $1,000 Extra Monthly', category: 'finance_traditional', tags: ['side hustle', 'income'] },
  { id: 'ft07', headline: 'Millennials Are Finally Buying Homes, But Paying 50% More Than Parents', category: 'finance_traditional', tags: ['housing', 'millennials'] },
  { id: 'ft08', headline: 'S&P 500 Returns 25% This Year: Best Performance in a Decade', category: 'finance_traditional', tags: ['stocks', 'returns'] },
  { id: 'ft09', headline: 'Passive Income Guide: How to Make Money While You Sleep', category: 'finance_traditional', tags: ['passive', 'income'] },
  { id: 'ft10', headline: 'FIRE Movement: Retiring at 35 Is Actually Possible, Heres How', category: 'finance_traditional', tags: ['fire', 'retirement'] },
  { id: 'ft11', headline: 'Gold Hits Record Price as Investors Flee to Safety', category: 'finance_traditional', tags: ['gold', 'safety'] },
  { id: 'ft12', headline: 'Credit Card Debt Hits $1 Trillion: Average American Owes $6,000', category: 'finance_traditional', tags: ['debt', 'credit'] },
  { id: 'ft13', headline: 'Index Fund Investing Beats 90% of Professional Money Managers', category: 'finance_traditional', tags: ['index fund', 'performance'] },
  { id: 'ft14', headline: 'Recession Warning: Yield Curve Inverts for Longest Period Ever', category: 'finance_traditional', tags: ['recession', 'warning'] },
  { id: 'ft15', headline: 'AI Stock Picks Outperform Human Fund Managers by 15%', category: 'finance_traditional', tags: ['ai', 'stocks'] },
  { id: 'ft16', headline: 'Real Estate Investment: Best Cities to Buy Property in 2025', category: 'finance_traditional', tags: ['real estate', 'cities'] },
  { id: 'ft17', headline: 'Dividend Investing: Build a Portfolio That Pays You Monthly', category: 'finance_traditional', tags: ['dividends', 'income'] },
  { id: 'ft18', headline: 'Car Prices Finally Dropping: Best Time to Buy in Years', category: 'finance_traditional', tags: ['cars', 'prices'] },
  { id: 'ft19', headline: 'Emergency Fund Rules Have Changed: New Guidelines Recommend 12 Months', category: 'finance_traditional', tags: ['savings', 'emergency'] },
  { id: 'ft20', headline: 'Student Loan Payments Resume: Millions Face Financial Shock', category: 'finance_traditional', tags: ['student loans', 'payments'] },

  // ═══════════════════════════════════════════════════════════════
  // ANIMALS - CUTE (~25)
  // ═══════════════════════════════════════════════════════════════
  { id: 'ac01', headline: 'Golden Retriever Becomes Best Friends with Baby Duck', category: 'animals_cute', tags: ['dog', 'duck'] },
  { id: 'ac02', headline: 'Rescue Cat Adopted After 500 Days: Heartwarming Photos', category: 'animals_cute', tags: ['cat', 'adoption'] },
  { id: 'ac03', headline: 'Unlikely Animal Friendship: Bear and Wolf Spotted Together', category: 'animals_cute', tags: ['bear', 'wolf'] },
  { id: 'ac04', headline: 'Puppy Born with Heart-Shaped Marking Goes Viral', category: 'animals_cute', tags: ['puppy', 'viral'] },
  { id: 'ac05', headline: 'Zoo Celebrates Birth of Endangered Baby Panda', category: 'animals_cute', tags: ['panda', 'zoo'] },
  { id: 'ac06', headline: 'Dog Waits at Train Station for Owner Every Day for 10 Years', category: 'animals_cute', tags: ['loyalty', 'dog'] },
  { id: 'ac07', headline: 'Kitten Raised by Dogs Thinks Its a Puppy, Internet Melts', category: 'animals_cute', tags: ['kitten', 'dogs'] },
  { id: 'ac08', headline: 'Therapy Dog Visits Hospital, Patient Recovery Times Drop 30%', category: 'animals_cute', tags: ['therapy', 'hospital'] },
  { id: 'ac09', headline: 'Baby Otter Learns to Swim: Adorable Video Hits 100M Views', category: 'animals_cute', tags: ['otter', 'viral'] },
  { id: 'ac10', headline: 'Deaf Dog Learns Sign Language, Responds to 50 Commands', category: 'animals_cute', tags: ['deaf', 'sign language'] },
  { id: 'ac11', headline: 'Penguin Walks Into Local Bar, Refuses to Leave', category: 'animals_cute', tags: ['penguin', 'funny'] },
  { id: 'ac12', headline: 'Shelter Adopts Out Every Single Animal in Record-Breaking Day', category: 'animals_cute', tags: ['shelter', 'adoption'] },
  { id: 'ac13', headline: 'Cat Rings Doorbell to Get Inside, Security Camera Captures Moment', category: 'animals_cute', tags: ['cat', 'smart'] },
  { id: 'ac14', headline: 'Baby Elephant Chases Birds and Falls Over, Keeper Shares Video', category: 'animals_cute', tags: ['elephant', 'baby'] },
  { id: 'ac15', headline: 'Worlds Ugliest Dog Winner Becomes Internet Celebrity', category: 'animals_cute', tags: ['contest', 'viral'] },
  { id: 'ac16', headline: 'Stray Dog Adopted by Fire Station Becomes Official Mascot', category: 'animals_cute', tags: ['dog', 'fire station'] },
  { id: 'ac17', headline: 'Two-Legged Cat Walks Perfectly, Inspires Millions Online', category: 'animals_cute', tags: ['cat', 'inspiration'] },
  { id: 'ac18', headline: 'Gorilla Gently Returns Toddlers Dropped Toy at Zoo', category: 'animals_cute', tags: ['gorilla', 'gentle'] },
  { id: 'ac19', headline: 'Golden Retriever Befriends Every Animal on Farm', category: 'animals_cute', tags: ['retriever', 'farm'] },
  { id: 'ac20', headline: 'Cat Mayor Re-Elected for Third Term in Small Alaska Town', category: 'animals_cute', tags: ['cat', 'mayor'] },
  { id: 'ac21', headline: 'Rabbit and Cat Cuddle Session Video Gets 200 Million Views', category: 'animals_cute', tags: ['rabbit', 'viral'] },
  { id: 'ac22', headline: 'Service Dog Saves Owner from Oncoming Traffic, Hero Status Earned', category: 'animals_cute', tags: ['service dog', 'hero'] },
  { id: 'ac23', headline: 'Baby Sloth Yawning Is the Most Watched Animal Video This Year', category: 'animals_cute', tags: ['sloth', 'viral'] },
  { id: 'ac24', headline: 'Dog Reunited with Owner After 3 Years: Emotional Airport Moment', category: 'animals_cute', tags: ['reunion', 'emotional'] },
  { id: 'ac25', headline: 'Parrot Perfectly Mimics Owners Laugh, Video Goes Mega Viral', category: 'animals_cute', tags: ['parrot', 'funny'] },

  // ═══════════════════════════════════════════════════════════════
  // ANIMALS - WILD (~20)
  // ═══════════════════════════════════════════════════════════════
  { id: 'aw01', headline: 'Octopus Escapes Aquarium Tank Through Tiny Drain Pipe', category: 'animals_wild', tags: ['octopus', 'escape'] },
  { id: 'aw02', headline: 'Scientists Discover Deep Sea Fish with Transparent Head', category: 'animals_wild', tags: ['fish', 'discovery'] },
  { id: 'aw03', headline: 'Great White Shark Tracked Swimming Across Entire Ocean', category: 'animals_wild', tags: ['shark', 'migration'] },
  { id: 'aw04', headline: 'New Species of Dinosaur Discovered in Unexpected Location', category: 'animals_wild', tags: ['dinosaur', 'discovery'] },
  { id: 'aw05', headline: 'Wolves Return to Region After 100-Year Absence', category: 'animals_wild', tags: ['wolves', 'conservation'] },
  { id: 'aw06', headline: 'Crow Solves Complex Puzzle That Stumped Researchers', category: 'animals_wild', tags: ['crow', 'intelligence'] },
  { id: 'aw07', headline: 'Whale Spotted in River 1000 Miles from Ocean Baffles Scientists', category: 'animals_wild', tags: ['whale', 'mystery'] },
  { id: 'aw08', headline: 'Ants Build Bridge from Their Own Bodies to Cross Gap', category: 'animals_wild', tags: ['ants', 'behavior'] },
  { id: 'aw09', headline: 'Previously Extinct Species Found Alive in Remote Jungle', category: 'animals_wild', tags: ['extinct', 'discovery'] },
  { id: 'aw10', headline: 'Dolphins Use Names to Call Each Other, Scientists Confirm', category: 'animals_wild', tags: ['dolphins', 'language'] },
  { id: 'aw11', headline: 'Eagle Catches Shark in Incredible Photo Captured by Fisherman', category: 'animals_wild', tags: ['eagle', 'shark'] },
  { id: 'aw12', headline: 'Tree That Lived for 5,000 Years Finally Dies from Drought', category: 'animals_wild', tags: ['tree', 'ancient'] },
  { id: 'aw13', headline: 'Jellyfish That Is Biologically Immortal Found in New Habitat', category: 'animals_wild', tags: ['jellyfish', 'immortal'] },
  { id: 'aw14', headline: 'Mountain Lion Walks Through Downtown LA at 3 AM', category: 'animals_wild', tags: ['mountain lion', 'urban'] },
  { id: 'aw15', headline: 'Spiders Found Working Together to Build Giant Communal Web', category: 'animals_wild', tags: ['spiders', 'social'] },
  { id: 'aw16', headline: 'Deep Ocean Creature Discovered That Is 90% Water', category: 'animals_wild', tags: ['deep sea', 'discovery'] },
  { id: 'aw17', headline: 'Elephant Herd Mourns Dead Family Member in Touching Ritual', category: 'animals_wild', tags: ['elephant', 'emotion'] },
  { id: 'aw18', headline: 'New Frog Species Discovered That Is Smaller Than a Grain of Rice', category: 'animals_wild', tags: ['frog', 'tiny'] },
  { id: 'aw19', headline: 'Ravens Proven to Plan for the Future, Rivaling Great Apes', category: 'animals_wild', tags: ['raven', 'intelligence'] },
  { id: 'aw20', headline: 'Colossal Squid Filmed Alive for Only the Third Time in History', category: 'animals_wild', tags: ['squid', 'rare'] },
];

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

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

// Generate content queue for a participant (legacy, used by debug mode)
export function generateContentQueue(count: number = 40): ContentItem[] {
  const shuffled = shuffleArray(contentPool);
  const categoryGroups = ['politics', 'tech', 'entertainment', 'science', 'sports', 'lifestyle', 'finance', 'animals'];
  const diverseStart: ContentItem[] = [];
  const remaining = [...shuffled];

  for (const group of categoryGroups) {
    const index = remaining.findIndex(item => getCategoryGroup(item.category) === group);
    if (index !== -1) {
      diverseStart.push(remaining[index]);
      remaining.splice(index, 1);
    }
  }

  const finalQueue = [...shuffleArray(diverseStart), ...shuffleArray(remaining)];
  return finalQueue.slice(0, count);
}

// ═══════════════════════════════════════════════════════════════
// RECOMMENDATION ENGINE - Creates the filter bubble
// ═══════════════════════════════════════════════════════════════
//
// Implements the core algorithmic principles:
//
// 1. EXPLORATION PHASE (cards 1-8): Diverse content from each category
//    → Everyone starts with the same "shared reality"
//
// 2. EXPLOITATION PHASE (cards 9+): Weighted toward liked categories
//    → The feedback loop kicks in:
//    → Like tech → see more tech → like more tech → ONLY see tech
//
// 3. COMPOUNDING BIAS: Amplification factor INCREASES over time
//    → Early choices have disproportionate impact
//    → By card 20, you're deep in your bubble
//
// 4. IMPLICIT SIGNALS: Skips actively suppress categories
//    → Not just "show more of what I like"
//    → Also "hide what I didn't engage with"
//
// The result: identical starting points → fragmented realities
// ═══════════════════════════════════════════════════════════════

const ALL_GROUPS = ['politics', 'tech', 'entertainment', 'science', 'sports', 'lifestyle', 'finance', 'animals'];

export function getNextRecommendedCard(
  pastChoices: { contentId: string; action: 'like' | 'skip' }[],
  seenIds: Set<string>
): ContentItem | null {
  const unseen = contentPool.filter(item => !seenIds.has(item.id));
  if (unseen.length === 0) return null;

  // ─── PHASE 1: EXPLORATION (first 8 cards) ───
  // Show one card from each category group for a fair, diverse start.
  // This mirrors the "everyone starts equal" principle.
  if (pastChoices.length < 8) {
    const seenGroups = new Set<string>();
    for (const id of seenIds) {
      const item = contentPool.find(c => c.id === id);
      if (item) seenGroups.add(getCategoryGroup(item.category));
    }

    const unseenGroups = ALL_GROUPS.filter(g => !seenGroups.has(g));
    if (unseenGroups.length > 0) {
      const targetGroup = unseenGroups[Math.floor(Math.random() * unseenGroups.length)];
      const candidates = unseen.filter(item => getCategoryGroup(item.category) === targetGroup);
      if (candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)];
      }
    }
    // Fallback if all groups already seen
    return unseen[Math.floor(Math.random() * unseen.length)];
  }

  // ─── PHASE 2: EXPLOITATION (cards 9+) — THE FILTER BUBBLE ───
  //
  // Build a preference profile from likes AND skips.
  // Likes boost a category. Skips suppress it.
  // The amplification factor grows as more choices are made,
  // creating the compounding bias (Principle 3).

  const choiceCount = pastChoices.length;

  // Amplification factor: starts at 2x, grows to 5x by card 40
  // This means early likes are worth 2 points, late likes worth 5
  const amplification = 2 + (choiceCount / 40) * 3;

  // Count likes and skips per category group
  const groupLikes: Record<string, number> = {};
  const groupSkips: Record<string, number> = {};

  for (const choice of pastChoices) {
    const item = contentPool.find(c => c.id === choice.contentId);
    if (!item) continue;
    const group = getCategoryGroup(item.category);

    if (choice.action === 'like') {
      groupLikes[group] = (groupLikes[group] || 0) + 1;
    } else {
      groupSkips[group] = (groupSkips[group] || 0) + 1;
    }
  }

  // Calculate weights for each category group
  const groupWeights: Record<string, number> = {};

  for (const group of ALL_GROUPS) {
    const likes = groupLikes[group] || 0;
    const skips = groupSkips[group] || 0;

    if (likes === 0 && skips === 0) {
      // Never seen this category: small chance (exploration leak)
      groupWeights[group] = 0.5;
    } else if (likes === 0) {
      // Only skipped: almost never show again
      groupWeights[group] = 0.05;
    } else {
      // Liked at least once: boost with compounding amplification
      // More likes = exponentially more likely to see more
      groupWeights[group] = likes * amplification - skips * 0.5;
      // Floor at 0.1 so categories can still occasionally appear
      groupWeights[group] = Math.max(0.1, groupWeights[group]);
    }
  }

  // Score each unseen item using its category weight
  const scored = unseen.map(item => {
    const group = getCategoryGroup(item.category);
    const weight = groupWeights[group] || 0.5;

    // Add subcategory bonus: if the user liked this exact subcategory, extra boost
    const subCategoryLikes = pastChoices.filter(c => {
      const ci = contentPool.find(x => x.id === c.contentId);
      return ci && ci.category === item.category && c.action === 'like';
    }).length;
    const subBonus = subCategoryLikes * (amplification * 0.5);

    // Small random jitter prevents perfectly deterministic feeds
    const jitter = Math.random() * 1.5;

    return { item, score: weight + subBonus + jitter };
  });

  scored.sort((a, b) => b.score - a.score);

  // Pick from top 3 to maintain tiny sliver of variety
  // (Real algorithms do this too — pure exploitation kills engagement)
  const topN = Math.min(3, scored.length);
  return scored[Math.floor(Math.random() * topN)].item;
}
