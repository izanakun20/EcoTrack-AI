import { describe, it, expect } from 'vitest';
import { runSustainabilityDecisionEngine, chatWithLocalEcoCoach, generateLocalInsight } from '../utils/aiService';

describe('Sustainability Decision Engine', () => {
  const mockResults = {
    annualTotalKg: 6800,
    monthlyTotalKg: 566,
    annualTotalTons: 6.8,
    breakdown: {
      transportation: 3200,
      energy: 2100,
      food: 1100,
      lifestyle: 400
    }
  };

  const mockInputs = {
    carTravel: 15,
    bikeTravel: 5,
    publicTransport: 10,
    flights: 2,
    electricity: 280,
    acUsage: 4,
    foodHabit: 'mixed',
    plasticUsage: 'medium',
    shoppingFrequency: 'average'
  };

  it('classifies user into correct persona based on inputs', () => {
    // Score ~62 (6.8 tons)
    const engine = runSustainabilityDecisionEngine(mockInputs, mockResults);
    // Since score is 62 (<65), and transportation is highest (3200)
    expect(engine.persona.name).toBe('Carbon Heavy Commuter');
  });

  it('identifies top 3 carbon emission sources correctly', () => {
    const engine = runSustainabilityDecisionEngine(mockInputs, mockResults);
    expect(engine.top3Sources).toHaveLength(3);
    expect(engine.top3Sources[0].name).toBe('Transportation');
    expect(engine.top3Sources[1].name).toBe('Household Energy');
    expect(engine.top3Sources[2].name).toBe('Dietary Choices');
  });

  it('generates a confidence score dynamically', () => {
    const engine = runSustainabilityDecisionEngine(mockInputs, mockResults);
    expect(engine.confidence).toBeGreaterThanOrEqual(85);
    expect(engine.confidence).toBeLessThanOrEqual(98);
  });

  it('selects a valid best next action based on optimal savings and difficulty', () => {
    const engine = runSustainabilityDecisionEngine(mockInputs, mockResults);
    expect(engine.bestNextAction).toHaveProperty('title');
    expect(engine.bestNextAction).toHaveProperty('savings');
    expect(engine.bestNextAction).toHaveProperty('difficulty');
  });

  it('generates personalized weekly goals matching the user persona', () => {
    const engine = runSustainabilityDecisionEngine(mockInputs, mockResults);
    expect(engine.weeklyGoals.length).toBeGreaterThan(0);
  });
});

describe('AI Coach Chatbot responses', () => {
  const results = {
    annualTotalTons: 7.2,
    breakdown: { transportation: 4000, energy: 2000, food: 800, lifestyle: 400 }
  };
  const inputs = { carTravel: 25, flights: 3, acUsage: 5, foodHabit: 'meatHeavy' };

  it('returns custom strategy when asking about reduction plan', () => {
    const response = chatWithLocalEcoCoach('how can i reduce my footprint', [], inputs, results);
    expect(response).toContain('Carbon Heavy Commuter');
    expect(response).toContain('Transportation');
  });

  it('identifies biggest source when queried', () => {
    const response = chatWithLocalEcoCoach('what is my biggest source', [], inputs, results);
    expect(response).toContain('Transportation');
    expect(response).toContain('Reasoning');
  });

  it('answers weekly plan requests with custom persona goals', () => {
    const response = chatWithLocalEcoCoach('create a weekly plan', [], inputs, results);
    expect(response).toContain('weekly goals');
    expect(response).toContain('Carbon Heavy Commuter');
  });
});
