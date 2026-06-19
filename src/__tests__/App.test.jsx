import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';

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
});
