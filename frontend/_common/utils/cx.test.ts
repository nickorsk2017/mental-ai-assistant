import { describe, expect, it } from '@jest/globals';
import cx from './cx';

describe('cx', () => {
  it('joins strings and skips null undefined and booleans', () => {
    expect(cx('one', undefined, null, false, true, 'two')).toBe('one two');
  });

  it('skips intermediates between class names', () => {
    expect(cx('gap-2', undefined, 'px-4', false)).toBe('gap-2 px-4');
  });

  it('returns empty string when nothing remains', () => {
    expect(cx(undefined, false, null)).toBe('');
  });
});
