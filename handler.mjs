import {
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3 = new S3Client({});

export const checkFileSize = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " "),
  );
  const params = {
    Bucket: bucket,
    Key: key,
  };

  const { ContentLength, ContentType } = await s3.send(
    new HeadObjectCommand(params),
  );

  if (!ContentLength) return;
  if (ContentLength > 5 * 1024 * 1024) {
    await s3.send(new DeleteObjectCommand(params));
    console.log(`Deleted ${key} as it was larger than 5MB`);
    return;
  }

  const { Body } = await s3.send(new GetObjectCommand(params));
  const BodyBuffer = Buffer.concat(await Body.toArray());
  const metadata = await sharp(BodyBuffer).metadata();
  const newKey = key.replace("temp/", "");
  const shouldResize = metadata.width > 1024 || metadata.height > 1024;

  const newBody = shouldResize
    ? await sharp(BodyBuffer)
        .resize(1024, 1024, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer()
    : BodyBuffer;

  shouldResize && console.log(`Resized ${key} to ${newKey}`);
  console.log(`Moved ${key} to ${newKey}`);

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: newKey,
      Body: newBody,
      ContentType,
    }),
  );

  console.log(`Deleted the original file ${key}`);
  await s3.send(new DeleteObjectCommand(params));
};
