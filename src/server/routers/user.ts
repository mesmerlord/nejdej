/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getSession } from 'next-auth/react';

export const userRouter = createRouter()
  .query('me', {
    async resolve({ ctx, input }) {
      const session = await getSession(ctx);
      if (!session?.user?.email) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not Logged In' });
      }
      return ctx.prisma.user.findUnique({
        where: { email: session.user.email },
      });
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const user = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          email: true,
          Review: true,
          image: true,
          Listing: {
            select: {
              id: true,
              photos: {
                select: {
                  url: true,
                },
              },
              description: true,
              title: true,
            },
          },
        },
      });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${id}'`,
        });
      }
      return user;
    },
  });
