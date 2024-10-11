import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import DashboardNav from "@components/Dashboard/Common/DashboardNav/DashboardNav";
import ButtonGrid from "@components/Dashboard/Forms/HelperComponents/ButtonGrid";
import { getHeadlineText } from "@utils/frontend-helpers";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { frontEndAuthResponse } from "@utils/types";
import useSWR from "swr";
import { USER_STATUS_ENDPOINT } from "@config";
import { fetchGetJSON } from "@utils/api-helpers";
import styled from "styled-components";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";

const SalonForm = dynamic(() => import("@components/Dashboard/Forms/SalonForm/SalonForm"), {
  ssr: false,
});

export const EventLayoutContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  gap: 20px;
  text-align: center;
`;

export default function Salon() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { device } = useDevice() ?? {};

  const { data: user, error: userError } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);

  // True when no users or there is an error
  useEffect(() => {
    setIsLoading(!user || !!userError);
  }, [user, userError]);

  return (
    <DashboardLayout isLoading={isLoading} user={user}>
      {device === DeviceTypes.MOBILE ? (
        <EventLayoutContainer>
          <DashboardNav />
          <ButtonGrid heading={getHeadlineText("Salon", id ? true: false, false)} />
        </EventLayoutContainer>
      ) : (
        <>
          <DashboardNav />
          <ButtonGrid heading={getHeadlineText("Salon", id ? true: false, false)} />
        </>
      )}
      <SalonForm isLoading={isLoading} setIsLoading={setIsLoading} isEpisode={false} />
    </DashboardLayout>
  );
}