import type { APIRoute } from 'astro';
import { getCacheControlHeader, getSiteData } from '../lib/api';
import { buildLlmsTxt } from '../lib/seo';

export const GET: APIRoute = async () => {
  const data = await getSiteData();
  return new Response(buildLlmsTxt(data), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': getCacheControlHeader(),
    },
  });
};
