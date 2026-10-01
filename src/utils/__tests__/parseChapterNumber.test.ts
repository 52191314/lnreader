import { parseChapterNumber } from '../parseChapterNumber';

describe('parseChapterNumber', () => {
  it('returns the provided chapterNumber when valid', () => {
    expect(parseChapterNumber('Novel', 'Chapter 5', 5)).toBe(5);
    expect(parseChapterNumber('Novel', 'Ch. 3', 0)).toBe(0);
    expect(parseChapterNumber('Novel', 'Ch. 3', -1)).toBe(3);
  });

  it('parses a basic chapter number from the name', () => {
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

  it('does not throw when chapterName is undefined', () => {
    expect(parseChapterNumber('Novel', undefined as unknown as string)).toBe(
      -1,
    );
  });

  it('does not throw when chapterName is null', () => {
    expect(parseChapterNumber('Novel', null as unknown as string)).toBe(-1);
  });

  it('falls back to the given chapterNumber when chapterName is missing', () => {
    expect(
      parseChapterNumber('Novel', undefined as unknown as string, -1),
    ).toBe(-1);
  });

  it('does not throw when novelName is undefined', () => {
    expect(
      parseChapterNumber(undefined as unknown as string, 'Chapter 3'),
    ).toBe(3);
  });

  it('does not crash when both names are missing', () => {
    expect(
      parseChapterNumber(
        undefined as unknown as string,
        undefined as unknown as string,
      ),
    ).toBe(-1);
  });

  it('prefers an explicit chapter number over missing names', () => {
    expect(
      parseChapterNumber(
        undefined as unknown as string,
        undefined as unknown as string,
        8,
      ),
    ).toBe(8);
  });
});

describe('parseAlphaPostFix', () => {
  it('maps a single letter suffix to a decimal', () => {
    const { parseAlphaPostFix } = require('../parseChapterNumber');
    expect(parseAlphaPostFix('a')).toBe(0.1);
    expect(parseAlphaPostFix('i')).toBe(0.9);
  });

  it('returns 0 for out-of-range suffixes', () => {
    const { parseAlphaPostFix } = require('../parseChapterNumber');
    expect(parseAlphaPostFix('j')).toBe(0);
  });
});
