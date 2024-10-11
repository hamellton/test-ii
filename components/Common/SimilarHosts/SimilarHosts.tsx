import React, { useEffect, useState } from "react";
import { SimilarEventsWrapper } from "./SimilarHosts.styles";
import { Box } from "@mui/material";
import Link from "next/link";
import { UserPublic } from "@utils/types";
import { USERS_ALL_PUBLIC_ENDPOINT } from "@config";
import useSWR from "swr";
import { fetchGetJSON } from "@utils/api-helpers";
import HostCard from "../HostCard/HostCard";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import { logSimilarHostsShowMoreClick } from "@utils/analytics-helpers";

function sortHostsAlphabetically(hosts: UserPublic[]) {
  return hosts.sort((a, b) => {
    const surnameA = a.fullname.split(" ")[1];
    const surnameB = b.fullname.split(" ")[1];

    if (surnameA === undefined && surnameB !== undefined) return 1;
    if (surnameA !== undefined && surnameB === undefined) return -1;
    if (surnameA === undefined && surnameB === undefined) return 0;

    return surnameA.localeCompare(surnameB);
  });
}

const SimilarHosts = () => {
  const { data: hostsData, error } = useSWR<UserPublic[]>(`${USERS_ALL_PUBLIC_ENDPOINT}`, fetchGetJSON);
  const [hosts, setHosts] = useState<UserPublic[]>([]);
  const [displayHosts, setDisplayHosts] = useState<UserPublic[]>([]);

  const { device } = useDevice() ?? {};

  useEffect(() => {
    if (hostsData) {
      const sortedHosts = sortHostsAlphabetically(hostsData);
      setHosts(sortedHosts);
    }
  }, [hostsData]);

  useEffect(() => {
    // Define the filtered hosts
    const filteredHosts = hosts.filter((host: UserPublic) => (host.salons?.length ?? 0) > 0);

    // Conditionally slice the filtered hosts based on the device type
    setDisplayHosts(device === DeviceTypes.MOBILE ? filteredHosts : filteredHosts.slice(0, 3));
  }, [device, hosts]);

  return (
    <SimilarEventsWrapper>
      {hosts && hosts.length > 0 && (
        <div className="similar-events">
          <div className="similar-events-heading">
            <div className="similar-events-heading__title">
              Similar hosts
            </div>
            <div className="similar-events-heading__show-more">
              <Link href={"/hosts"} onClick={() => logSimilarHostsShowMoreClick()}>
                Show more
              </Link>
              <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 9.17806L5.16667 5.01139L1 0.844727M6.83333 9.17806L11 5.01139L6.83333 0.844727" stroke="#FC714E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <Box className="slider-container">
            <Box className="slider">
              {displayHosts.map((host: UserPublic, index) => (
                <HostCard key={host.fullname + index} hostData={host} />
              ))}
            </Box>
          </Box>
        </div>
      )}
    </SimilarEventsWrapper>
  );
};

export default SimilarHosts;
