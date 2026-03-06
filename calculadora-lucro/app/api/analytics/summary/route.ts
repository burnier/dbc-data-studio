/**
 * Internal Analytics Summary Endpoint
 *
 * Returns a compact JSON snapshot of GA4 metrics for the last N days.
 * Consumed by the /growth-agent Python service.
 *
 * Auth: Bearer token via ANALYTICS_SECRET environment variable.
 *       Request header: Authorization: Bearer <ANALYTICS_SECRET>
 *
 * GA4 Auth: Google Service Account JSON stored in GOOGLE_SERVICE_ACCOUNT_JSON.
 *           The service account must have "Viewer" access on the GA4 property.
 *
 * Usage:
 *   GET /api/analytics/summary              → last 30 days
 *   GET /api/analytics/summary?days=7      → last 7 days
 *   GET /api/analytics/summary?days=90     → last 90 days
 */

import { createSign } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// ─── Constants ───────────────────────────────────────────────────────────────

const GA4_PROPERTY = 'properties/525217735';
const GA4_API      = 'https://analyticsdata.googleapis.com/v1beta';

// ─── Google Service Account JWT Auth ─────────────────────────────────────────

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function base64url(input: string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function getGoogleAccessToken(): Promise<string> {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not set');

  const sa: ServiceAccount = JSON.parse(raw);
  const now = Math.floor(Date.now() / 1000);

  const header  = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss  : sa.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud  : 'https://oauth2.googleapis.com/token',
    exp  : now + 3600,
    iat  : now,
  }));

  const unsigned = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(unsigned);
  const sig = sign
    .sign(sa.private_key, 'base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const jwt = `${unsigned}.${sig}`;

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method : 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body   : `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await resp.json();
  if (!data.access_token) throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

// ─── GA4 Query Helper ─────────────────────────────────────────────────────────

async function ga4Report(token: string, body: object): Promise<Record<string, unknown>> {
  const resp = await fetch(`${GA4_API}/${GA4_PROPERTY}:runReport`, {
    method : 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`GA4 API ${resp.status}: ${err.slice(0, 200)}`);
  }
  return resp.json();
}

function rows(data: Record<string, unknown>): Record<string, unknown>[] {
  return (data.rows as Record<string, unknown>[]) ?? [];
}

function metricVal(row: Record<string, unknown>, idx = 0): string {
  return ((row.metricValues as Record<string, unknown>[])[idx] as { value: string }).value;
}

function dimVal(row: Record<string, unknown>, idx = 0): string {
  return ((row.dimensionValues as Record<string, unknown>[])[idx] as { value: string }).value;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const secret = process.env.ANALYTICS_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'ANALYTICS_SECRET not configured' }, { status: 500 });
  }
  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Params ────────────────────────────────────────────────────────────────
  const days  = Math.min(parseInt(req.nextUrl.searchParams.get('days') ?? '30'), 365);
  const start = `${days}daysAgo`;
  const end   = 'today';

  try {
    const token = await getGoogleAccessToken();

    // ── Overview ─────────────────────────────────────────────────────────────
    const overviewData = await ga4Report(token, {
      dateRanges: [{ startDate: start, endDate: end }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'eventCount' },
      ],
    });
    const ov = rows(overviewData)[0];
    const overview = ov ? {
      sessions            : parseInt(metricVal(ov, 0)),
      users               : parseInt(metricVal(ov, 1)),
      new_users           : parseInt(metricVal(ov, 2)),
      bounce_rate         : parseFloat(metricVal(ov, 3)),
      avg_session_duration: parseFloat(metricVal(ov, 4)),
      total_events        : parseInt(metricVal(ov, 5)),
    } : {};

    // ── Top Countries ─────────────────────────────────────────────────────────
    const countryData = await ga4Report(token, {
      dateRanges : [{ startDate: start, endDate: end }],
      dimensions : [{ name: 'country' }],
      metrics    : [{ name: 'sessions' }, { name: 'bounceRate' }, { name: 'averageSessionDuration' }],
      orderBys   : [{ metric: { metricName: 'sessions' }, desc: true }],
      limit      : 8,
    });
    const top_countries = rows(countryData).map(r => ({
      country              : dimVal(r, 0),
      sessions             : parseInt(metricVal(r, 0)),
      bounce_rate          : parseFloat(metricVal(r, 1)),
      avg_session_duration : parseFloat(metricVal(r, 2)),
    }));

    // ── Top Referrers ─────────────────────────────────────────────────────────
    const referrerData = await ga4Report(token, {
      dateRanges: [{ startDate: start, endDate: end }],
      dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
      metrics   : [{ name: 'sessions' }, { name: 'bounceRate' }, { name: 'averageSessionDuration' }],
      orderBys  : [{ metric: { metricName: 'sessions' }, desc: true }],
      limit     : 10,
    });
    const top_referrers = rows(referrerData).map(r => ({
      source               : dimVal(r, 0),
      medium               : dimVal(r, 1),
      sessions             : parseInt(metricVal(r, 0)),
      bounce_rate          : parseFloat(metricVal(r, 1)),
      avg_session_duration : parseFloat(metricVal(r, 2)),
    }));

    // ── Device Breakdown ──────────────────────────────────────────────────────
    const deviceData = await ga4Report(token, {
      dateRanges: [{ startDate: start, endDate: end }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics   : [{ name: 'sessions' }, { name: 'bounceRate' }, { name: 'averageSessionDuration' }],
      orderBys  : [{ metric: { metricName: 'sessions' }, desc: true }],
    });
    const devices = rows(deviceData).map(r => ({
      device               : dimVal(r, 0),
      sessions             : parseInt(metricVal(r, 0)),
      bounce_rate          : parseFloat(metricVal(r, 1)),
      avg_session_duration : parseFloat(metricVal(r, 2)),
    }));

    // ── Custom Events ─────────────────────────────────────────────────────────
    const eventData = await ga4Report(token, {
      dateRanges: [{ startDate: start, endDate: end }],
      dimensions: [{ name: 'eventName' }],
      metrics   : [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName    : 'eventName',
          inListFilter : {
            values: ['calculation_performed', 'marketplace_selected', 'whatsapp_share', 'feedback_submitted'],
          },
        },
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    });
    const custom_events: Record<string, number> = {};
    rows(eventData).forEach(r => { custom_events[dimVal(r, 0)] = parseInt(metricVal(r, 0)); });

    // ── Marketplace Breakdown ─────────────────────────────────────────────────
    const mktData = await ga4Report(token, {
      dateRanges: [{ startDate: start, endDate: end }],
      dimensions: [{ name: 'eventName' }, { name: 'customEvent:marketplace' }],
      metrics   : [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: { fieldName: 'eventName', stringFilter: { value: 'calculation_performed' } },
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    });
    const marketplace_breakdown: Record<string, number> = {};
    rows(mktData).forEach(r => {
      const mkt = dimVal(r, 1) || '(not set)';
      marketplace_breakdown[mkt] = parseInt(metricVal(r, 0));
    });

    // ── Daily Trend ───────────────────────────────────────────────────────────
    const trendData = await ga4Report(token, {
      dateRanges: [{ startDate: start, endDate: end }],
      dimensions: [{ name: 'date' }],
      metrics   : [{ name: 'sessions' }, { name: 'totalUsers' }],
      orderBys  : [{ dimension: { dimensionName: 'date' } }],
    });
    const daily_trend = rows(trendData).map(r => {
      const raw = dimVal(r, 0);
      return {
        date    : `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}`,
        sessions: parseInt(metricVal(r, 0)),
        users   : parseInt(metricVal(r, 1)),
      };
    });

    // ── Funnel ────────────────────────────────────────────────────────────────
    const sessions   = (overview as { sessions?: number }).sessions   ?? 0;
    const calcs      = custom_events['calculation_performed'] ?? 0;
    const shares     = custom_events['whatsapp_share']        ?? 0;
    const feedbacks  = custom_events['feedback_submitted']    ?? 0;
    const funnel = {
      sessions,
      calculations        : calcs,
      shares,
      feedbacks,
      calculation_rate    : sessions > 0 ? +(calcs  / sessions).toFixed(2) : 0,
      share_rate          : calcs   > 0 ? +(shares / calcs).toFixed(4)    : 0,
      feedback_rate       : calcs   > 0 ? +(feedbacks / calcs).toFixed(4) : 0,
    };

    // ── Response ──────────────────────────────────────────────────────────────
    return NextResponse.json({
      period_days         : days,
      generated_at        : new Date().toISOString(),
      overview,
      top_countries,
      top_referrers,
      devices,
      custom_events,
      marketplace_breakdown,
      funnel,
      daily_trend,
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type' : 'application/json',
      },
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[analytics/summary]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
