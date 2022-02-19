import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';

const { Storage } = require('@google-cloud/storage');
const mime = require('mime-types');

const ImageTypes = z.enum([
  'image/png',
  'image/jpeg',
  'image/sgv+xml',
  'image/gif',
  'image/webp',
]);

export const photosRouter = createRouter().mutation('uploadFile', {
  input: z.object({
    fileType: ImageTypes,
    name: z.string(),
  }),
  async resolve({ ctx, input }) {
    const session = await getSession(ctx);

    if (!session?.user?.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const { fileType, name } = input;
    const fileExtension = mime.extension(fileType);
    const fileName = `${uuidv4()}.${fileExtension}`;
    let storage;
    if (process.env.NODE_ENV === 'production') {
      storage = new Storage();
    } else {
      storage = new Storage({ keyFilename: 'bazos.json' });
    }
    const bucketName = 'nejdej-photos-storage';
    const options = {
      action: 'write',
      expires: Date.now() + 12 * 60 * 60 * 1000, // 12 hours
      contentType: fileType,
    };
    const fullUrl = `https://ik.imagekit.io/opyvhypp7cj/nejdej/${fileName}`;
    const thumbnailUrl = `https://ik.imagekit.io/opyvhypp7cj/nejdej/${fileName}?tr=h-150,w-150,cm-force,bg-F3F3F3,ox-N35,oy-N50,ots-50,oa-6,otbg-70FFFF30`;

    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);
    return {
      signedUrl: url,
      fileName,
      originalName: name,
      thumbnailUrl,
      url: fullUrl,
    };
  },
});
