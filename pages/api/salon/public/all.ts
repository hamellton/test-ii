import { ErrorResponse, ExtendedSalon, HTTPMethod, GroupedSalons } from "@utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getAllSalons, getSalonsAroundId, salonFuzzySearch, getNextSalon } from "@models/salon";

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse<GroupedSalons | ExtendedSalon[] | ExtendedSalon | ErrorResponse>) => {
  const nextSalon = req.query.nextSalon as string;
  const grouped = req.query.grouped as string;
  const searchTerms = req.query.terms as string;
  const salonId = req.query.salonId as string;
  const direction = req.query.direction as 'newer' | 'older';

  if (nextSalon) {
    const salon = await getNextSalon()
    if (salon) {
      return res.status(200).json(salon);
    } else {
      return res.status(404).json({ error: 'Salon not found' });
    }
  } else if (grouped) {
    const salons = await getSalonsAroundId(salonId, direction);
    if (salons) {
      return res.status(200).json(salons);
    } else {
      return res.status(404).json({ error: 'Salons not found' });
    }
  } else if (searchTerms) {
    const salons = await salonFuzzySearch(searchTerms);
    if (salons) {
      return res.status(200).json(salons);
    } else {
      return res.status(404).json({ error: 'Salons not found' });
    }
  } else {
    const salons = await getAllSalons();
    if (salons) {
      return res.status(200).json(salons);
    } else {
      return res.status(404).json({ error: 'Salons not found' });
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse<GroupedSalons | ExtendedSalon[] | ExtendedSalon | ErrorResponse>) => {
  if (req.method === HTTPMethod.Get) {
    return handleGetRequest(req, res);
  }
  else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default handler;
