import MissionPackDisplay from '@/components/mission_pack_display';

export default async function TestPage({
    params,
}: {
    params: Promise<{ pack: string }>;
}) {
    const { pack } = await params;

    return <MissionPackDisplay packKey={pack} />;
}
