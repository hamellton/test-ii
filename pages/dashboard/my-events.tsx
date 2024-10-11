import EventsTable from "@components/Dashboard/MyEvents/EventsTable/EventsTable";
import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import useSWR from "swr";
import { fetchGetJSON } from "@utils/api-helpers";
import { SALON_ENDPOINT, SERIES_ENDPOINT, USER_STATUS_ENDPOINT } from "@config";
import { frontEndAuthResponse } from "@utils/types";

export default function Events() {

  const { data: user, error: userError } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);
  const { data: salons, error: salonError } = useSWR(`${SALON_ENDPOINT}/all`, fetchGetJSON);
  const { data: series, error: seriesError } = useSWR(`${SERIES_ENDPOINT}/all`, fetchGetJSON);

  if (userError) return <div>failed to load user</div>;
  if (salonError) return <div>failed to load salons</div>;
  if (seriesError) return <div>failed to load series</div>;
  if (!salons || !series || !user) return <DashboardLayout isLoading={true} user={user}><></></DashboardLayout >;

  return (
    <EventsTable user={user} salons={salons} series={series} title="Your Events" actionCard={true} />
  );
}