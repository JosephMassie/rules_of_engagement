export default async function TestPage({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    return <p>Test page {mission}</p>;
}
