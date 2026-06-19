import { calculateScore } from "./calculations";

/**
 * Advanced Local AI Engine for EcoTrack AI
 * No external API dependencies. Low latency, 100% private.
 */

/**
 * Generates the dashboard's "🤖 AI Sustainability Insight" text card.
 * Evaluates user footprint categories to return customized paragraphs.
 */
export function generateLocalInsight(inputs, results) {
  const { breakdown, annualTotalTons } = results;
  const { transportation, energy, food, lifestyle } = breakdown;
  const total = Math.max(1, transportation + energy + food + lifestyle);

  const transPct = Math.round((transportation / total) * 100);
  const energyPct = Math.round((energy / total) * 100);
  const foodPct = Math.round((food / total) * 100);
  const lifePct = Math.round((lifestyle / total) * 100);

  // Sort categories to find the primary carbon driver
  const categories = [
    { id: 'transportation', pct: transPct, val: transportation },
    { id: 'energy', pct: energyPct, val: energy },
    { id: 'food', pct: foodPct, val: food },
    { id: 'lifestyle', pct: lifePct, val: lifestyle }
  ];
  categories.sort((a, b) => b.val - a.val);
  const primaryCat = categories[0].id;

  if (primaryCat === 'transportation') {
    const savings = parseFloat((transportation * 0.4 / 1000).toFixed(1));
    return {
      text: `Your transportation accounts for ${transPct}% of your emissions (driven mostly by daily car commutes of ${inputs.carTravel} km). Transitioning to public transit or cycling just 2 days a week will cut your annual footprint by ${savings} Tons CO₂.`,
      category: 'transportation',
      impact: 'High',
      savings: savings,
      badge: 'Eco Commuter'
    };
  } else if (primaryCat === 'energy') {
    const savings = parseFloat((energy * 0.25 / 1000).toFixed(1));
    return {
      text: `Household energy drives ${energyPct}% of your footprint. Restricting AC usage by 2 hours daily and optimizing temperature settings to 24°C (75°F) will cut your emissions by ${savings} Tons CO₂ annually.`,
      category: 'energy',
      impact: 'High',
      savings: savings,
      badge: 'Power Saver'
    };
  } else if (primaryCat === 'food') {
    const savings = parseFloat((food * 0.35 / 1000).toFixed(1));
    return {
      text: `Your dietary habits account for ${foodPct}% of your emissions. Adopting 'Meatless Mondays' or substituting red beef with legumes can reduce your food-related emissions by up to ${savings} Tons CO₂ per year.`,
      category: 'food',
      impact: 'Medium',
      savings: savings,
      badge: 'Green Eater'
    };
  } else {
    const savings = parseFloat((lifestyle * 0.25 / 1000).toFixed(1));
    return {
      text: `Lifestyle habits and packaging drive ${lifePct}% of your emissions. Reducing online ordering frequency and buying secondhand will trim down your footprint by ${savings} Tons CO₂ per year.`,
      category: 'lifestyle',
      impact: 'Medium',
      savings: savings,
      badge: 'Zero-Waster'
    };
  }
}

/**
 * Generates prioritized array of recommended goals based on calculator parameters.
 */
export function generateLocalRecommendations(inputs, results) {
  const { carTravel, electricity, acUsage, foodHabit, plasticUsage, shoppingFrequency } = inputs;
  const recs = [];

  // Commute check
  if (carTravel > 15) {
    recs.push({
      title: "Initiate Carpooling or Transit Commute",
      description: `Your car commute is ${carTravel} km daily. Carpooling or taking public transit 2 days/week will reduce fuel footprint.`,
      category: "transportation",
      priority: "High",
      difficulty: "Medium",
      savings: Math.round(carTravel * 0.171 * 52 * 2)
    });
  }

  // Flight check
  if (inputs.flights > 1) {
    recs.push({
      title: "Carbon-Offset Flight Travel",
      description: `With ${inputs.flights} flights annually, air travel is a major emission source. Buy verified offsets or choose rail travel.`,
      category: "transportation",
      priority: "High",
      difficulty: "Medium",
      savings: 250
    });
  }

  // Power check
  if (electricity > 200) {
    recs.push({
      title: "Install Smart Power Strips & LEDs",
      description: `Your monthly power is ${electricity} kWh. Cutting standby vampire load can save up to 10% on household emissions.`,
      category: "energy",
      priority: "Medium",
      difficulty: "Easy",
      savings: Math.round(electricity * 0.1 * 0.475 * 12)
    });
  }

  // AC check
  if (acUsage > 3) {
    recs.push({
      title: "Optimize AC Thermostat to 24°C",
      description: "Setting your thermostat to 24°C/75°F (with ceiling fans) instead of colder settings saves significant compressor electricity.",
      category: "energy",
      priority: "Medium",
      difficulty: "Easy",
      savings: Math.round(acUsage * 0.3 * 30)
    });
  }

  // Meat check
  if (foodHabit === 'meatHeavy') {
    recs.push({
      title: "Transition to 'Meatless Mondays'",
      description: "Going vegetarian just one day a week saves beef livestock production emissions. Substitute beef for poultry or legumes.",
      category: "food",
      priority: "High",
      difficulty: "Easy",
      savings: 80
    });
  }

  // Plastic check
  if (plasticUsage !== 'low') {
    recs.push({
      title: "Adopt Zero-Waste Reusables",
      description: "Replace single-use plastic grocery bags and water bottles with canvas totes and stainless steel canisters.",
      category: "lifestyle",
      priority: "Medium",
      difficulty: "Easy",
      savings: 20
    });
  }

  // Shopping check
  if (shoppingFrequency === 'frequently') {
    recs.push({
      title: "Embrace Secondhand & Vintage",
      description: "Fast fashion requires intensive manufacturing energy. Buying vintage or refurbished cuts supply-chain footprint.",
      category: "lifestyle",
      priority: "Medium",
      difficulty: "Medium",
      savings: 45
    });
  }

  // General standard goals
  recs.push({
    title: "Wash Laundry on Cold Cycles",
    description: "Heating water accounts for 90% of washing machine energy. Washing on cold cycles cuts grid load.",
    category: "energy",
    priority: "Low",
    difficulty: "Easy",
    savings: 15
  });

  recs.push({
    title: "Plant a Native Backyard Tree",
    description: "A single native tree can absorb over 20 kg of carbon dioxide every year while improving local biodiversity.",
    category: "lifestyle",
    priority: "Low",
    difficulty: "Easy",
    savings: 22
  });

  return recs.sort((a, b) => b.savings - a.savings);
}

/**
 * Intelligent Local NLP Engine for Chatbot Dialogs.
 * Merges user calculations context directly into conversational outputs.
 */
export function chatWithLocalEcoCoach(userMsg, history, inputs, results) {
  const cleanMsg = userMsg.toLowerCase().trim();
  const score = calculateScore(results.annualTotalTons);

  // 1. Help / Reduce
  if (cleanMsg.includes("reduce") || cleanMsg.includes("plan") || cleanMsg.includes("strategy") || cleanMsg.includes("how can i")) {
    const plans = [];
    if (inputs.carTravel > 20) {
      plans.push(`Carpool or transit your daily ${inputs.carTravel}km car commute to save up to ${Math.round(inputs.carTravel * 0.171 * 50)}kg CO₂/yr.`);
    }
    if (inputs.acUsage > 4) {
      plans.push(`Limit your AC usage (currently ${inputs.acUsage} hours/day) and set it to 24°C to save ~25kg CO₂/mo.`);
    }
    if (inputs.foodHabit === 'meatHeavy') {
      plans.push(`Adopt a vegetarian diet or do 'Meatless Mondays' to replace red beef, saving up to 80kg CO₂/yr.`);
    }
    plans.push(`Wash clothes in cold water to decrease laundry grid load by 90% (saving 15kg CO₂/yr).`);

    return `Based on your profile details, here is your personalized carbon reduction plan:\n\n${plans.map((p, idx) => `${idx + 1}. ${p}`).join("\n")}\n\nClick "Commit to Goal" on any recommendation card to track these targets in your goals tab!`;
  }

  // 2. Biggest emission source
  if (cleanMsg.includes("biggest") || cleanMsg.includes("source") || cleanMsg.includes("emission") || cleanMsg.includes("contribute")) {
    const insight = generateLocalInsight(inputs, results);
    return `Looking at your carbon breakdown, your largest carbon driver is **${insight.category.toUpperCase()}**.\n\n${insight.text}`;
  }

  // 3. Weekly eco plan
  if (cleanMsg.includes("weekly") || cleanMsg.includes("plan") || cleanMsg.includes("challenge")) {
    return `Here is a custom 7-day plan to boost your carbon score:\n\n- **Mon-Tue:** Set your AC to 24°C and plug vampire electronics into switched power strips.\n- **Wed-Thu:** Choose vegetarian meals and bring reusable canvas bags for grocery runs.\n- **Fri-Sun:** Walk or bicycle for all trips under 5km instead of driving.\n\nYou can claim Eco Points for these tasks in the **Weekly Challenges** tab!`;
  }

  // 4. Improve carbon score
  if (cleanMsg.includes("score") || cleanMsg.includes("improve") || cleanMsg.includes("increase")) {
    return `Your current Carbon Score is **${score}/100**. To climb to a "Green Hero" rank (90+ score), try to:\n1. Decrease your annual car driving (aim for transit or cycling).\n2. Optimize AC temperatures and wash laundry with cold cycles.\n3. Transition away from heavy beef/pork diets to plant-heavy choices.`;
  }

  // 5. Compare footprint
  if (cleanMsg.includes("compare") || cleanMsg.includes("average") || cleanMsg.includes("person")) {
    const diff = Math.abs(results.annualTotalTons - 4.7).toFixed(1);
    const relation = results.annualTotalTons > 4.7 ? "above" : "below";
    return `Your annual footprint is **${results.annualTotalTons} Tons CO₂**. Here is how it compares to global benchmarks:\n\n- **Global Average:** 4.7 Tons/Yr (You are ${diff} Tons ${relation} average).\n- **US Average:** 16.0 Tons/Yr.\n- **Sustainable Target:** 2.0 Tons/Yr (Needed to freeze warming).\n\nYou can track this comparison dynamically in the comparative chart in the Calculator results tab!`;
  }

  // 6. Greet / Default fallback
  if (cleanMsg.includes("hello") || cleanMsg.includes("hi") || cleanMsg.includes("hey")) {
    return `Hello! I am your AI Eco Coach. Ask me how to optimize your home energy, decrease plastic waste, or switch commutes. Your current carbon score is ${score}/100.`;
  }

  return `Interesting query! To help you achieve sustainable milestones, I can analyze your metrics. Try asking: \n- *"What is my biggest emission source?"* \n- *"How can I improve my carbon score?"* \n- *"Create a weekly eco plan."*`;
}
