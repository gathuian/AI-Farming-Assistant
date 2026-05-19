import { BlogPost, CommunityQuestion } from './types';

// Preset Crops Data (Plant Farming)
export interface CropPreset {
  id: string;
  name: string;
  bestClimate: string;
  cycle: string;
  idealSoil: string;
  steps: { title: string; desc: string }[];
  diseases: { name: string; symptoms: string; prevention: string }[];
  harvesting: string;
  marketing: string;
  valueAddition: string;
}

export const CROP_PRESETS: CropPreset[] = [
  {
    id: 'tomatoes',
    name: '🍅 Tomato Farming',
    bestClimate: 'Warm and sunny (15°C - 30°C), sensitive to frost',
    cycle: '3 to 4 months from seed to harvest',
    idealSoil: 'Rich sandy loam or loamy soil, well-draining, pH 6.0 - 6.8',
    steps: [
      { title: '1. Nursery Setup', desc: 'Sow seeds in trays or flat beds with soft, fertile soil. Keep wet but not mud-flooded. Transplant in 3-4 weeks when sprouts are 15cm tall.' },
      { title: '2. Planting in Bed', desc: 'Space seedlings 45cm apart in rows 60cm wide. Water the ground deeply at the root zone, never on the wet leaves to prevent rot.' },
      { title: '3. Staking & Pruning', desc: 'Tie plants to strong wood stakes with soft strings to keep fruit off the dirty soil. Shoot off side-suckers to grow larger tomatoes.' },
      { title: '4. Feeding the Soil', desc: 'Add organic compost or manure when preparing the bed. Feed again with potash or calcium when yellow flowers begin to show.' }
    ],
    diseases: [
      { name: 'Late Blight (Mold)', symptoms: 'Dark wet brownish spots on leaves, gray white powder underneath leaves in damp weather.', prevention: 'Spray natural copper fungicide early, prune lower leaves to improve airflow, and avoid watering leaves late in the evening.' },
      { name: 'Blossom End Rot (Black Bottoms)', symptoms: 'Water-soaked black leathery patches at the bottom of ripening tomatoes.', prevention: 'Add calcium-rich lime or eggshells to the dirt, and water consistently—do not let soil dry out completely then flood it.' },
      { name: 'Tomato Wilt (Bacteria)', symptoms: 'Rapid wilting of entire branches or plants while green, starting from the top down.', prevention: 'Only buy certified disease-free seeds, never plant tomatoes where potatoes or peppers grew last year.' }
    ],
    harvesting: 'Harvest when tomatoes turn light pink or red. Pick carefully with stems attached to keep them fresh longer. Avoid crushing the skin.',
    marketing: 'Sell directly to local vegetable markets, secure contracts with schools/hotels, or supply to tomato paste and sauce makers.',
    valueAddition: 'Process surplus into Tomato Paste, Sun-dried Tomatoes, or Homemade Ketchup. This extends storage life from 1 week to over 6 months.'
  },
  {
    id: 'maize',
    name: '🌽 Maize & Corn Farming',
    bestClimate: 'Sunny weather with moderate rain, sensitive to drought during tassel',
    cycle: '4 to 6 months depending on variety',
    idealSoil: 'Deep, rich loamy soil with plenty of organic matter, pH 5.5 - 7.0',
    steps: [
      { title: '1. Seedbed Preparation', desc: 'Plough the soil well before the rain starts. Break large soil lumps to make a soft bed so seeds can germinate easily.' },
      { title: '2. Planting Seeds', desc: 'Plant seeds 2-3cm deep. Space them 30cm apart in rows that are 75cm wide, ensuring perfect rows for ease of weeding.' },
      { title: '3. Weeding Cycles', desc: 'Perform the first weeding 2 weeks after corn sprouts. Grass will steal food and water from your corn if left unchecked.' },
      { title: '4. Watering & Nitrogen', desc: 'Add nitrogen-rich manure or compost when the plants are knee-high. Maize needs maximum water during the tasseling stage.' }
    ],
    diseases: [
      { name: 'Maize Streak Virus', symptoms: 'Yellow streaks running along the leaves, stunted plant height, small or empty cobs.', prevention: 'Plant certified virus-resistant maize varieties and control sap-sucking insects (leafhoppers) early in the growth stage.' },
      { name: 'Gray Leaf Spot', symptoms: 'Pale rectangular light-brown spots between leaf veins. Leaves look dry and scorched.', prevention: 'Invert soil to bury crop debris after harvest, rotate maize with beans or sunflowers to break the disease cycle.' }
    ],
    harvesting: 'Harvest when leaves turn yellow-brown (dry). Check that the corn grain is hard, and the black spot at the grain base is visible.',
    marketing: 'Sell dry shelled grain to national grain boards, millers, or package it locally as flour for porridge and meal core recipes.',
    valueAddition: 'Mill the dried kernels to make Premium Maize Flour, or compress leftover dry stalks into bio-gas fuel pellets or compost bedding.'
  },
  {
    id: 'potatoes',
    name: '🥔 Potato Farming',
    bestClimate: 'Cool highland climate (15°C - 20°C). Tuber formation fails in high heat.',
    cycle: '3 to 4 months from planting seeds (tubers)',
    idealSoil: 'Loose, sandy loams that allow roots to breathe, pH 5.0 - 6.0 (acidic)',
    steps: [
      { title: '1. Seed Tubers Prep', desc: 'Select small, healthy seed potatoes with active green sprouts (eyes). Keep in light to pre-sprout before planting.' },
      { title: '2. Ridging & Planting', desc: 'Dig trenches 15cm deep. Place sprouted potatoes eyes-up, 30cm apart. Cover lightly with 10cm of soft soil.' },
      { title: '3. Earthing Up (Hilling)', desc: 'As stems grow, pull loose soil up around the plant stem using a hoe. This prevents light from touching growing potatoes, which turns them green and bitter.' },
      { title: '4. Care & Irrigation', desc: 'Keep watering consistent. Avoid over-watering as wet mud turns potatoes rotten and causes fungal rot in the soil.' }
    ],
    diseases: [
      { name: 'Potato Scab (Rough Skin)', symptoms: 'Brown corky ulcers or dark rough warts on the potato skin.', prevention: 'Keep soil moist during tuber formation. Plant scab-resistant seeds, and keep soil pH acidic (below 5.5).' },
      { name: 'Early Blight', symptoms: 'Dark brown circles resembling target boards on older leaves. Leaves turn dry and drop off.', prevention: 'Prune dead leaves, leave enough spacing between plants for wind to dry leaves, and do not reuse potato soil for 3 years.' }
    ],
    harvesting: 'Cut the green plant tops 2 weeks before harvesting to harden the potato skins. Carefully dig using a hand fork to avoid cutting tubers.',
    marketing: 'Sell clean, sorted potatoes by weight directly to chip-making factories, local food markets, or wholesale traders.',
    valueAddition: 'Dry potatoes to make Potato Flour/Starch, or process them into packaged Potato Crisps/Chips to double your earnings.'
  }
];

// Preset Animals Data (Animal Farming)
export interface LivestockPreset {
  id: string;
  name: string;
  breeds: string[];
  climateLimit: string;
  vaccines: { age: string; treatment: string; details: string }[];
  vulnerabilities: { disease: string; signs: string; actions: string }[];
  yieldExpectations: string;
  keySteps: { phase: string; details: string }[];
  futureTrends: string;
  infrastructure: string;
}

export const LIVESTOCK_PRESETS: LivestockPreset[] = [
  {
    id: 'poultry',
    name: '🐔 Poultry & Chicken Farming',
    breeds: ['Kuroiler (Fast growing, dual utility)', 'Layers (High egg count, sensitive)', 'Broilers (Rapid meat growth, needs heavy feed)', 'Indigenous Keenye (Extremely hardy, slower growth)'],
    climateLimit: 'Warm (18°C - 24°C). Cold causes huddling and pneumonia; extreme heat can lead to heat exhaustion and sudden death.',
    vaccines: [
      { age: 'Day 1', treatment: 'Marek\'s disease vaccine', details: 'Injectable given at hatchery level' },
      { age: 'Week 1 to 2', treatment: 'Gumboro (IBD) vaccine', details: 'Delivered in clean non-chlorinated drinking water' },
      { age: 'Week 3 to 4', treatment: 'Newcastle Disease vaccine', details: 'Eye drops or drinking water, repeat every 3 months' },
      { age: 'Week 6', treatment: 'Fowl Pox vaccine', details: 'Wing-web needle puncture application' }
    ],
    vulnerabilities: [
      { disease: 'Coccidiosis (Bloody Poop)', signs: 'Chicks look weak, feathers fluffed, sitting on huddles with bloody red run-down droppings.', actions: 'Use anti-coccidial medicated starter feed. Keep the drinking area completely dry, and change wet saw-dust bedding immediately.' },
      { disease: 'Newcastle Disease', signs: 'Greenish watery diarrhea, twists in the neck, gasping for breath, coughing, sudden high mortality.', actions: 'No cure. Vaccinate strictly on schedule. Quarantine sick birds immediately in separate spaces.' }
    ],
    yieldExpectations: 'Layers yield 280-320 eggs per year. Broilers yield marketable 1.8kg - 2.2kg weight in 4-6 weeks under intensive feeding.',
    keySteps: [
      { phase: '1. Brooder Prep', details: 'Disinfect the room. Put warm wood shavings on the floor. Hang heat bulbs to keep chicks warm (32°C). Feed with chick starter.' },
      { phase: '2. Feeding Transition', details: 'Switch broilers to finisher pellets at 4 weeks. Switch layers to growers mash, then layers mash at 18 weeks before laying.' },
      { phase: '3. Bio-security', details: 'Add a foot-bath disinfectant tray at the doorway. Wash hands and boots before entering to prevent importing viruses.' }
    ],
    futureTrends: 'Use of black soldier fly larvae as a low-cost high-protein feed substitute to chop poultry feed costs by up to 40%.',
    infrastructure: 'Spacious coop with dry draft-free ventilation, solid clean egg boxes, hanging tube feeders, and secure drinkers.'
  },
  {
    id: 'dairy_cattle',
    name: '🐄 Dairy Cattle Farming',
    breeds: ['Holstein Friesian (Huge milk yield, heavy eater)', 'Jersey (Rich buttery milk, needs less feed, hardy)', 'Ayrshire (High quality milk, disease resistant)', 'Guernsey (Yellow gold creamy milk, friendly)'],
    climateLimit: 'Cooler regions are best (12°C - 22°C). High temperatures cause severe heat stress, reducing milk volume and breeding rates.',
    vaccines: [
      { age: '6 Months', treatment: 'Brucellosis (Abortion sickness)', details: 'One-time vaccine for dairy female calves only' },
      { age: 'Yearly (Rain prep)', treatment: 'Foot & Mouth Disease (FMD)', details: 'Injection given before wet seasons start' },
      { age: 'Yearly', treatment: 'Anthrax & Black Quarter (BQ)', details: 'Crucial combined safety injection' }
    ],
    vulnerabilities: [
      { disease: 'Mastitis (Teat Infection)', signs: 'Swollen, painful, hard hot udders. Milk contains blood clots, flakes, or watery fluid.', actions: 'Wash hands, use a clean teat-dip antiseptic cup before and after milking. Keep cow bed dry and clean.' },
      { disease: 'East Coast Fever (Tick Borne)', signs: 'High fever, hard breathing, swelling of fluid nodes under ear, froth running from nose.', actions: 'Control ticks by spraying or dipping cows in chemical acaricides weekly. Treat with anti-protozoal medicines immediately.' }
    ],
    yieldExpectations: 'Average Friesian yields 20 to 35 Liters of milk daily under high-quality fodder (silage, hay, and dairy concentrates).',
    keySteps: [
      { phase: '1. Calf Care', details: 'Ensure newborn takes colostrum milk in the first 2 hours for natural immune defense. Feed clean milk for 3 months.' },
      { phase: '2. Zero-Grazing Feed', details: 'Chop napier grass, maize silage, and lucerne clover with feed grinders to maximize nutrient absorption and reduce waste.' },
      { phase: '3. Clean Milking', details: 'Massage udder with warm water to release milk. Use strip cup to test for mastitis first, milk carefully, then dip teats in iodine.' }
    ],
    futureTrends: 'Utilizing solar-powered refrigeration milk coolers on small farms to eliminate evening milk spoilage before collection.',
    infrastructure: 'Zero-grazing unit with separate sleeping stalls, soft padded manure-free bedding, feed troughs, clean water troughs, and milking parlor.'
  }
];

// Farming Do's and Don'ts for Low-Literacy Users (Human-friendly instructions)
export const DOS_AND_DONTS = {
  dos: [
    { rule: '💧 Water from the roots', explanation: 'Water the dirt at the base of the plant, not the green leaves. Wet leaves invite fungi, rust, and leaf-rot diseases which feed on moisture.' },
    { rule: '🧹 Keep animal housing bone-dry', explanation: 'Wet sawdust bedding or damp mud floor is where bacteria grow. Dry housing protects animals from pneumonia and foot rot diseases.' },
    { rule: '📝 Write down your expenses', explanation: 'Keep a notebook of feed, seed, fuel, and vaccine spending. You cannot know if you made a profit without simple records!' },
    { rule: '🥾 Use visitor foot-baths', explanation: 'Put a plastic tub with disinfectant water at the door of your poultry or dairy unit. Visitors boots bring invisible germ killers.' },
    { rule: '🔄 Rotate your crops', explanation: 'Never plant tomatoes, potatoes, or peppers in the same spot twice in a row. Swap them with beans or sunflowers to starve soil bugs.' }
  ],
  donts: [
    { rule: '🚫 Do not buy unregistered seeds', explanation: 'Cheap seeds saved from last year\'s crop might carry active viruses and often produce small or diseased yields. Buy certified seeds.' },
    { rule: '🚫 Do not spray chemicals when windy', explanation: 'Wind carries target pesticides onto neighboring fields, hives, or water sources, wasting money and turning wild pollinators sour.' },
    { rule: '🚫 Do not squeeze sick cattle udder', explanation: 'Milking a cow with mastitis with dirty hands spreads the infection to healthy cows. Milk the sick cow last, then wash hands well.' },
    { rule: '🚫 Do not wait for disease to vaccinate', explanation: 'Vaccines are clean shields, not medicines. They will not save animals that are already sick! Inject on a strict calendar before infections arrive.' },
    { rule: '🚫 Do not sell all milk raw instantly', explanation: 'Raw milk spoils inside 4 hours without refrigerators. Value-adding (making yoghurt) lets you store it overnight and sell at double price.' }
  ]
};

// Initial Farmer Blogs (Discussion Board)
export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog_1',
    title: 'How I Reduced My Chicken Feed Cost by 35% using Black Soldier Fly Larvae',
    author: 'Mama Sarah (Njoro Highlands)',
    content: 'Feeding chickens is the biggest expense for small-scale poultry farmers. Last year, feed prices went up, and I was losing my savings. I joined a training on cultivating Black Soldier Fly (BSF) larvae. These larvae eat raw organic waste, fruit skins, and left-over kitchen starch, and transform it into rich, wriggly protein worm feeds. My chicken egg producción increased, and their yolks are now deeply orange and firm. It operates on self-harvesting buckets, and the hens love the live worms! Any beginner can set this up with a standard plastic barrel.',
    category: 'livestock',
    image: 'https://images.unsplash.com/photo-1518013002798-e0377dbad8b7?auto=format&fit=crop&w=600&q=80',
    likes: 42,
    comments: [
      { id: 'c_1', author: 'Baba Jose', comment: 'Where can I get the initial larvae eggs? Do they invite smelly house flies?', createdAt: '2026-05-18T10:00:00Z' },
      { id: 'c_2', author: 'Mama Sarah', comment: 'BSF do not have mouths, so they do not eat or spread diseases like houseflies. They lay eggs in dry wooden slats above compost!', createdAt: '2026-05-18T14:30:00Z' }
    ],
    createdAt: '2026-05-15T09:00:00Z'
  },
  {
    id: 'blog_2',
    title: 'Easy Method for Preparing High Yield Compost Bedding',
    author: 'Farmer David (Meru Valleys)',
    content: 'To grow massive tomatoes or healthy cabbage, don\'t buy expensive chemicals first. Feed your dirt! I prepare compost using dry maize stalks, green leaves, cow dung, and wood ashes. Every Sunday I turn the pile and spray a bucket of water. In 6 weeks, it turns into rich dark, sweet-smelling earth. Putting two handfuls of this into every tomato planting hole shields them from early wilts and doubles root volume. Clean earth equals high profits.',
    category: 'crop',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80',
    likes: 31,
    comments: [
      { id: 'c_3', author: 'Agatha K.', comment: 'Can I add citrus orange skins to my compost pile?', createdAt: '2026-05-16T11:15:00Z' }
    ],
    createdAt: '2026-05-14T11:20:00Z'
  }
];

export const INITIAL_QUESTIONS: CommunityQuestion[] = [
  {
    id: 'q_1',
    topic: 'My tomatoes are turning black at the bottom. What should I spray?',
    question: 'The tomatoes look healthy, but just as they ripen, the butt-end turns dark, hard, and leathery. I sprayed pesticide but it did not stop. Please help!',
    author: 'Wastewater Dan',
    answers: [
      { id: 'a_1', author: 'Farmer Jane', answer: 'That is Blossom End Rot, not an insect! It means your soil is missing calcium or you are watering badly (dry soil then too wet). Put eggshells in the dirt and water evenly.', likes: 18, createdAt: '2026-05-18T15:00:00Z' }
    ],
    createdAt: '2026-05-18T08:00:00Z'
  },
  {
    id: 'q_2',
    topic: 'How to make cows drink more water in hot weather',
    question: 'My milking cattle reduce drinking when the midday heat is heavy. Consequently, my evening milk collection drops drastically.',
    author: 'Sammy Dairy',
    answers: [
      { id: 'a_2', author: 'Veterinary Pius', answer: 'Cows dislike warm, stale water. Put shade sails over water bins, or scrub the water troughs to remove slimy moss. Add a pinch of normal salt to their dairy lick feeds to trigger natural thirst.', likes: 12, createdAt: '2026-05-17T18:30:00Z' }
    ],
    createdAt: '2026-05-17T12:00:00Z'
  }
];
