import Hero from "@components/Homepage/Hero";
import PartnerSection from "@components/Homepage/Partners";
import Testimonials from "@components/Homepage/Testimonials";
import CommunitySection from "@components/Homepage/CommunitySection";
import Layout from "@components/Layout/Layout";
import useSWR from "swr";
import { II_CONTENTFUL_API } from "@config";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";
import { HomePageData } from "@utils/contentfulTypes";
import PressSection from "@components/Homepage/PressSection";
import MostofInterintellectSection from "@components/Homepage/MostofInterintellectSection/MostofInterintellectSection";
import MembershipSection from "@components/Homepage/MembershipSection/MembershipSection";
import styled from "styled-components";
import Image from "next/image";
import TeamMembers from "@components/Homepage/TeamMembers/TeamMembers";
import AboutUs from "@components/Homepage/AboutUs/AboutUs";
import SalonsSection from "@components/Homepage/SalonsSection/SalonsSection";
import { fetcher } from "@utils/frontend-helpers";
// import SalonSelection from "@components/Homepage/SalonSelection";
// import CTACommunity from "@components/Common/CTACommunity";
// import VideoEmbed from "@components/Homepage/VideoEmbed";
// import LandingPageForm from "@components/Homepage/LandingPageForm";
// import HostingCTA from "@components/Homepage/HostingCTA";
// import NewsletterCTA from "@components/Homepage/NewsletterCTA";
// import Hosts from "@components/Homepage/Hosts";

const DividerContainer = styled.div`
  transform: rotate(5deg);
  margin: 51px 42px;
  max-width: 122px;
  height: auto;
  overflow: hidden;
`;

const SeparatorImage = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  justify-content: flex-end;

  img {
    position: absolute;
    top: -25px;
    right: 71px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;


// const getSalonUrl = (slug: string) => `${SALON_ENDPOINT}/slug/${slug}`;


export default function Home() {
  // Spreadsheet URL: https://docs.google.com/spreadsheets/d/1g-Xojxb_09TIkaHegXbJVaNvSh5nGOUTRVGnuwWQAfQ/edit#gid=0
  // const spreadsheetId = "1g-Xojxb_09TIkaHegXbJVaNvSh5nGOUTRVGnuwWQAfQ"; // Replace with your Spreadsheet ID
  // const range = "Sheet1!A1:M10"; // Replace with your desired range
  // const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
  // const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  // const { data, error } = useSWR(url, fetcher);

  // const featuredSlugs = data?.values ? data.values[0].slice(1) : [];
  // const superSalonSlugs = data?.values ? data.values[1].slice(1) : [];
  // const comingUpSlugs = data?.values ? data.values[2].slice(1) : [];
  // const justLisedSlugs = data?.values ? data.values[3].slice(1) : [];

  // const { data: featuredSalon1 } = useSWR(featuredSlugs[0] ? getSalonUrl(featuredSlugs[0]) : null, fetcher);
  // const { data: featuredSalon2 } = useSWR(featuredSlugs[1] ? getSalonUrl(featuredSlugs[1]) : null, fetcher);
  // const { data: featuredSalon3 } = useSWR(featuredSlugs[2] ? getSalonUrl(featuredSlugs[2]) : null, fetcher);

  // const { data: superSalon1 } = useSWR(superSalonSlugs[0] ? getSalonUrl(superSalonSlugs[0]) : null, fetcher);
  // const { data: superSalon2 } = useSWR(superSalonSlugs[1] ? getSalonUrl(superSalonSlugs[1]) : null, fetcher);
  // const { data: superSalon3 } = useSWR(superSalonSlugs[2] ? getSalonUrl(superSalonSlugs[2]) : null, fetcher);

  // const { data: comingUpSalon1 } = useSWR(comingUpSlugs[0] ? getSalonUrl(comingUpSlugs[0]) : null, fetcher);
  // const { data: comingUpSalon2 } = useSWR(comingUpSlugs[1] ? getSalonUrl(comingUpSlugs[1]) : null, fetcher);
  // const { data: comingUpSalon3 } = useSWR(comingUpSlugs[2] ? getSalonUrl(comingUpSlugs[2]) : null, fetcher);

  // const { data: justListedSalon1 } = useSWR(justLisedSlugs[0] ? getSalonUrl(justLisedSlugs[0]) : null, fetcher);
  // const { data: justListedSalon2 } = useSWR(justLisedSlugs[1] ? getSalonUrl(justLisedSlugs[1]) : null, fetcher);
  // const { data: justListedSalon3 } = useSWR(justLisedSlugs[2] ? getSalonUrl(justLisedSlugs[2]) : null, fetcher);

  // const featured = [featuredSalon1, featuredSalon2, featuredSalon3].filter(Boolean) as ExtendedSalon[];
  // const superSalons = [superSalon1, superSalon2, superSalon3].filter(Boolean) as ExtendedSalon[];
  // const comingUp = [comingUpSalon1, comingUpSalon2, comingUpSalon3].filter(Boolean) as ExtendedSalon[];
  // const justListed = [justListedSalon1, justListedSalon2, justListedSalon3].filter(Boolean) as ExtendedSalon[];

  // if (error) return <div>Failed to load data</div>;
  // if (!data || !contenfulPage || !contenfulPage.value) return <LoadingModal isLoading={!data} />;

  const { data: contenfulPage } = useSWR<HomePageData>(`${II_CONTENTFUL_API}/pages?name=homePage`, fetcher);

  if (!contenfulPage || !contenfulPage.value) return <LoadingModal isLoading={!contenfulPage || !contenfulPage.value} />;

  const {
    heroSection,
    partnersSection,
    mostofInterintellectCards,
    joinCommunitySection,
    subscriptionsSection,
    testimonialsSection,
    teamMembersSection,
    aboutUsSection,
    salonsSection,
  } 
  = contenfulPage.value;

  return (
    <Layout>
      <Hero data={heroSection} />
      <PartnerSection data={partnersSection} />
      <MostofInterintellectSection data={mostofInterintellectCards} />
      {/* <SalonSelection heading="Editors' Picks" salons={featured as ExtendedSalon[]} isSuperSalon={false} /> */}
      {/* <CTACommunity /> */}
      {/* <SalonSelection heading="SuperSalons" salons={superSalons as ExtendedSalon[]} isSuperSalon={true} /> */}
      {/* <SalonSelection heading="Coming Up Next" salons={comingUp} isSuperSalon={false} /> */}
      {/* <LandingPageForm /> */}
      {/* <SalonSelection heading="Just Listed" salons={justListed as ExtendedSalon[]} isSuperSalon={false} /> */}
      {/* <NewsletterCTA /> */}
      <SalonsSection data={salonsSection} />
      <SeparatorImage>
        <Image
          src="/images/tree.svg"
          alt="Separator"
          width={88}
          height={449}
        />
      </SeparatorImage>
      <AboutUs data={aboutUsSection} />
      <TeamMembers data={teamMembersSection} />
      <PressSection />
      <DividerContainer>
        <Image 
          src="/images/divider-head.png"
          alt="divider" 
          layout="responsive"
          width={122}
          height={78}
        />
      </DividerContainer>
      <Testimonials isHomePage data={testimonialsSection} />
      <MembershipSection data={subscriptionsSection} />
      <CommunitySection data={joinCommunitySection} />
      {/* <Hosts /> */}
      {/* <HostingCTA /> */}
      {/* <VideoEmbed /> */}
    </Layout>
  );
}