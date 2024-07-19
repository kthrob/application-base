import { defineConfig, squooshImageService } from 'astro/config';
import { lazyImagesRehypePlugin, readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter.mjs';

import alpinejs from "@astrojs/alpinejs";
import astrowind from './vendor/integration';
import compress from 'astro-compress';
import { fileURLToPath } from 'url';
import htmx from 'astro-htmx'
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import netlify from "@astrojs/netlify";
import partytown from '@astrojs/partytown';
import path from 'path';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hasExternalScripts = false;
const whenExternalScripts = (items = []) => hasExternalScripts ? Array.isArray(items) ? items.map(item => item()) : [items()] : [];


// https://astro.build/config
export default defineConfig({
  output: 'server',
  outDir: './dist',
  server: {
    port: 3000
  },
  security: { checkOrigin: true},
  integrations: [htmx(),tailwind({
    applyBaseStyles: false
  }), sitemap(), mdx(), icon({
    include: {
      tabler: ['*'],
      'flat-color-icons': ['template', 'gallery', 'approval', 'document', 'advertising', 'currency-exchange', 'voice-presentation', 'business-contact', 'database']
    }
  }), ...whenExternalScripts(() => partytown({
    config: {
      forward: ['dataLayer.push']
    }
  })), compress({
    CSS: true,
    HTML: {
      'html-minifier-terser': {
        removeAttributeQuotes: false
      }
    },
    Image: false,
    JavaScript: true,
    SVG: false,
    Logger: 1
  }), astrowind({
    config: './src/config.yaml'
  }), alpinejs({
    entrypoint: '/config/alpine.config.ts'
  })],
  image: {
    service: squooshImageService(),
    domains: ['cdn.pixabay.com']
  },
  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin]
  },
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src')
      }
    }
  },
  adapter: netlify({
    edgeMiddleware: false, // 'true' | 'false'
  })
});
