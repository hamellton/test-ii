import Layout from "@components/Layout/Layout";
import Link from "next/link";
import useSWR from "swr";
import { useEffect, useState } from "react";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";
import { UserPublic } from "@utils/types";
import { fetchGetJSON } from "@utils/api-helpers";
import { 
  HostsContainer, 
  HostsTitle, 
  HostsFilterContainer, 
  HostsChip, 
  HostsGridContainer, 
  HostCard, 
  HostImageWrapper, 
  HostName, 
  HostBio, 
  HostsHeadingContainer,
  HostDescription,
  ImageStyle
} from "../../styles/pages/HostsPage.styles";
import { USERS_ALL_PUBLIC_ENDPOINT } from "@config";
import { logAlphabeticalSortClick, logHostCardClick } from "@utils/analytics-helpers";


function getFirstSentence(text: string) {
  const match = text.match(/[^.!?]+[.!?]/);
  return match ? match[0] : text;
}

export default function Hosts() {
  const { data: hostsData, error } = useSWR<UserPublic[]>(`${USERS_ALL_PUBLIC_ENDPOINT}`, fetchGetJSON);
  const [hosts, setHosts] = useState<UserPublic[]>([]);
  const [alphabeticalSort, setAlphabeticalSort] = useState<boolean>(false);

  useEffect(() => {
    if (hostsData) {
      const approvedHosts = hostsData.filter((host) => 
        Array.isArray(host.salons) && 
        host.salons.some(salon => salon.state === "APPROVED")
      );
      setHosts(approvedHosts);
    }
  }, [hostsData]);

  useEffect(() => {
    if (alphabeticalSort) {
      const sortedHosts = sortHostsAlphabetically([...hosts]);
      setHosts(sortedHosts);
    } else {
      if (hostsData) {
        const approvedHosts = hostsData.filter((host) => 
          Array.isArray(host.salons) && 
            host.salons.some(salon => salon.state === "APPROVED")
        );
        setHosts(approvedHosts);
      }
    }
  }, [alphabeticalSort, hosts, hostsData]);

  const handleAlphabeticalSortClick = () => {
    setAlphabeticalSort(!alphabeticalSort);
    logAlphabeticalSortClick();
    // const sortedHosts = sortHostsAlphabetically([...hosts]);
    // setHosts(sortedHosts);
  };

  if (error) return <div>Failed to load</div>;
  if (!hosts || !(hosts.length > 0)) return <LoadingModal isLoading={!hosts || !(hosts.length > 0)} />;

  return (
    <Layout>
      <HostsContainer>
        <HostsHeadingContainer>
          <HostsTitle>Meet our hosts</HostsTitle>
          <HostsFilterContainer>
            <HostsChip alphabeticalSort={alphabeticalSort} label="A - Z" variant="outlined" onClick={handleAlphabeticalSortClick} />
            {/* <Chip label="Upcoming salons" variant="outlined" sx={{
            color: "#605054",
            fontSize: "1.1rem",
            padding: "1rem",
            border: "solid 1px #AEA5A5",
          }}
          onClick={() => { handleSortByTimeClick() }}
          /> */}
          </HostsFilterContainer>
        </HostsHeadingContainer>
        <HostsGridContainer>
          {hosts.map((host) => (
            <a
              key={host.id}
              href="#"
              onClick={(event) => {
                event.preventDefault();
                logHostCardClick(host.id || "");
                window.location.href = `/hosts/${host.slug}`;
              }}
            >
              <HostCard>
                <HostImageWrapper>
                  <ImageStyle src={host.profileImageUrl} alt={host.fullname} width={200} height={200} />
                </HostImageWrapper>
                <HostName>{host.fullname}</HostName>
                <HostDescription>Anthropologist & Writer</HostDescription>
                <HostBio>{getFirstSentence(host.bio)}</HostBio>
              </HostCard>
            </a>
          ))}
        </HostsGridContainer>
      </HostsContainer>
    </Layout>
  );
}

function sortHostsAlphabetically(hosts: UserPublic[]) {
  return hosts.sort((a, b) => {
    const surnameA = a.fullname.split(" ")[1];
    const surnameB = b.fullname.split(" ")[1];

    if (!surnameA && surnameB) return 1;
    if (surnameA && !surnameB) return -1;
    if (!surnameA && !surnameB) return 0;

    return surnameA.localeCompare(surnameB);
  });
}
