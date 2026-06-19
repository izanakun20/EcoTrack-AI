import { describe, it, expect } from 'vitest';
import { calculateEmissions, calculateScore, getScoreDetails } from '../utils/calculations';

describe('Emissions Calculations', () => {
  it('calculates emissions correctly for standard inputs', () => {
    const inputs = {
      carTravel: 20,
      bikeTravel: 10,
      publicTransport: 15,
      flights: 2,
      electricity: 250,
      acUsage: 4,
      foodHabit: 'mixed',
      plasticUsage: 'medium',
      shoppingFrequency: 'average'
    };

    const results = calculateEmissions(inputs);

    expect(results).toHaveProperty('annualTotalKg');
    expect(results).toHaveProperty('monthlyTotalKg');
    expect(results).toHaveProperty('annualTotalTons');
    expect(results.breakdown.food).toBe(2500);
    expect(results.breakdown.lifestyle).toBe(550); // plastic(250) + shopping(300)
    expect(results.annualTotalTons).toBeGreaterThan(0);
  });

  it('handles zero or minimal inputs safely', () => {
    const inputs = {
      carTravel: 0,
      bikeTravel: 0,
      publicTransport: 0,
      flights: 0,
      electricity: 0,
      acUsage: 0,
      foodHabit: 'vegetarian',
      plasticUsage: 'low',
      shoppingFrequency: 'rarely'
    };

    const results = calculateEmissions(inputs);
    expect(results.breakdown.transportation).toBe(0);
    expect(results.breakdown.energy).toBe(0);
    expect(results.breakdown.food).toBe(1500);
    expect(results.breakdown.lifestyle).toBe(200); // 100 + 100
    expect(results.annualTotalTons).toBe(1.7); // (1500 + 200) / 1000 = 1.7
  });

  it('clamps extreme inputs to their defined max limits', () => {
    const inputs = {
      carTravel: 1000,          // should clamp to 300
      bikeTravel: 1000,         // should clamp to 200
      publicTransport: 1000,    // should clamp to 300
      flights: 500,             // should clamp to 100
      electricity: 50000,       // should clamp to 10000
      acUsage: 48,              // should clamp to 24
      foodHabit: 'mixed',
      plasticUsage: 'medium',
      shoppingFrequency: 'average'
    };

    const results = calculateEmissions(inputs);
    const resultsClampedExpected = calculateEmissions({
      carTravel: 300,
      bikeTravel: 200,
      publicTransport: 300,
      flights: 100,
      electricity: 10000,
      acUsage: 24,
      foodHabit: 'mixed',
      plasticUsage: 'medium',
      shoppingFrequency: 'average'
    });

    expect(results.annualTotalKg).toBe(resultsClampedExpected.annualTotalKg);
  });

  it('prevents negative values and sanitizes invalid strings', () => {
    const inputs = {
      carTravel: -50,
      bikeTravel: 'invalid-string',
      publicTransport: -10,
      flights: -2,
      electricity: -300,
      acUsage: -5,
      foodHabit: 'invalid-diet-key',
      plasticUsage: 'invalid-plastic-key',
      shoppingFrequency: 'invalid-shopping-key'
    };

    const results = calculateEmissions(inputs);
    expect(results.breakdown.transportation).toBe(0);
    expect(results.breakdown.energy).toBe(0);
    expect(results.breakdown.food).toBe(2500); // fallback mixed
    expect(results.breakdown.lifestyle).toBe(550); // fallback medium + average
  });
});

describe('Carbon Score and Details', () => {
  it('maps scores correctly', () => {
    expect(calculateScore(0)).toBe(100);
    expect(calculateScore(9)).toBe(50);
    expect(calculateScore(18)).toBe(0);
    expect(calculateScore(30)).toBe(0);
  });

  it('handles negative or invalid score calculations safely', () => {
    expect(calculateScore(-5)).toBe(100);
    expect(calculateScore('invalid-tons')).toBe(100);
  });

  it('returns appropriate badge categories', () => {
    expect(getScoreDetails(95).badge).toBe('Green Hero');
    expect(getScoreDetails(75).badge).toBe('Eco Champion');
    expect(getScoreDetails(55).badge).toBe('Eco Explorer');
    expect(getScoreDetails(35).badge).toBe('Climate Learner');
    expect(getScoreDetails(15).badge).toBe('Carbon Heavy');
  });

  it('handles abnormal badge score inputs gracefully', () => {
    expect(getScoreDetails(-10).badge).toBe('Carbon Heavy');
    expect(getScoreDetails('invalid-score').badge).toBe('Carbon Heavy');
    expect(getScoreDetails(500).badge).toBe('Green Hero');
  });
});
