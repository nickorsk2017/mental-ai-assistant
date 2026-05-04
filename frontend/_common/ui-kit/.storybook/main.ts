import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import path from 'path';

const storybookDirectoryPath = path.dirname(fileURLToPath(import.meta.url));

const storybookConfig: StorybookConfig = {
  stories: ['../**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(configuration) {
    configuration.resolve ??= {};
    configuration.resolve.alias = {
      ...(configuration.resolve.alias ?? {}),
      '@common/shared': path.resolve(storybookDirectoryPath, '../..'),
    };

    configuration.plugins ??= [];
    configuration.plugins.push(tailwindcss());

    return configuration;
  },
  docs: {
    autodocs: 'tag',
  },
};

export default storybookConfig;
