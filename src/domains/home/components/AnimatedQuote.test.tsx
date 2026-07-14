import { act, render, screen } from '@testing-library/react-native';
import { getAnimatedStyle, setUpTests } from 'react-native-reanimated';

import AnimatedQuote, { INTERVAL } from './AnimatedQuote';

setUpTests();

describe('AnimatedQuote', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Pin randomness so each char's delay is exactly INTERVAL, making timer advances deterministic.
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
    jest.spyOn(Math, 'random').mockRestore();
  });

  it('reveals characters progressively over time', () => {
    render(<AnimatedQuote quote="Hi" author="Bob" />);

    const firstChar = screen.getByTestId('char-0');
    const secondChar = screen.getByTestId('char-1');

    expect(getAnimatedStyle(firstChar).opacity).toBe(0);
    expect(getAnimatedStyle(secondChar).opacity).toBe(0);

    act(() => jest.advanceTimersByTime(INTERVAL));
    expect(getAnimatedStyle(firstChar).opacity).toBe(1);
    expect(getAnimatedStyle(secondChar).opacity).toBe(0);

    act(() => jest.advanceTimersByTime(INTERVAL));
    expect(getAnimatedStyle(secondChar).opacity).toBe(1);
  });

  it('shows the author only after the quote is fully revealed', () => {
    render(<AnimatedQuote quote="Hi" author="Bob" />);

    expect(screen.queryByTestId('author')).toBeNull();

    act(() => jest.advanceTimersByTime(INTERVAL));
    act(() => jest.advanceTimersByTime(INTERVAL));

    expect(screen.getByTestId('author')).toBeTruthy();
  });

  it('resets the reveal when the quote changes', () => {
    const { rerender } = render(<AnimatedQuote quote="Hi" author="Bob" />);

    act(() => jest.advanceTimersByTime(INTERVAL));
    act(() => jest.advanceTimersByTime(INTERVAL));
    expect(screen.getByTestId('author')).toBeTruthy();

    rerender(<AnimatedQuote quote="Yo" author="Amy" />);

    expect(screen.queryByTestId('author')).toBeNull();
    expect(getAnimatedStyle(screen.getByTestId('char-0')).opacity).toBe(0);
  });
});
