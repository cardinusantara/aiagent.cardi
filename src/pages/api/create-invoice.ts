import type { APIRoute } from 'astro';
import handler from '../../../api/create-invoice.js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  return handler(request);
};

