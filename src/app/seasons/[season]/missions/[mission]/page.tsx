import MissionDisplay from '@/components/mission_display';

export default async function Mission({
    params,
}: {
    params: Promise<{ season: string; mission: string }>;
}) {
    const { season, mission } = await params;

    return <MissionDisplay seasonKey={season} missionKey={mission} />;
}
