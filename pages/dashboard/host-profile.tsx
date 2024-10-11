import ProfileForm from "@components/Dashboard/Forms/ProfileForm";
import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import { useState, useEffect } from "react";
import { fetchGetJSON } from "@utils/api-helpers";
import { USER_STATUS_ENDPOINT } from "@config";
import { frontEndAuthResponse } from "@utils/types";
import useSWR from "swr";
import { USER_ENDPOINT } from "@config";

export default function HostProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: userStatus, error: userStatusError } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);
  const { data: user, error: userError } = useSWR(userStatus?.userId ? `${USER_ENDPOINT}/${userStatus.userId}` : null, fetchGetJSON);

  // True when no users or there is an error
  useEffect(() => {
    setIsLoading(!user || !!userError || !!userStatusError);
  }, [user, userError, userStatusError]);

  if (userError || userStatusError) return <div>failed to load user</div>;

  return (
    <DashboardLayout isLoading={isLoading} user={userStatus}>
      {user && <ProfileForm isLoading={false} setIsLoading={setIsLoading} user={user} />}
    </DashboardLayout>
  );
}