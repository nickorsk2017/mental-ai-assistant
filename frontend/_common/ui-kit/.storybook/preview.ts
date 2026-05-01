import type { Preview } from '@storybook/react';

const storybookPreview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobileSmall: {
          name: 'Mobile S (320px)',
          styles: { width: '320px', height: '568px' },
          type: 'mobile',
        },
        mobileMedium: {
          name: 'Mobile M (375px)',
          styles: { width: '375px', height: '667px' },
          type: 'mobile',
        },
        mobileLarge: {
          name: 'Mobile L (425px)',
          styles: { width: '425px', height: '812px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet (768px)',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop (1440px)',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop',
        },
      },
      defaultViewport: 'mobileMedium',
    },
  },
};

export default storybookPreview;
