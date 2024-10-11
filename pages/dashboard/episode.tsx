import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import DashboardNav from "@components/Dashboard/Common/DashboardNav/DashboardNav";
import ButtonGrid from "@components/Dashboard/Forms/HelperComponents/ButtonGrid";
import { getHeadlineText } from "@utils/frontend-helpers";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/router";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import { EventLayoutContainer } from "./salon";

const SalonForm = dynamic(() => import("@components/Dashboard/Forms/SalonForm/SalonForm"), {
  ssr: false,
});

export default function Episode() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { device } = useDevice() ?? {};

  return (
    <DashboardLayout isLoading={isLoading}>
      {device === DeviceTypes.MOBILE ? (
        <EventLayoutContainer>
          <DashboardNav />
          <ButtonGrid heading={getHeadlineText("Series", id ? true: false, true)} />
        </EventLayoutContainer>
      ) : (
        <>
          <DashboardNav />
          <ButtonGrid heading={getHeadlineText("Series", id ? true: false, true)} />
        </>
      )}
      <SalonForm isLoading={isLoading} setIsLoading={setIsLoading} isEpisode={true} />
    </DashboardLayout>
  );
}