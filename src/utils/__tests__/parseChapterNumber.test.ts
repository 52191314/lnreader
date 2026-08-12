import { parseAlphaPostFix, parseChapterNumber } from '../parseChapterNumber';

describe('parseChapterNumber', () => {
  it('returns the given chapter number when valid', () => {
    expect(parseChapterNumber('Novel', 'Ch. 3', 5)).toBe(5);
    expect(parseChapterNumber('Novel', 'Ch. 3', 0)).toBe(0);
    // -1 falls through to title parsing (existing behaviour)
    expect(parseChapterNumber('Novel', 'Ch. 3', -1)).toBe(3);
  });

  it('parses a basic "Ch. N" title', () => {
    expect(parseChapterNumber('Novel', 'Ch. 3')).toBe(3);
    expect(parseChapterNumber('Novel', 'Chapter 12')).toBe(12);
  });

  it('strips the novel name before parsing', () => {
    expect(parseChapterNumber('Solo Leveling', 'Solo Leveling Ch. 34')).toBe(
      34,
    );
  });

  it('parses a bare number title', () => {
    expect(parseChapterNumber('Novel', '7')).toBe(7);
  });

  it('parses decimal and alpha-suffixed chapter numbers', () => {
    expect(parseChapterNumber('Novel', 'Ch. 12.5')).toBe(12.5);
    expect(parseChapterNumber('Novel', 'Ch. 3.1')).toBe(3.1);
  });

  it('returns -1 when the title cannot be parsed', () => {
    expect(parseChapterNumber('Novel', 'Prologue')).toBe(-1);
    expect(parseChapterNumber('Novel', '')).toBe(-1);
  });

  it('does not crash when the chapter name is missing', () => {
    expect(parseChapterNumber('Novel', undefined)).toBe(-1);
    expect(parseChapterNumber('Novel', null)).toBe(-1);
  });

  it('does not crash when the novel name is missing', () => {
    expect(parseChapterNumber(undefined, 'Ch. 3')).toBe(-1);
    expect(parseChapterNumber(null, 'Ch. 3')).toBe(-1);
  });

  it('does not crash when both names are missing', () => {
    expect(parseChapterNumber(undefined, undefined)).toBe(-1);
  });

  it('prefers an explicit chapter number over missing names', () => {
    expect(parseChapterNumber(undefined, undefined, 8)).toBe(8);
  });
});

describe('parseAlphaPostFix', () => {
  it('maps a single letter suffix to a decimal', () => {
    expect(parseAlphaPostFix('a')).toBe(0.1);
    expect(parseAlphaPostFix('i')).toBe(0.9);
  });

  it('returns 0 for out-of-range suffixes', () => {
    expect(parseAlphaPostFix('j')).toBe(0);
  });
});
