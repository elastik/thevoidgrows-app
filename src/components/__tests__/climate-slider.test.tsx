import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClimateSlider } from '../settings/climate-slider.tsx';

describe('ClimateSlider', () => {
  const defaultProps = {
    label: 'Humidity Setpoint',
    value: 90,
    onChange: vi.fn(),
    min: 80,
    max: 95,
    step: 1,
    unit: '%',
  };

  it('renders the label text', () => {
    render(<ClimateSlider {...defaultProps} />);
    expect(screen.getByText('Humidity Setpoint')).toBeInTheDocument();
  });

  it('displays the current value with unit', () => {
    render(<ClimateSlider {...defaultProps} />);
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('renders the slider with correct min, max, step attributes', () => {
    render(<ClimateSlider {...defaultProps} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '80');
    expect(slider).toHaveAttribute('max', '95');
    expect(slider).toHaveAttribute('step', '1');
    expect(slider).toHaveValue('90');
  });

  it('displays min and max labels with unit', () => {
    render(<ClimateSlider {...defaultProps} />);
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('calls onChange when slider value changes', () => {
    const onChange = vi.fn();
    render(<ClimateSlider {...defaultProps} onChange={onChange} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '85' } });

    expect(onChange).toHaveBeenCalledWith(85);
  });

  it('applies disabled styling when disabled', () => {
    render(<ClimateSlider {...defaultProps} disabled />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeDisabled();
  });

  it('is not disabled by default', () => {
    render(<ClimateSlider {...defaultProps} />);
    const slider = screen.getByRole('slider');
    expect(slider).not.toBeDisabled();
  });
});
