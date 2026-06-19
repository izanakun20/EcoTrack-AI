export const environmentalTips = [
  {
    id: 1,
    title: "Carbon Absorption by Trees",
    fact: "A single mature tree absorbs about 21.8 kg (48 lbs) of CO2 per year and releases enough oxygen to support two human beings.",
    action: "Planting native trees or contributing to urban reforestation directly offsets emissions."
  },
  {
    id: 2,
    title: "Vampire Power Draw",
    fact: "Electronics consume energy even when turned off but plugged in. This 'phantom' or 'vampire' load accounts for 5-10% of household electricity.",
    action: "Use power strips that you can toggle off when going to sleep or leaving the house."
  },
  {
    id: 3,
    title: "Cold Water Laundry",
    fact: "About 75% to 90% of all the energy your washing machine uses goes towards heating the water.",
    action: "Wash your laundry in cold water. It is just as clean and prevents microfabric wear!"
  },
  {
    id: 4,
    title: "Food Mileage Impact",
    fact: "The average meal travels over 2,400 km (1,500 miles) from farm to plate, contributing heavily to transit emissions.",
    action: "Support local farmers' markets and buy seasonal produce to reduce transportation impact."
  },
  {
    id: 5,
    title: "Low Tire Pressure Fuel Waste",
    fact: "Under-inflated tires increase fuel consumption because of higher rolling resistance, increasing emissions by up to 3%.",
    action: "Check your car's tire pressure monthly to save money on gas and lower carbon footprint."
  },
  {
    id: 6,
    title: "Plastic Decomposition",
    fact: "Plastic water bottles take up to 450 years to decompose. The energy used to produce bottled water in the US alone could fuel 1 million cars.",
    action: "Switch to a stainless steel reusable water bottle and save over 150 single-use bottles a year."
  },
  {
    id: 7,
    title: "AC Efficiency Tips",
    fact: "For every degree you raise your AC temperature above 22°C (71°F), you save approximately 3-5% on energy usage.",
    action: "Set your AC thermostat to 24°C or 25°C and use ceiling fans to keep air moving."
  },
  {
    id: 8,
    title: "The Power of Diet",
    fact: "The livestock sector is responsible for nearly 14.5% of human-induced greenhouse gases globally, with beef producing 10x more emissions than poultry.",
    action: "Substitute beef or lamb for chicken, fish, or plant-based proteins to instantly reduce dietary emissions."
  }
];

export const initialChallenges = [
  {
    id: "challenge-plastic",
    title: "Zero Waste Day",
    description: "Avoid single-use plastics for 24 hours (no plastic bags, bottles, straws, or takeout containers).",
    points: 50,
    category: "waste",
    difficulty: "Easy",
    icon: "Trash2",
    completed: false,
  },
  {
    id: "challenge-transit",
    title: "Eco Commuter",
    description: "Use public transport, carpool, walk, or cycle to work or school instead of driving alone.",
    points: 100,
    category: "transport",
    difficulty: "Medium",
    icon: "Bus",
    completed: false,
  },
  {
    id: "challenge-power",
    title: "Blackout Hour",
    description: "Unplug all non-essential electronics and appliances for at least two hours today.",
    points: 50,
    category: "energy",
    difficulty: "Easy",
    icon: "ZapOff",
    completed: false,
  },
  {
    id: "challenge-veggie",
    title: "Meatless Monday",
    description: "Eat purely vegetarian or vegan meals for an entire day to reduce diet footprint.",
    points: 50,
    category: "food",
    difficulty: "Easy",
    icon: "Leaf",
    completed: false,
  },
  {
    id: "challenge-tree",
    title: "Urban Greenery",
    description: "Plant a sapling, seed some herbs in pots, or volunteer for local park cleanup.",
    points: 200,
    category: "community",
    difficulty: "Hard",
    icon: "TreePine",
    completed: false,
  },
  {
    id: "challenge-cold-wash",
    title: "Chilly Wash",
    description: "Wash two full loads of laundry in cold water instead of hot or warm.",
    points: 50,
    category: "energy",
    difficulty: "Easy",
    icon: "Wind",
    completed: false,
  },
  {
    id: "challenge-walk",
    title: "Stroll 5K",
    description: "Walk or run a total of 5 km today instead of taking short vehicle trips.",
    points: 100,
    category: "transport",
    difficulty: "Medium",
    icon: "Activity",
    completed: false,
  }
];

export const badgesList = [
  {
    id: "badge-beginner",
    title: "Green Beginner",
    description: "Completed your first carbon footprint calculation.",
    icon: "Compass",
    requirementText: "Complete 1st calculation",
    color: "from-sky-500 to-blue-600",
    unlocked: false
  },
  {
    id: "badge-explorer",
    title: "Eco Explorer",
    description: "Attained a carbon score of 60 or above.",
    icon: "Compass",
    requirementText: "Carbon Score >= 60",
    color: "from-teal-400 to-emerald-500",
    unlocked: false
  },
  {
    id: "badge-crusher",
    title: "Carbon Crusher",
    description: "Committed to at least 2 active reduction goals.",
    icon: "TrendingDown",
    requirementText: "Commit to 2 goals",
    color: "from-violet-500 to-indigo-600",
    unlocked: false
  },
  {
    id: "badge-defender",
    title: "Climate Defender",
    description: "Completed at least 3 ecological challenges.",
    icon: "Shield",
    requirementText: "Complete 3 challenges",
    color: "from-emerald-500 to-green-600",
    unlocked: false
  },
  {
    id: "badge-master",
    title: "Sustainability Master",
    description: "Attained a carbon score of 85+ and completed 5 challenges.",
    icon: "Zap",
    requirementText: "Score >= 85 & 5 challenges",
    color: "from-amber-400 to-amber-600",
    unlocked: false
  },
  {
    id: "badge-guardian",
    title: "Earth Guardian",
    description: "Attained a carbon score of 90+, completed 7 challenges, and committed to 3 goals.",
    icon: "Award",
    requirementText: "Score 90+, 7 challenges & 3 goals",
    color: "from-rose-500 to-red-600",
    unlocked: false
  }
];

export const defaultState = {
  hasCalculated: false,
  inputs: {
    carTravel: 15,
    bikeTravel: 5,
    publicTransport: 10,
    flights: 2,
    electricity: 280,
    acUsage: 4,
    foodHabit: "mixed",
    plasticUsage: "medium",
    shoppingFrequency: "average"
  },
  history: [
    { month: "Jan", emissions: 8.5 },
    { month: "Feb", emissions: 8.2 },
    { month: "Mar", emissions: 7.9 },
    { month: "Apr", emissions: 7.4 },
    { month: "May", emissions: 7.0 },
    { month: "Jun", emissions: 6.8 }
  ],
  points: 0,
  completedChallengesCount: 0,
  goals: {
    targetEmissions: 5.0, // annual tons target
    targetDate: "2026-12-31"
  }
};
