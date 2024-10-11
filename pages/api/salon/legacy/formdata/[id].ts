import { NextApiResponse } from 'next';
import { AuthorizedRequest, ErrorResponse, HTTPMethod, LegacySalonFormValues } from '@utils/types';
import { authenticateMiddleware } from '@utils/authMiddleware'
import { getUserById } from '@models/user';
import prisma from "@utils/db"
import slugify from 'slugify'
import { slugifyOptions } from "@config";
import { Prisma, SALON_STATE, Salon, CATEGORY } from '@prisma/client';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fetch from 'node-fetch';

export function markdownToHtml(markdown: string) {
  // Convert Markdown links to HTML hyperlinks
  let html = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, ' <a href="$2" style="color: #d75a55; text-decoration: underline;">$1</a> ');

  // Convert Markdown bold to HTML strong tag
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert Markdown italic to HTML em tag
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Replace double newlines with paragraph tags
  html = html.replace(/\n\n/g, '</p><p>');

  // Encapsulate in paragraph tags to ensure proper formatting
  html = `<p>${html}</p>`;

  // Replace consecutive <br> tags wrapped in <p> tags which might have been introduced by replacements
  html = html.replace(/<p><br>/g, '<p>');
  html = html.replace(/<br><\/p>/g, '</p>');

  return html;
}

const createLegacySalon = async (salonBody: LegacySalonFormValues, imageUrl: string, hostId: string): Promise<Salon> => {
  const slug = slugify(salonBody.title, slugifyOptions);

  const data: Prisma.SalonCreateInput = {
    title: salonBody.title,
    description: salonBody.description,
    imageUrl: imageUrl,

    state: SALON_STATE.APPROVED,
    type: salonBody.salonType,
    startTime: salonBody.startTime,
    endTime: salonBody.endTime,
    memberSpaces: 10,
    publicSpaces: 10,
    publicPrice: 15,
    category: CATEGORY.LEGACY,
    locationType: salonBody.locationType,
    location: salonBody.location,
    locationUrl: salonBody.locationUrl,
    slug: slug,
    legacyHost: salonBody.host,
    host: {
      connect: {
        id: hostId
      }
    },
    ...(salonBody.seriesId && salonBody.salonType === 'SERIES_EPISODE' && {
      series: {
        connect: {
          id: salonBody.seriesId
        }
      }
    })
  };
  const salon = await prisma.salon.create({ data });
  return salon;
};

const handlePostRequest = async (req: AuthorizedRequest, res: NextApiResponse): Promise<void> => {
  const salonBody = req.body
  salonBody.description = markdownToHtml(salonBody.description)

  // Create S3 Image
  let s3: string;
  try {
    s3 = await uploadS3ImageFromUrl(salonBody.imageURL, salonBody.title, process.env.S3_SALON_KEY!)
    console.log('S3 succeeded:', s3)
  } catch (error) {
    console.log(`Error S3 in ${salonBody.title}: `, error)
    return res.status(500).json('Error uploading to S3');
  }

  try {
    const host = await getUserById(req.userId);
    const salon = await createLegacySalon(salonBody, s3, host!.id);
    res.status(201).json(salon);
  } catch (error) {
    console.log(`Error in ${salonBody.title}: `, error)
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

const s3Client = new S3Client({
  endpoint: process.env.S3_HOSTNAME,
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  region: process.env.S3_REGION, // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET as string
  }
});

export const uploadS3ImageFromUrl = async (imageUrl: string, title: string, s3key: string) => {
  const key = Date.now().toString() + '-' + slugify(title, slugifyOptions);
  try {
    // Fetch image from URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const buffer = await response.buffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Upload to S3
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${s3key}/${key}`,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read' as const
    };

    await s3Client.send(new PutObjectCommand(params));
    return `${process.env.S3_HOSTNAME}/${params.Bucket}/${params.Key}`;
  } catch (err) {
    throw { error: err, message: 'Error Uploading to S3' };
  }
};

const handler = async (req: AuthorizedRequest, res: NextApiResponse<Salon | Salon[] | ErrorResponse>) => {
  if (req.method === HTTPMethod.Post) {
    return handlePostRequest(req, res);
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
};

export default authenticateMiddleware(handler);
