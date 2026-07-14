import { sanitizeQuote } from './sanitizeQuote';

describe('sanitizeQuote', () => {
  it('returns plain text unchanged', () => {
    expect(sanitizeQuote('Hello world')).toBe('Hello world');
  });

  it('replaces <br> tags with newlines', () => {
    expect(sanitizeQuote('Line one<br>Line two')).toBe('Line one\nLine two');
  });

  it('replaces self-closing <br/> and <br /> tags with newlines', () => {
    expect(sanitizeQuote('Line one<br/>Line two<br />Line three')).toBe(
      'Line one\nLine two\nLine three',
    );
  });

  it('is case-insensitive for <br> tags', () => {
    expect(sanitizeQuote('Line one<BR>Line two')).toBe('Line one\nLine two');
  });

  it('strips other HTML tags without adding newlines', () => {
    expect(sanitizeQuote('<b>Bold</b> text')).toBe('Bold text');
  });

  it('handles a mix of <br> and other tags', () => {
    expect(sanitizeQuote('<i>Quote</i><br><b>Author</b>')).toBe('Quote\nAuthor');
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeQuote('')).toBe('');
  });
});
