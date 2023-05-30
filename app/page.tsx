import Image from "next/image";

import { getGuildForumThreads, getGuildScheduledEvents } from "@/app/lib/discord";

export default async function Home() {
  console.log("Events", await getGuildScheduledEvents())
  
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <Image
        src="/reactadelphia-logo.png"
        alt="Reactadelphia logo"
        width={700}
        height={500}
      />
    </main>
  );
}
