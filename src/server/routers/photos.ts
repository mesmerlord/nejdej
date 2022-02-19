import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getSession } from 'next-auth/react';
import fs from 'fs';
const { Storage } = require('@google-cloud/storage');
const slugify = require('slugify');

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export const photosRouter = createRouter().mutation('uploadFile', {
  input: z.object({
    name: z.string(),
    fileEncoded: z.string(),
  }),
  async resolve({ ctx, input }) {
    const session = await getSession(ctx);
    if (!session?.user?.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const { fileEncoded, name } = input;
    const fileName = slugify(name);
    const data = fileEncoded.replace(/^data:image\/\w+;base64,/, '');
    const filePath = './uploads/photos';
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    const filePathWithName = `${filePath}/${fileName}`;
    fs.writeFile(
      filePathWithName,
      data,
      { encoding: 'base64' },
      function (err) {},
    );
    const gCloudPath = `uploads/photos/${fileName}`;
    const storage = new Storage({ keyFilename: 'bazos.json' });
    const bucketName = 'nejdej-photos-storage';
    async function uploadFile() {
      await storage.bucket(bucketName).upload(filePathWithName, {
        destination: gCloudPath,
      });

      console.log(`${filePath} uploaded to ${bucketName}`);
    }
    const options = {
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: 'image/webp',
    };

    // Get a v4 signed URL for uploading file
    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);
    fs.writeFileSync('./test.txt', url);

    return uploadFile()
      .then(async () => {
        const url = `https://ik.imagekit.io/opyvhypp7cj/nejdej/${gCloudPath}`;
        const photo = await ctx.prisma.photo.create({
          data: {
            url,
            name: fileName,
          },
          select: {
            url: true,
            name: true,
            id: true,
          },
        });
        return photo;
      })
      .catch((err) => {
        console.log(err);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'File Upload Failed',
        });
      });
  },
});
