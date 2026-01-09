import { NextResponse } from 'next/server';
import { loadSeasons } from '../../../lib/seasons';

export async function GET() {
    try {
        const seasons = await loadSeasons();
        return NextResponse.json(seasons);
    } catch (err) {
        console.error('Failed to load seasons in API route:', err);
        return NextResponse.json(
            { error: 'Failed to load seasons' },
            { status: 500 }
        );
    }
}
