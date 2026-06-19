import { calculateScore } from "./calculations";

/**
 * Advanced Local AI Engine for EcoTrack AI
 * No external API dependencies. Low latency, 100% private.
 */

/**
 * Sustainability Decision Engine
 * Automatically classifies users, analyzes their primary emission drivers,
 * ranks recommendations by impact, and generates customized reasoning plans.
 */
export function runSustainabilityDecisionEngine(inputs, results) {
  const carTravel = inputs?.carTravel || 0;
  const bikeTravel = inputs?.bikeTravel || 0;
  const publicTransport = inputs?.publicTransport || 0;
  const flights = inputs?.flights || 0;
  const electricity = inputs?.electricity || 0;
  const acUsage = inputs?.acUsage || 0;
  const foodHabit = inputs?.foodHabit || 'mixed';
  const plasticUsage = inputs?.plasticUsage || 'medium';
  const shoppingFrequency = inputs?.shoppingFrequency || 'average';

  // Fallback defaults if calculations have not run yet
  const { breakdown = { transportation: 3200, energy: 2100, food: 1100, lifestyle: 400 }, annualTotalTons = 6.8 } = results || {};

  const { transportation = 0, energy = 0, food = 0, lifestyle = 0 } = breakdown;
  const total = Math.max(1, transportation + energy + food + lifestyle);

  const transPct = Math.round((transportation / total) * 100);
  const energyPct = Math.round((energy / total) * 100);
  const foodPct = Math.round((food / total) * 100);
  const lifePct = Math.round((lifestyle / total) * 100);

  const score = Math.max(0, Math.min(100, Math.round(100 - (annualTotalTons / 18) * 100)));

  // 1. Sustainability Persona Classification
  let persona = {
    name: "Green Beginner",
    icon: "Leaf",
    color: "from-slate-400 to-slate-500 bg-slate-500/10 text-slate-400 border-slate-500/25",
    desc: "You are just beginning your eco journey. There are many easy, low-hanging fruits to start reducing your daily carbon load."
  };

  if (score >= 85) {
    persona = {
      name: "Sustainability Champion",
      icon: "Trophy",
      color: "from-amber-400 to-amber-600 bg-amber-500/10 text-amber-400 border-amber-500/25",
      desc: "You have achieved an exceptional eco-score! Your habits are highly sustainable, and you are leading the way to a cooler planet."
    };
  } else if (score >= 65) {
    persona = {
      name: "Eco Explorer",
      icon: "Compass",
      color: "from-teal-400 to-emerald-500 bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
      desc: "You maintain a solid environmental profile. With a few minor adjustments to your daily routines, you can reach champion status."
    };
  } else if (transportation > energy && transportation > food && transportation > lifestyle) {
    persona = {
      name: "Carbon Heavy Commuter",
      icon: "Car",
      color: "from-sky-400 to-blue-600 bg-sky-500/10 text-sky-400 border-sky-500/25",
      desc: "Your primary emission driver is transportation (commutes or flights). Focus on transit alternatives and virtual options."
    };
  } else if (energy > transportation && energy > food && energy > lifestyle) {
    persona = {
      name: "Energy Intensive User",
      icon: "Zap",
      color: "from-amber-500 to-red-500 bg-amber-555/10 text-amber-450 border-amber-500/25",
      desc: "Your biggest carbon footprint stems from household grid consumption and cooling units. Efficiency upgrades will save you massive emissions."
    };
  }

  // 2. Top 3 Emission Sources
  const sortedCategories = [
    { name: 'Transportation', value: transportation, pct: transPct, id: 'transportation' },
    { name: 'Household Energy', value: energy, pct: energyPct, id: 'energy' },
    { name: 'Dietary Choices', value: food, pct: foodPct, id: 'food' },
    { name: 'Consumer Habits & Lifestyle', value: lifestyle, pct: lifePct, id: 'lifestyle' }
  ].sort((a, b) => b.value - a.value);

  const top3Sources = sortedCategories.slice(0, 3);

  // 3. Recommendation Confidence Score
  let confidence = 85;
  if (flights > 0) confidence += 2;
  if (carTravel > 0) confidence += 2;
  if (electricity > 100) confidence += 2;
  if (foodHabit !== 'mixed') confidence += 2;
  if (shoppingFrequency !== 'average') confidence += 2;
  confidence = Math.min(98, confidence);

  // 4. Personalized Action Plan Recommendations
  const actionPlan = [];

  // Flight reduction recommendation
  if (flights > 0) {
    actionPlan.push({
      title: "Reduce Air Travel or Offset Flights",
      description: `With ${flights} flights annually, aviation is a massive emissions source. Restrict short-haul flights or purchase verified offsets.`,
      category: "transportation",
      savings: flights * 250, // 250kg per flight
      difficulty: "Hard",
      timeToImplement: "Immediate (Next Booking)",
      priority: flights * 250 > 200 ? "High" : "Medium"
    });
  }

  // Car commute reduction
  if (carTravel > 10) {
    const savings = Math.round(carTravel * 0.171 * 52 * 2);
    actionPlan.push({
      title: "Initiate Carpooling or Transit Commute",
      description: `Your daily car travel is ${carTravel} km. Switching to public transit or cycling just 2 days a week will save significant gas.`,
      category: "transportation",
      savings: savings,
      difficulty: "Medium",
      timeToImplement: "1 - 3 days",
      priority: savings > 200 ? "High" : "Medium"
    });
  }

  // AC thermostat setting
  if (acUsage > 0) {
    const savings = Math.round(acUsage * 0.3 * 30 * 12);
    actionPlan.push({
      title: "Set AC Thermostat to 24°C (75°F)",
      description: `By keeping your AC at 24°C instead of colder temperatures, you save approximately 15% of your cooling grid electricity.`,
      category: "energy",
      savings: savings,
      difficulty: "Easy",
      timeToImplement: "Immediate",
      priority: savings > 200 ? "High" : "Medium"
    });
  }

  // Electricity saving
  if (electricity > 100) {
    const savings = Math.round(electricity * 0.1 * 0.475 * 12);
    actionPlan.push({
      title: "Install Smart Power Strips",
      description: `Vampire loads consume 5-10% of household power. Unplug standby electronics or use toggleable power strips.`,
      category: "energy",
      savings: savings,
      difficulty: "Easy",
      timeToImplement: "1 week",
      priority: savings > 200 ? "High" : savings > 50 ? "Medium" : "Low"
    });
  }

  // Diet optimization
  if (foodHabit === 'meatHeavy') {
    actionPlan.push({
      title: "Transition to 'Meatless Mondays'",
      description: "Substitute beef or lamb for chicken or plant proteins once a week. Red meat production is highly carbon-intensive.",
      category: "food",
      savings: 120,
      difficulty: "Easy",
      timeToImplement: "Next Monday",
      priority: "High"
    });
  } else if (foodHabit === 'mixed') {
    actionPlan.push({
      title: "Adopt More Plant-Based Proteins",
      description: "Replace chicken or fish meals with legumes, tofu, or grains three times a week to optimize your mixed diet footprint.",
      category: "food",
      savings: 60,
      difficulty: "Easy",
      timeToImplement: "1 day",
      priority: "Medium"
    });
  }

  // Plastic waste reduction
  if (plasticUsage !== 'low') {
    actionPlan.push({
      title: "Adopt Zero-Waste Reusables",
      description: "Ditch single-use plastic water bottles and grocery bags for metal canisters and canvas bags.",
      category: "lifestyle",
      savings: 30,
      difficulty: "Easy",
      timeToImplement: "1 day",
      priority: "Low"
    });
  }

  // Shopping habits
  if (shoppingFrequency === 'frequently') {
    actionPlan.push({
      title: "Embrace Secondhand & Vintage",
      description: "Reduce consumption of fast fashion and new electronics. Opt for vintage clothes or refurbished electronics.",
      category: "lifestyle",
      savings: 65,
      difficulty: "Medium",
      timeToImplement: "Ongoing",
      priority: "Medium"
    });
  } else if (shoppingFrequency === 'average') {
    actionPlan.push({
      title: "Perform a 30-Day Buy Nothing Challenge",
      description: "Challenge yourself to only purchase essential groceries and medicine for 30 days to break consumerist habits.",
      category: "lifestyle",
      savings: 35,
      difficulty: "Hard",
      timeToImplement: "1 month",
      priority: "Low"
    });
  }

  // General standard improvements
  actionPlan.push({
    title: "Wash Laundry on Cold Cycles",
    description: "Heating water accounts for 90% of washing machine energy. Washing on cold cycles cuts grid load.",
    category: "energy",
    savings: 15,
    difficulty: "Easy",
    timeToImplement: "Immediate",
    priority: "Low"
  });

  actionPlan.push({
    title: "Plant a Native Backyard Tree",
    description: "A single native tree can absorb over 20 kg of carbon dioxide every year while improving local biodiversity.",
    category: "lifestyle",
    savings: 22,
    difficulty: "Medium",
    timeToImplement: "1 weekend",
    priority: "Low"
  });

  // Sort plan by savings DESC
  actionPlan.sort((a, b) => b.savings - a.savings);

  // 5. AI Reasoning Generation
  const primarySource = sortedCategories[0];
  const secondSource = sortedCategories[1];
  let reasoning = `${primarySource.name} contributes ${primarySource.pct}% of your emissions and is your largest emission source. Therefore, focusing on this area provides the greatest environmental benefit. `;
  if (secondSource && secondSource.pct > 20) {
    reasoning += `Additionally, ${secondSource.name} accounts for ${secondSource.pct}% of your footprint, indicating that secondary efforts should focus here to maximize carbon offsets.`;
  } else {
    reasoning += `Your carbon footprint is highly concentrated in ${primarySource.name}, making it your primary target for optimization.`;
  }

  // 6. What Should I Do First Card Selection
  // Prioritize Easy/Medium difficulty actions that provide solid savings
  const candidateRecommendations = [...actionPlan].sort((a, b) => {
    const aDifficultyWeight = a.difficulty === 'Easy' ? 2.5 : a.difficulty === 'Medium' ? 1.5 : 0.8;
    const bDifficultyWeight = b.difficulty === 'Easy' ? 2.5 : b.difficulty === 'Medium' ? 1.5 : 0.8;
    return (b.savings * bDifficultyWeight) - (a.savings * aDifficultyWeight);
  });
  const bestNextAction = candidateRecommendations[0] || actionPlan[0];

  // 7. Personalized Weekly Goals
  let weeklyGoals = [];
  if (persona.name === "Carbon Heavy Commuter") {
    weeklyGoals = [
      "Take public transit or carpool for commutes on Tuesday and Thursday.",
      "Switch off the vehicle engine at red lights longer than 20 seconds.",
      "Consolidate errand trips into a single planned driving loop."
    ];
  } else if (persona.name === "Energy Intensive User") {
    weeklyGoals = [
      "Raise the AC temperature setting to 25°C (77°F) for all cooling sessions.",
      "Power down and unplug all home screens and standby devices before sleeping.",
      "Line-dry one load of laundry instead of using the electric dryer."
    ];
  } else if (persona.name === "Eco Explorer" || persona.name === "Sustainability Champion") {
    weeklyGoals = [
      "Audit your household trash bin to ensure zero recyclable items are lost.",
      "Share one carbon-offset tip or local recipe with a friend or colleague.",
      "Avoid buying any single-use plastic bottles, cups, or utensils for 7 days."
    ];
  } else {
    weeklyGoals = [
      "Adopt 'Meatless Monday' and choose local plant proteins for all meals.",
      "Switch off standby power strips when leaving the house for work.",
      "Walk or cycle for all short trips under 2 km this week."
    ];
  }

  return {
    persona,
    top3Sources,
    confidence,
    reasoning,
    bestNextAction,
    weeklyGoals,
    actionPlan
  };
}

/**
 * Generates the dashboard's "🤖 AI Sustainability Insight" text card.
 * Evaluates user footprint categories to return customized paragraphs.
 */
export function generateLocalInsight(inputs, results) {
  const engine = runSustainabilityDecisionEngine(inputs, results);
  const primary = engine.top3Sources[0];
  const text = engine.reasoning;
  return {
    text: text,
    category: primary.name,
    impact: primary.pct > 35 ? 'High' : 'Medium',
    savings: parseFloat((primary.value * 0.3 / 1000).toFixed(1)),
    badge: primary.id === 'transportation' ? 'Eco Commuter' : primary.id === 'energy' ? 'Power Saver' : primary.id === 'food' ? 'Green Eater' : 'Zero-Waster'
  };
}

/**
 * Generates prioritized array of recommended goals based on calculator parameters.
 */
export function generateLocalRecommendations(inputs, results) {
  const engine = runSustainabilityDecisionEngine(inputs, results);
  return engine.actionPlan;
}

/**
 * Intelligent Local NLP Engine for Chatbot Dialogs.
 * Merges user calculations context directly into conversational outputs.
 */
export function chatWithLocalEcoCoach(userMsg, history, inputs, results) {
  const cleanMsg = userMsg.toLowerCase().trim();
  const engine = runSustainabilityDecisionEngine(inputs, results);
  const score = calculateScore(results?.annualTotalTons || 6.8);

  // 1. Help / Reduce / Plan
  if (cleanMsg.includes("reduce") || cleanMsg.includes("plan") || cleanMsg.includes("strategy") || cleanMsg.includes("how can i")) {
    const topSource = engine.top3Sources[0];
    let reply = `As a **${engine.persona.name}**, your primary focus should be optimizing **${topSource.name}**, which represents **${topSource.pct}%** of your total carbon output.\n\nHere is your custom strategy:\n`;
    
    engine.actionPlan.slice(0, 3).forEach((item, idx) => {
      reply += `${idx + 1}. **${item.title}**: ${item.description} (Savings: *${item.savings} kg CO₂/yr*, Difficulty: *${item.difficulty}*)\n`;
    });
    
    reply += `\nI recommend starting with **"${engine.bestNextAction.title}"** first, as our engine has calculated this to be the most efficient next action.`;
    return reply;
  }

  // 2. Biggest emission source / reasoning
  if (cleanMsg.includes("biggest") || cleanMsg.includes("source") || cleanMsg.includes("emission") || cleanMsg.includes("contribute") || cleanMsg.includes("reasoning")) {
    let reply = `Based on our Sustainability Decision Engine (Confidence: **${engine.confidence}%**), your carbon emissions rank as follows:\n\n`;
    engine.top3Sources.forEach((src, idx) => {
      reply += `${idx + 1}. **${src.name}**: ${src.pct}% of total footprint\n`;
    });
    reply += `\n**AI Reasoning:** ${engine.reasoning}`;
    return reply;
  }

  // 3. Weekly eco plan / goals
  if (cleanMsg.includes("weekly") || cleanMsg.includes("plan") || cleanMsg.includes("challenge") || cleanMsg.includes("goal")) {
    let reply = `Here are your personalized weekly goals, tailored for your **${engine.persona.name}** profile:\n\n`;
    engine.weeklyGoals.forEach((goal, idx) => {
      reply += `- **Goal ${idx + 1}:** ${goal}\n`;
    });
    reply += `\nCompleting these will help improve your overall carbon score of **${score}/100**!`;
    return reply;
  }

  // 4. Persona check
  if (cleanMsg.includes("persona") || cleanMsg.includes("who am i") || cleanMsg.includes("classify") || cleanMsg.includes("my profile")) {
    return `Our Sustainability Decision Engine classifies you as an **${engine.persona.name}** (Carbon Score: **${score}/100**).\n\n**About your Persona:** ${engine.persona.desc}\n\nOur recommendations are automatically adjusted to match this classification with a **${engine.confidence}%** confidence rating.`;
  }

  // 5. Compare footprint
  if (cleanMsg.includes("compare") || cleanMsg.includes("average") || cleanMsg.includes("person")) {
    const diff = Math.abs((results?.annualTotalTons || 6.8) - 4.7).toFixed(1);
    const relation = (results?.annualTotalTons || 6.8) > 4.7 ? "above" : "below";
    return `Your annual footprint of **${results?.annualTotalTons || 6.8} Tons CO₂** is **${diff} Tons ${relation}** the global average of 4.7 Tons/Yr.\n\nOur sustainable target is **2.0 Tons/Yr**. By executing your personalized action plan, you can bring your footprint closer to this goal.`;
  }

  // 6. Greet
  if (cleanMsg.includes("hello") || cleanMsg.includes("hi") || cleanMsg.includes("hey")) {
    return `Hello! I am your AI Eco Coach. I've classified your profile as **${engine.persona.name}** with a Carbon Score of **${score}/100**.\n\nAsk me how to optimize your top emission sources, or select one of the suggested prompts below!`;
  }

  return `Interesting query! To help you achieve sustainable milestones, I can analyze your metrics. Try asking: \n- *"What is my sustainability persona?"* \n- *"What is my biggest emission source?"* \n- *"How can I improve my carbon score?"* \n- *"Create a weekly eco plan."*`;
}
