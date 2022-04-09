import { z } from "zod";
import { flagsRouter } from "./routers/flags/router.js";
import { createRouter } from "./routers/index.js";

type User = {
  id: string;
  name: string;
  bio?: string;
};

const users: Record<string, User> = {};

export const appRouter = createRouter()
  .query("getUserById", {
    input: z.string(),
    async resolve({ input }) {
      return users[input]; // input type is string
    },
  })
  .mutation("createUser", {
    // validate input with Zod
    input: z.object({
      name: z.string().min(3),
      bio: z.string().max(142).optional(),
    }),
    async resolve({ input }) {
      const id = Date.now().toString();
      const user: User = { id, ...input };
      users[user.id] = user;
      return user;
    },
  })
  .merge("flags:", flagsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
