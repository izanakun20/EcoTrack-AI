import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';
import ErrorBoundary from '../components/ErrorBoundary';

// Mock Recharts since JSDOM/SVG rendering does not fully support responsive containers out-of-the-box
vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    ResponsiveContainer: ({ children }) => <div className="mock-responsive-container">{children}</div>,
  };
});

describe('EcoTrack AI Full Application Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders landing page with correct headers and partners list', () => {
    render(<App />);
    expect(screen.getAllByText('EcoTrack AI')[0]).toBeInTheDocument();
    expect(screen.getByText('Next-Gen Sustainability Engine')).toBeInTheDocument();
    
    const computeBtn = screen.getByRole('button', { name: /Compute Carbon Score/i });
    expect(computeBtn).toBeInTheDocument();
  });

  it('navigates to the calculator page when compute button is clicked', () => {
    render(<App />);
    const computeBtn = screen.getByRole('button', { name: /Compute Carbon Score/i });
    
    act(() => {
      fireEvent.click(computeBtn);
    });

    expect(screen.getByText('Carbon Footprint Calculator')).toBeInTheDocument();
    expect(screen.getByText('Daily Commutes & Flight Logs')).toBeInTheDocument();
  });

  it('allows filling out calculator values and calculates result state', async () => {
    vi.useFakeTimers();
    render(<App />);
    
    // Go to calculator
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Compute Carbon Score/i }));
    });

    // Step 1: Commutes
    expect(screen.getByText('Daily Commutes & Flight Logs')).toBeInTheDocument();
    
    // Click Continue to Step 2: Household Energy
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    });
    expect(screen.getByText('Household Energy Grid')).toBeInTheDocument();

    // Click Continue to Step 3: Food & Lifestyle
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    });
    expect(screen.getByText('Food & Lifestyle Coefficients')).toBeInTheDocument();

    // Select vegetarian food habits
    const vegBtn = screen.getByText('Vegetarian').closest('button');
    act(() => {
      fireEvent.click(vegBtn);
    });

    // Submit calculation
    const calculateBtn = screen.getByRole('button', { name: /Compute Carbon/i });
    act(() => {
      fireEvent.click(calculateBtn);
    });

    // Fast forward mock timers for computing screen
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Assert it shows completing message
    expect(screen.getByText('Footprint Analysis Complete!')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('allows claiming eco points on challenge completion', async () => {
    // Set calculations so achievements are visible and hasCalculated = true
    window.localStorage.setItem('ecotrack_has_calc', JSON.stringify(true));
    window.localStorage.setItem('ecotrack_results', JSON.stringify({
      annualTotalKg: 6800,
      monthlyTotalKg: 566,
      annualTotalTons: 6.8,
      breakdown: { transportation: 3200, energy: 2100, food: 1100, lifestyle: 400 }
    }));
    
    render(<App />);
    
    // Go to challenges tab
    const challengeBtn = screen.getAllByText('Weekly Challenges')[0];
    act(() => {
      fireEvent.click(challengeBtn);
    });
    
    // Expect challenges title
    expect(screen.getByText('Weekly Eco Challenges')).toBeInTheDocument();
    
    // Click "Complete" on the first quest
    const completeBtns = screen.getAllByText('Complete');
    act(() => {
      fireEvent.click(completeBtns[0]);
    });
    
    // Verify success banner message renders
    expect(screen.getByText(/Quest Completed! Successfully claimed/i)).toBeInTheDocument();
  });

  it('allows adding and removing commitments', () => {
    vi.useFakeTimers();
    // Mock calculations
    window.localStorage.setItem('ecotrack_has_calc', JSON.stringify(true));
    window.localStorage.setItem('ecotrack_inputs', JSON.stringify({
      carTravel: 25,
      flights: 3,
      acUsage: 5,
      foodHabit: 'meatHeavy'
    }));
    window.localStorage.setItem('ecotrack_results', JSON.stringify({
      annualTotalTons: 7.2,
      breakdown: { transportation: 4000, energy: 2000, food: 800, lifestyle: 400 }
    }));
    
    render(<App />);

    // Fast-forward backfill timers
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    
    // Navigate to AI Coach
    const coachBtn = screen.getAllByText('AI Eco Coach')[0];
    act(() => {
      fireEvent.click(coachBtn);
    });
    
    expect(screen.getByText('Tailored Carbon Reduction Plan')).toBeInTheDocument();
    
    // Commit to first goal
    const commitBtn = screen.getAllByText('Commit to Goal')[0];
    act(() => {
      fireEvent.click(commitBtn);
    });
    
    // Verify it changed status to "Committed"
    expect(screen.getByText('Committed')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('renders ErrorBoundary crash screen on render error', () => {
    const ProblematicComponent = () => {
      throw new Error('Test Render Failure');
    };
    
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/Test Render Failure/i)).toBeInTheDocument();
    
    spy.mockRestore();
  });
});
