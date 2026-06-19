// Emission factor constants (kg CO2 per unit)
const EF = {
  carPerKm: 0.171,          // Average petrol car: 171g CO2/km
  motorbikePerKm: 0.085,    // Average motorbike: 85g CO2/km
  publicTransitPerKm: 0.045, // Average bus/rail: 45g CO2/km
  flightPerTrip: 250,        // Average short/long haul flight average: 250kg CO2 per flight
  electricityPerKwh: 0.475,  // Average grid mix emission factor: 0.475kg CO2/kWh
  acUsagePerHour: 1.2 * 0.475, // AC uses ~1.2 kW electricity per hour on average
};

// Food habits annual emissions (kg CO2)
const FOOD_EF = {
  vegetarian: 1500,
  mixed: 2500,
  meatHeavy: 3300
};

// Plastic usage annual emissions (kg CO2)
const PLASTIC_EF = {
  low: 100,
  medium: 250,
  high: 500
};

// Shopping frequency annual emissions (kg CO2)
const SHOPPING_EF = {
  rarely: 100,
  average: 300,
  frequently: 600
};

/**
 * Calculates carbon footprint details from user inputs.
 * Inputs format:
 * {
 *   carTravel: number, (daily km)
 *   bikeTravel: number, (daily km)
 *   publicTransport: number, (daily km)
 *   flights: number, (flights per year)
 *   electricity: number, (monthly kWh)
 *   acUsage: number, (daily hours)
 *   foodHabit: 'vegetarian' | 'mixed' | 'meatHeavy',
 *   plasticUsage: 'low' | 'medium' | 'high',
 *   shoppingFrequency: 'rarely' | 'average' | 'frequently'
 * }
 */
export function calculateEmissions(inputs) {
  const {
    carTravel = 0,
    bikeTravel = 0,
    publicTransport = 0,
    flights = 0,
    electricity = 0,
    acUsage = 0,
    foodHabit = 'mixed',
    plasticUsage = 'medium',
    shoppingFrequency = 'average'
  } = inputs;

  // 1. Transportation (Annual kg CO2)
  const carAnnual = carTravel * 365 * EF.carPerKm;
  const bikeAnnual = bikeTravel * 365 * EF.motorbikePerKm;
  const transitAnnual = publicTransport * 365 * EF.publicTransitPerKm;
  const flightsAnnual = flights * EF.flightPerTrip;
  const transportationTotal = carAnnual + bikeAnnual + transitAnnual + flightsAnnual;

  // 2. Energy (Annual kg CO2)
  const elecAnnual = electricity * 12 * EF.electricityPerKwh;
  const acAnnual = acUsage * 365 * EF.acUsagePerHour;
  const energyTotal = elecAnnual + acAnnual;

  // 3. Food (Annual kg CO2)
  const foodTotal = FOOD_EF[foodHabit] || FOOD_EF.mixed;

  // 4. Lifestyle (Annual kg CO2)
  const plasticAnnual = PLASTIC_EF[plasticUsage] || PLASTIC_EF.medium;
  const shoppingAnnual = SHOPPING_EF[shoppingFrequency] || SHOPPING_EF.average;
  const lifestyleTotal = plasticAnnual + shoppingAnnual;

  // Sum totals
  const annualTotalKg = transportationTotal + energyTotal + foodTotal + lifestyleTotal;
  const monthlyTotalKg = annualTotalKg / 12;
  const annualTotalTons = annualTotalKg / 1000;

  return {
    annualTotalKg: Math.round(annualTotalKg),
    monthlyTotalKg: Math.round(monthlyTotalKg),
    annualTotalTons: parseFloat(annualTotalTons.toFixed(2)),
    breakdown: {
      transportation: Math.round(transportationTotal),
      energy: Math.round(energyTotal),
      food: Math.round(foodTotal),
      lifestyle: Math.round(lifestyleTotal)
    },
    subBreakdown: {
      car: Math.round(carAnnual),
      bike: Math.round(bikeAnnual),
      transit: Math.round(transitAnnual),
      flights: Math.round(flightsAnnual),
      electricity: Math.round(elecAnnual),
      ac: Math.round(acAnnual),
      plastic: Math.round(plasticAnnual),
      shopping: Math.round(shoppingAnnual)
    }
  };
}

/**
 * Calculates a Carbon Score from 0 (very heavy carbon footprint) to 100 (eco hero)
 * based on the user's annual carbon footprint in tons.
 * Scale:
 * - 0 tons = 100 score
 * - 18 tons or above = 0 score (Average US footprint is 16 tons, global average is 4.7)
 */
export function calculateScore(annualTons) {
  // Linear scale where 0 tons = 100 points, 18 tons = 0 points
  const maxTonsThreshold = 18;
  const score = Math.max(0, Math.min(100, Math.round(100 - (annualTons / maxTonsThreshold) * 100)));
  return score;
}

/**
 * Returns badge details based on Carbon Score
 */
export function getScoreDetails(score) {
  if (score >= 90) {
    return {
      badge: 'Green Hero',
      color: 'from-emerald-400 to-green-500',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgGlow: 'bg-emerald-500/10',
      description: 'Exceptional lifestyle! You have an extremely low carbon footprint, matching global sustainable goals.',
      icon: 'ShieldCheck'
    };
  } else if (score >= 70) {
    return {
      badge: 'Eco Champion',
      color: 'from-teal-400 to-emerald-500',
      textColor: 'text-teal-400',
      borderColor: 'border-teal-500/30',
      bgGlow: 'bg-teal-500/10',
      description: 'Great job! You make very conscious ecological decisions and maintain a highly sustainable footprint.',
      icon: 'Award'
    };
  } else if (score >= 50) {
    return {
      badge: 'Eco Explorer',
      color: 'from-sky-400 to-teal-500',
      textColor: 'text-sky-400',
      borderColor: 'border-sky-500/30',
      bgGlow: 'bg-sky-500/10',
      description: 'You are on your way! Your carbon footprint is moderate, and simple shifts can make a huge impact.',
      icon: 'Compass'
    };
  } else if (score >= 30) {
    return {
      badge: 'Climate Learner',
      color: 'from-amber-400 to-orange-500',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgGlow: 'bg-amber-500/10',
      description: 'Awareness is the first step. Your footprint is slightly above average. Look for easy ways to reduce.',
      icon: 'BookOpen'
    };
  } else {
    return {
      badge: 'Carbon Heavy',
      color: 'from-rose-500 to-red-600',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      bgGlow: 'bg-rose-500/10',
      description: 'Your carbon footprint is high. Substantial improvements are possible, especially in energy and transit.',
      icon: 'AlertTriangle'
    };
  }
}
