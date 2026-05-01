import type { NextConfig } from 'next';

const nextConfiguration: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@common/shared'],
  env: {
    NEXT_PUBLIC_RUNTIME_PLATFORM: 'web',
  },
};

export default nextConfiguration;
