import ButtonGrid from "@components/Dashboard/Forms/HelperComponents/ButtonGrid";
// import EpisodeTable from "@components/Tables/EpisodeTable/EpisodeTable";
import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import DashboardNav from "@components/Dashboard/Common/DashboardNav/DashboardNav";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { fetchGetJSON } from "@utils/api-helpers";
import useSWR from "swr";
import { SALON_ENDPOINT, SERIES_ENDPOINT, USER_STATUS_ENDPOINT } from "@config";
import { useRouter } from "next/router";
import { ExtendedSalon, frontEndAuthResponse } from "@utils/types";
import { getHeadlineText } from "@utils/frontend-helpers";
// import HostRequest from "@components/Dashboard/Modals/HostRequest/HostRequest";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import { EventLayoutContainer } from "./salon";

const SeriesForm = dynamic(() => import("@components/Dashboard/Forms/SeriesForm/SeriesForm"), {
  ssr: false,
});

export default function Series() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { device } = useDevice() ?? {};

  const { data: salons, error } = useSWR<ExtendedSalon[]>(id ? `${SERIES_ENDPOINT}/${id}?episodes=true` : null, fetchGetJSON);
  // const { data: episodes, error: episodesError } = useSWR<ExtendedSalon[]>(`${SALON_ENDPOINT}/episodes`, fetchGetJSON);

  const { data: user, error: userError } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);

  // True when no users or there is an error
  useEffect(() => {
    const isUserLoading = !user || !!userError;
    const isSalonsLoading = id ? !salons || !!error : false;
    setIsLoading(isUserLoading || isSalonsLoading);
  }, [user, userError, salons, error, id]);
  

  return (
    <DashboardLayout isLoading={isLoading}>
      {/* <HostRequest user={user} /> */}
      {device === DeviceTypes.MOBILE ? (
        <EventLayoutContainer>
          <DashboardNav />
          <ButtonGrid heading={getHeadlineText("Series", id? true: false, false)} />
        </EventLayoutContainer>
      ) : (
        <>
          <DashboardNav />
          <ButtonGrid heading={getHeadlineText("Series", id? true: false, false)} />
        </>
      )}
      <SeriesForm salons={salons} isLoading={isLoading} setIsLoading={setIsLoading} />
    </DashboardLayout>
  );
}


