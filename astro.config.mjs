import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://www.bassin-rond.net',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
