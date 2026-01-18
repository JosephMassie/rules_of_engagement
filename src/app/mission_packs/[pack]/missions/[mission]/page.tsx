import MissionDisplay from '@/components/mission_display';

export default async function Mission({
    params,
}: {
    params: Promise<{ pack: string; mission: string }>;
}) {
    const { pack, mission } = await params;

    return <MissionDisplay packKey={pack} missionKey={mission} />;
}
