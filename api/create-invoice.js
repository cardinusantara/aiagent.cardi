/**
 * Serverless Function: Create Xendit Invoice
 * Endpoint: POST /api/create-invoice
 *
 * Payload: { name, email, phone, plan }
 * Returns: { invoiceUrl: string }
 */

export default async function handler(req, res) {
  // Support both Node.js (res.status.json) and Web standard (Response) runtimes
  const isWebStandard = !res || typeof res.status !== 'function';

  function sendResponse(status, data) {
    if (isWebStandard) {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return res.status(status).json(data);
  }

  // 1. Method Validation
  const method = req.method;
  if (method !== 'POST') {
    if (!isWebStandard && res.setHeader) {
      res.setHeader('Allow', 'POST');
    }
    return sendResponse(405, { error: 'Method Not Allowed' });
  }

  // 2. Parse Body
  let body;
  try {
    if (typeof req.json === 'function') {
      body = await req.json();
    } else if (req.body && typeof req.body === 'object') {
      body = req.body;
    } else if (typeof req.body === 'string') {
      body = JSON.parse(req.body);
    } else {
      body = {};
    }
  } catch (err) {
    return sendResponse(400, { error: 'Format JSON pada request body tidak valid.' });
  }

  const { name, email, phone, plan } = body || {};

  // 3. Input Validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    return sendResponse(400, { error: 'Nama Lengkap wajib diisi.' });
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return sendResponse(400, { error: 'Alamat Email wajib diisi.' });
  }

  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return sendResponse(400, { error: 'Nomor WhatsApp wajib diisi.' });
  }

  if (!plan || typeof plan !== 'string' || !plan.trim()) {
    return sendResponse(400, { error: 'Pilihan paket langganan wajib diisi.' });
  }

  // 4. Determine Price & Plan Name
  const normalizedPlan = plan.toLowerCase().trim();
  let amount = 0;
  let planTitle = '';

  if (normalizedPlan === 'grup') {
    amount = 299000;
    planTitle = 'Grup';
  } else if (
    normalizedPlan === 'nomor-sendiri' ||
    normalizedPlan === 'nomorsendiri' ||
    normalizedPlan === 'nomor_sendiri' ||
    normalizedPlan === 'nomor'
  ) {
    amount = 999000;
    planTitle = 'Nomor Sendiri';
  } else {
    return sendResponse(400, {
      error: `Paket '${plan}' tidak valid. Pilihan yang tersedia: 'grup' atau 'nomor-sendiri'.`
    });
  }

  // 5. Environment Variable Check
  const secretKey = process.env.XENDIT_SECRET_KEY;
  if (!secretKey) {
    console.error('XENDIT_SECRET_KEY is not defined in environment variables.');
    return sendResponse(500, {
      error: 'Konfigurasi pembayaran Xendit belum terpasang di server (XENDIT_SECRET_KEY missing).'
    });
  }

  // 6. Format Phone Number (+62...)
  let cleanPhone = phone.trim();
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '+62' + cleanPhone.slice(1).replace(/[^0-9]/g, '');
  } else if (cleanPhone.startsWith('62')) {
    cleanPhone = '+' + cleanPhone.replace(/[^0-9]/g, '');
  } else if (!cleanPhone.startsWith('+')) {
    cleanPhone = '+62' + cleanPhone.replace(/[^0-9]/g, '');
  }

  // 7. Construct Xendit Payload
  const externalId = `aspri-${Date.now()}`;
  const xenditPayload = {
    external_id: externalId,
    amount: amount,
    description: `Langganan Cardi Agent AI Aspri - Paket ${planTitle}`,
    customer: {
      given_names: name.trim(),
      email: email.trim(),
      mobile_number: cleanPhone
    },
    success_redirect_url: 'https://aiagent.cardi.co.id/aspri/?payment=success',
    failure_redirect_url: 'https://aiagent.cardi.co.id/aspri/checkout.html?payment=failed'
  };

  const authHeader = 'Basic ' + Buffer.from(secretKey + ':').toString('base64');

  // 8. Call Xendit Invoices API
  try {
    const xenditRes = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(xenditPayload)
    });

    const xenditData = await xenditRes.json();

    if (!xenditRes.ok) {
      console.error('Xendit Invoices API error:', xenditData);
      return sendResponse(xenditRes.status || 500, {
        error: xenditData.message || 'Gagal membuat tagihan Xendit. Mohon periksa kembali data Anda.'
      });
    }

    if (!xenditData.invoice_url) {
      console.error('No invoice_url in Xendit response:', xenditData);
      return sendResponse(500, {
        error: 'Respon dari Xendit tidak menyertakan invoice_url.'
      });
    }

    // 9. Return invoiceUrl to Frontend
    return sendResponse(200, {
      invoiceUrl: xenditData.invoice_url
    });

  } catch (error) {
    console.error('Exception calling Xendit Invoices API:', error);
    return sendResponse(500, {
      error: 'Terjadi kegagalan koneksi ke gateway Xendit: ' + (error.message || 'Network error')
    });
  }
}
