import { z } from "zod";
import { createRouter } from "./index.js";
import { authenticatedUser, authenticateWithCuppaZeeToken } from "../utils/auth/index.js";
import { prisma } from "../utils/prisma.js";
import { config } from "../utils/config.js";

export const discordRouter = createRouter()
  .query("get_verify_url", {
    input: z.object({
      token: z.string(),
    }),
    async resolve({ input: { token } }) {
      return `${config.apiUrl}/auth/login/discord?state=${JSON.stringify({
        app: "bot",
        platform: "discord",
        redirect: `${config.botUrl}/verify?discord_token=${encodeURIComponent(token)}`,
      })}`;
    },
  })
  .mutation("link", {
    input: z
      .object({
        cuppazeeToken: z.string(),
        snowflake: z.string(),
      })
      .or(
        z.object({
          apiKey: z.string(),
          userId: z.number(),
          snowflake: z.string(),
        })
      ),
    async resolve({ input: { snowflake, ...input } }) {
      let userId;
      if ("cuppazeeToken" in input) {
        const token = await authenticateWithCuppaZeeToken(input.cuppazeeToken);
        userId = await authenticatedUser(token);
      } else if ("userId" in input && input.apiKey === config.botApiKey) {
        userId = input.userId;
      } else {
        throw new Error("Invalid input");
      }
      await prisma.player_discord.upsert({
        where: {
          discord_snowflake: snowflake,
        },
        create: {
          user_id: userId,
          discord_snowflake: snowflake,
        },
        update: {
          user_id: userId,
        },
      });
    },
  })
  .query("user", {
    input: z.object({
      snowflake: z.string(),
    }),
    async resolve({ input: { snowflake } }) {
      const user = await prisma.player_discord.findUnique({
        where: {
          discord_snowflake: snowflake,
        },
      });
      if (!user) {
        return null;
      }
      return user.user_id;
    },
  });
