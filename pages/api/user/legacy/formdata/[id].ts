import { NextApiResponse } from 'next';
import { AuthorizedRequest, ErrorResponse, HTTPMethod, LegactHostValues } from '@utils/types';
import { authenticateMiddleware } from '@utils/authMiddleware'
import prisma from "@utils/db"
import slugify from 'slugify'
import { slugifyOptions } from "@config";
import { Prisma, LegacyHost } from '@prisma/client';
import { markdownToHtml, uploadS3ImageFromUrl } from '../../../salon/legacy/formdata/[id]'

const createLegacyHost = async (hostBody: LegactHostValues, imageUrl: string): Promise<LegacyHost> => {
  const slug = slugify(hostBody.name, slugifyOptions);

  const data: Prisma.LegacyHostCreateInput = {
    fullname: hostBody.name,
    bio: hostBody.description,
    profileImageUrl: imageUrl,
    slug: slug,
  };
  return await prisma.legacyHost.create({ data });
};

const handlePostRequest = async (req: AuthorizedRequest, res: NextApiResponse): Promise<void> => {
  const hostBody = req.body
  hostBody.description = markdownToHtml(hostBody.description)

  // Create S3 Image
  let s3: string;
  try {
    s3 = await uploadS3ImageFromUrl(hostBody.image_url, hostBody.name, process.env.S3_HOST_KEY!)
    console.log('S3 succeeded:', s3)
  } catch (error) {
    console.log(`Error S3 in ${hostBody.title}: `, error)
    return res.status(500).json('Error uploading to S3');
  }

  try {
    const host = await createLegacyHost(hostBody, s3);
    res.status(201).json(host);
  } catch (error) {
    console.log(`Error in ${hostBody.name}: `, error)
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};


const handler = async (req: AuthorizedRequest, res: NextApiResponse<LegacyHost | ErrorResponse>) => {
  if (req.method === HTTPMethod.Post) {
    return handlePostRequest(req, res);
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
};

export default authenticateMiddleware(handler);
