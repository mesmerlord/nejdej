/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getSession } from 'next-auth/react';
import Redis from 'ioredis';

export const advertRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      title: z.string().min(1).max(100),
      description: z.string().min(1),
      subCategory: z.string().optional(),
      photos: z.array(z.string()).optional(),
      price: z.number().optional(),
    }),
    async resolve({ ctx, input }) {
      const { photos, title, description, subCategory, price } = input;
      console.log(photos);
      const advert = await ctx.prisma.advert.create({
        data: {
          photos: photos
            ? {
                connect: photos?.map((photo) => {
                  return { id: photo };
                }),
              }
            : undefined,
          title,
          description,
          subCategory: { connect: { id: subCategory } },
          price,
        },
        select: {
          title: true,
          description: true,
          subCategory: true,
          price: true,
          photos: true,
          id: true,
        },
      });
      const advertView = ctx.prisma.view.create({
        data: { Advert: { connect: { id: advert.id } } },
      });
      return advert;
    },
  })

  // read
  .query('infinite', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().optional(),
      subCategory: z.string().optional(), // <-- "cursor" needs to exist, but can be any type
    }),
    async resolve({ input, ctx }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      const limit = input.limit ?? 50;
      const { cursor, subCategory } = input;
      const items = await ctx.prisma.advert.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: subCategory
          ? { subCategory: { some: { id: subCategory } } }
          : undefined,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: 'asc',
        },
      });
      return items;
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      let redis = new Redis(process.env.REDIS_URL);

      const count = await redis.get(id);
      let advert;
      if (count) {
        advert = JSON.parse(count);
      } else {
        advert = await ctx.prisma.advert.findUnique({
          where: { id },
          select: {
            photos: {
              select: {
                url: true,
                id: true,
              },
            },
            id: true,
            title: true,
            description: true,
            status: true,
            subCategory: {
              select: {
                id: true,
                enTitle: true,
                Category: {
                  select: {
                    id: true,
                    enTitle: true,
                  },
                },
              },
            },
            createdAt: true,
            updatedAt: true,
            User: { select: { name: true, email: true, image: true } },
            View: true,
            viewId: true,
          },
        });
        redis.set(id, JSON.stringify(advert));
      }
      if (!advert) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No advert with id '${id}'`,
        });
      }
      return advert;
    },
  })
  // update

  // delete
  .mutation('delete', {
    input: z.string().uuid(),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.advert.delete({ where: { id } });
      return id;
    },
  })
  .merge(
    'admin.',
    createRouter()
      .middleware(async ({ ctx, next }) => {
        const session = await getSession(ctx);
        const user = session?.user;
        if (!session?.user || !user?.email) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const user_role = await ctx.prisma.user.findUnique({
          where: {
            email: user.email,
          },
          select: { role: true },
        });
        return next();
      })
      .mutation('edit', {
        input: z.object({
          id: z.string().uuid(),
          data: z.object({
            title: z.string().min(1).max(32).optional(),
            text: z.string().min(1).optional(),
          }),
        }),
        async resolve({ ctx, input }) {
          const { id, data } = input;
          const advert = await ctx.prisma.advert.update({
            where: { id },
            data,
          });
          return advert;
        },
      })
      .query('infinite', {
        input: z.object({
          limit: z.number().min(1).max(100).nullish(),
          cursor: z.string().optional(),
          subCategory: z.string().optional(), // <-- "cursor" needs to exist, but can be any type
        }),
        async resolve({ input, ctx }) {
          /**
           * For pagination you can have a look at this docs site
           * @link https://trpc.io/docs/useInfiniteQuery
           */

          const limit = input.limit ?? 50;
          const { cursor, subCategory } = input;
          const items = await ctx.prisma.advert.findMany({
            take: limit + 1, // get an extra item at the end which we'll use as next cursor
            where: subCategory
              ? { subCategory: { some: { id: subCategory } } }
              : undefined,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
              createdAt: 'asc',
            },
          });
          return items;
        },
      }),
  );
