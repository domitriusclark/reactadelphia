import type {
  APIChannel,
  APIMessage,
  APIGuildForumChannel,
  APIGuildScheduledEvent,  
} from "discord-api-types/v10";

import { sortThreads } from "@/app/utils/sortThreads";

const baseUrl = "https://discord.com/api/v10";

export async function getChannel(channelId: string ) {
  try {
    const response = await fetch(`${baseUrl}/channels/${channelId}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });
    const channel: APIChannel = await response.json();
    return channel;
  } catch (err) {
    console.error(err);
  }
}

export async function getGuildChannels() {
  try {
    const response = await fetch(
      `${baseUrl}/guilds/${process.env.DISCORD_GUILD_ID}/channels`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const channels: APIChannel[]= await response.json();

    return channels;
  } catch (err) {
    console.error(err);
  }
}

export async function getChannelMessages(channelId: string ) {
  try {
    const response = await fetch(`${baseUrl}/channels/${channelId}/messages`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });
    const messages: APIMessage[] = await response.json();
    return messages;
  } catch (err) {
    console.log(err);
  }
}

export async function getChannelMessage(channelId: string, messageId: string) {
  try {
    const response = await fetch(
      `${baseUrl}/channels/${channelId}/messages/${messageId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const message: APIMessage = await response.json();
    return message;
  } catch (err) {
    console.log(err);
  }
}

export async function getChannelArchivedThreads(
  channelId: string
){
  try {
    const response = await fetch(
      `${baseUrl}/channels/${channelId}/threads/archived/public`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const threads: APIGuildForumChannel[] = await response.json();    

    const sortedThreads = await sortThreads(threads);

    return sortedThreads;
  } catch (err) {
    console.error(err)
  }
}

export async function getChannelActiveThreads(forumChannel: APIChannel) {
  try {
    const response = await fetch(
      `${baseUrl}/guilds/${process.env.DISCORD_GUILD_ID}/threads/active`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    const threads: APIGuildForumChannel[] = await response.json();

    console.log("Active threads, ", threads)

    const activeThreadsFromForum = threads.filter(
      (thread) => thread.parent_id === forumChannel.id
    );

    const sortedThreads = await sortThreads(activeThreadsFromForum);

    return sortedThreads;
  } catch (err) {
    console.log(err);
  }
}

export function getForum(channels: APIChannel[]){
  // 15 is the channel type for Forum Channels
  const forum = channels.find(
    (channel) =>
      channel.type === 15 && channel.name === process.env.DISCORD_CHANNEL_NAME
  ) as APIGuildForumChannel;

  if (!forum) {
    throw new Error(`Could not find channel ${process.env.DISCORD_CHANNEL_NAME}`);
  }

  return forum;
}

export async function getGuildForumThreads() {
  const channels = await getGuildChannels();
  
  if (channels) {
    const forumChannel = getForum(channels);    
    const archivedThreads = await getChannelArchivedThreads(forumChannel.id);
    const threads = await getChannelActiveThreads(forumChannel);
    if (threads && archivedThreads) {
      const allThreads: APIGuildForumChannel[] = [...threads, ...archivedThreads];

      const tags = forumChannel.available_tags;

      return {
        allThreads
      }

      // return allThreads.map((thread) => {
      //   return {                
      //       id: thread.id,
      //       threads,
      //       archivedThreads,
      //       tags,
      //   };
      // });
    }
  }
}

export async function getGuildScheduledEvents() {  
  const res = await fetch(`${baseUrl}/guilds/${process.env.DISCORD_GUILD_ID}/scheduled-events`, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  });

  const scheduledEvents: APIGuildScheduledEvent[] = await res.json();

  return scheduledEvents;
}