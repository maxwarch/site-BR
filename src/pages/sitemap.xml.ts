import type { APIRoute } from 'astro';
import { getCacheControlHeader } from '../lib/api';
import { buildSitemapXml } from '../lib/seo';

export const GET: APIRoute = () => {
  return new Response(buildSitemapXml(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': getCacheControlHeader(),
    },
  });
};
