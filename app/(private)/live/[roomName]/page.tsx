import LiveClient from "./client";

export default async function Page({
  params,
}: {
  params: Promise<{ roomName: string }>;
}) {
  const { roomName } = await params;

  return (
    <div>
      <LiveClient roomName={roomName} />
    </div>
  );
}
