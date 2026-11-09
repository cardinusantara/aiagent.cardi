import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const { username = 'deo' } = params;
  const url = new URL(request.url);

  const fullName = url.searchParams.get('name') || 'Deo Cardi Nathanael';
  const headline = url.searchParams.get('title') || 'Founder & CEO';
  const company = url.searchParams.get('company') || 'Cardi Nusantara';
  const phone = url.searchParams.get('phone') || '+6281283625471';
  const email = url.searchParams.get('email') || 'deo@cardi.co.id';
  const website = url.searchParams.get('website') || 'https://www.cardi.co.id';
  const address = url.searchParams.get('address') || 'Jakarta Selatan, Indonesia';

  const vCardContent = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${fullName}`,
    'N:Nathanael;Deo Cardi;;;',
    `ORG:${company}`,
    `TITLE:${headline}`,
    `TEL;TYPE=CELL,VOICE:${phone}`,
    `EMAIL;TYPE=WORK,INTERNET:${email}`,
    `URL:${website}`,
    `ADR;TYPE=WORK:;;${address};;;;`,
    `NOTE:Disimpan dari kartu bisnis Cardi NFC (Username: ${username})`,
    'END:VCARD',
  ].join('\r\n');

  return new Response(vCardContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${username}-contact.vcf"`,
    },
  });
};
