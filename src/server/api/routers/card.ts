/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import slug from "slug";

import {
  createTRPCRouter, privateProcedure
} from "~/server/api/trpc";

export const cardRouter = createTRPCRouter({
  publishCard: privateProcedure.input(z.object({
    website: z.string(), title: z.string()
  })).mutation(async ({ ctx, input }) => {
    const { email, image, name } = ctx.session.user;
    const { title, website } = input;

    if (!email || !image || !name) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const card = await ctx.prisma.Card.upsert({
      create: {
        title,
        website,
        email,
        imgSrc: image,
        name,
        slug: slug(name)
      },
      update: {
        title,
        website,
        email,
        imgSrc: image,
        name,
        slug: slug(name)
      },
      where: {
        slug: slug(name)
      }
    })
    return card
  }),
  
  
});
