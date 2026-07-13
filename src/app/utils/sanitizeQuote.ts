// Some quotes seem to have <br> tags in them, which we don't want to display. This function turns them into newlines.
export const sanitizeQuote = (quote: string) => {
  return quote.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
};
