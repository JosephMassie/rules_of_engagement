import { NextResponse } from 'next/server';
import { loadSeasons } from '../../../lib/seasons';
import { getPostHogClient } from '@/lib/posthog-server';

export async function GET(request: Request) {
    const posthog = getPostHogClient();
    // Use a server-side identifier for anonymous API tracking
    const distinctId = request.headers.get('x-posthog-distinct-id') || 'anonymous-api-user';

    try {
        const seasons = await loadSeasons();

        posthog.capture({
            distinctId,
            event: 'seasons_api_request',
            properties: {
                seasons_count: Object.keys(seasons).length,
                source: 'api',
            },
        });
        await posthog.flush();

        return NextResponse.json(seasons);
    } catch (err) {
        console.error('Failed to load seasons in API route:', err);

        posthog.capture({
            distinctId,
            event: 'seasons_api_error',
            properties: {
                error_message: err instanceof Error ? err.message : 'Unknown error',
                source: 'api',
            },
        });
        await posthog.flush();

        return NextResponse.json(
            { error: 'Failed to load seasons' },
            { status: 500 }
        );
    }
}
