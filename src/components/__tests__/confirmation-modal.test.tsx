import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmationModal } from '../sterilize/confirmation-modal.tsx';

describe('ConfirmationModal', () => {
  const defaultProps = {
    isOpen: true,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    isLoading: false,
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ConfirmationModal {...defaultProps} isOpen={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders step 1 (UV-C Warning) when opened', () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByText('UV-C Warning')).toBeInTheDocument();
    expect(screen.getByText('I Understand')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('advances to step 2 when "I Understand" is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);

    fireEvent.click(screen.getByText('I Understand'));

    expect(screen.getByText('Confirm Dome Sealed')).toBeInTheDocument();
    expect(screen.getByText('Start UV-C')).toBeInTheDocument();
  });

  it('calls onConfirm when "Start UV-C" is clicked in step 2', () => {
    const onConfirm = vi.fn();
    render(<ConfirmationModal {...defaultProps} onConfirm={onConfirm} />);

    // Advance to step 2
    fireEvent.click(screen.getByText('I Understand'));
    // Confirm
    fireEvent.click(screen.getByText('Start UV-C'));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Cancel is clicked in step 1', () => {
    const onCancel = vi.fn();
    render(<ConfirmationModal {...defaultProps} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Cancel is clicked in step 2', () => {
    const onCancel = vi.fn();
    render(<ConfirmationModal {...defaultProps} onCancel={onCancel} />);

    // Advance to step 2
    fireEvent.click(screen.getByText('I Understand'));
    // Cancel from step 2
    fireEvent.click(screen.getByText('Cancel'));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows loading state on the confirm button', () => {
    render(<ConfirmationModal {...defaultProps} isLoading />);

    // Advance to step 2 where loading affects the button
    fireEvent.click(screen.getByText('I Understand'));

    expect(screen.getByText('Starting...')).toBeInTheDocument();
  });

  it('disables buttons when loading in step 2', () => {
    render(<ConfirmationModal {...defaultProps} isLoading />);

    fireEvent.click(screen.getByText('I Understand'));

    const buttons = screen.getAllByRole('button');
    // Cancel and Start UV-C buttons in step 2
    const cancelBtn = buttons.find((b) => b.textContent === 'Cancel');
    const startBtn = buttons.find((b) => b.textContent?.includes('Starting'));

    expect(cancelBtn).toBeDisabled();
    expect(startBtn).toBeDisabled();
  });

  it('resets to step 1 when modal is closed and reopened', () => {
    const { rerender } = render(<ConfirmationModal {...defaultProps} />);

    // Advance to step 2
    fireEvent.click(screen.getByText('I Understand'));
    expect(screen.getByText('Confirm Dome Sealed')).toBeInTheDocument();

    // Close modal
    rerender(<ConfirmationModal {...defaultProps} isOpen={false} />);

    // Reopen modal
    rerender(<ConfirmationModal {...defaultProps} isOpen={true} />);

    // Should be back to step 1
    expect(screen.getByText('UV-C Warning')).toBeInTheDocument();
  });
});
