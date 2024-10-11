import prisma from "@utils/db";

type Model =
  | "accounts"
  | "users"
  | "salons"
  | "specialGuests"
  | "tags"
  | "series"
  | "publicTickets"
  | "memberTickets"
  | "tips"
  | "hostRequests"
  | "legacyHosts";

export interface DataApiRequest {
  models: Model[];
}

interface DataResponse {
  account?: any[];
  users?: any[];
  salons?: any[];
  specialGuests?: any[];
  tags?: any[];
  series?: any[];
  publicTickets?: any[];
  memberTickets?: any[];
  tips?: any[];
  hostRequests?: any[];
  legacyHosts?: any[];
}

export async function getDataFromServices(models: Model[] = []): Promise<DataResponse> {
  const data: DataResponse | any = {};

  const serviceMap: Record<string, () => Promise<any>> = {
    account: () => prisma.account.findMany(),
    users: () => prisma.user.findMany(),
    salons: () => prisma.salon.findMany(),
    specialGuests: () => prisma.specialGuest.findMany(),
    tags: () => prisma.tag.findMany(),
    series: () => prisma.series.findMany(),
    publicTickets: () => prisma.publicTicket.findMany(),
    memberTickets: () => prisma.memberTicket.findMany(),
    tips: () => prisma.tip.findMany(),
    hostRequests: () => prisma.hostRequest.findMany(),
    legacyHosts: () => prisma.legacyHost.findMany(),
  };

  if (models.length === 0) {
    // If no models specified, fetch all
    await Promise.all(
      Object.keys(serviceMap).map(async (model) => {
        data[model] = await serviceMap[model]();
      })
    );
  } else {
    // Fetch only the specified models
    await Promise.all(
      models.map(async (model) => {
        if (serviceMap[model]) {
          data[model] = await serviceMap[model]();
        }
      })
    );
  }

  return data;
}
