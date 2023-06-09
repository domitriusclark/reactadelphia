import { APIMessage, APIChannel } from "discord-api-types/v10";
import { getChannelMessage } from "@/app/lib/discord";

interface SortedThread extends APIThreadChannel {
    lastMessage?: APIMessage | undefined;
}

export async function sortThreads(threads: APIChannel[]) {  
    const sortedThreads = await Promise.all(
      threads.map(async (thread) => {             
        if (thread.type === 11 && thread.last_message_id) {
          const lastMessage = await getChannelMessage(
            thread.id,
            thread.last_message_id
          );     
          return {
            ...thread,
            lastMessage,
          };
        } 
      })
    ) as SortedThread[];

    const sorted = sortedThreads.sort((a, b) => {             
      const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return bTime - aTime;
    });
    
  
    return sorted;
  }