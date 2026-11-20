import type { APIRoute } from 'astro';
import { getCacheControlHeader } from '../lib/api';
import { buildRobotsTxt, isIndexable } from '../lib/seo';

export const GET: APIRoute = () => {
  return new Response(buildRobotsTxt(isIndexable()), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': getCacheControlHeader(),
    },
  });
};
