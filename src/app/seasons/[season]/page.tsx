import SeasonDisplay from '@/components/season_display';

export default async function TestPage({
    params,
}: {
    params: Promise<{ season: string }>;
}) {
    const { season } = await params;

    return (
        <div>
            <SeasonDisplay seasonKey={season} />
        </div>
    );
}
