import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders svg with decorative aria semantics', () => {
    const { container } = render(<Icon name="check" />);
    const svgElement = container.querySelector('svg');

    expect(svgElement).toBeTruthy();
    expect(svgElement?.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies numeric size via inline style dimensions', () => {
    const { container } = render(<Icon name="mail" size={32} />);
    const svgElement = container.querySelector('svg');

    expect(svgElement?.style.width).toBe('32px');
    expect(svgElement?.style.height).toBe('32px');
  });

  it('fills google icon instead of stroking outlines', () => {
    const { container } = render(<Icon name="google" />);
    const svgElement = container.querySelector('svg');

    expect(svgElement?.getAttribute('fill')).not.toBe('none');
  });
});
