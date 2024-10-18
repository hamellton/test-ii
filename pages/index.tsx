import Hero from "@components/Homepage/Hero";
import SalonSelection from "@components/Homepage/SalonSelection";
import CTACommunity from "@components/Common/CTACommunity";
import VideoEmbed from "@components/Homepage/VideoEmbed";
import PartnerSection from "@components/Homepage/Partners";
import HostingCTA from "@components/Homepage/HostingCTA";
import Testimonials from "@components/Homepage/Testimonials";
import Hosts from "@components/Homepage/Hosts";
import CommunitySection from "@components/Homepage/CommunitySection";
import NewsletterCTA from "@components/Homepage/NewsletterCTA";
import Layout from "@components/Layout/Layout";
import LandingPageForm from "@components/Homepage/LandingPageForm";
import useSWR from "swr";
import { ExtendedSalon } from "@utils/types";
import { II_CONTENTFUL_API, SALON_ENDPOINT } from "@config";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";
import { HomePageData } from "@utils/contentfulTypes";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getSalonUrl = (slug: string) => `${SALON_ENDPOINT}/slug/${slug}`;


export default function Home() {
  // Spreadsheet URL: https://docs.google.com/spreadsheets/d/1g-Xojxb_09TIkaHegXbJVaNvSh5nGOUTRVGnuwWQAfQ/edit#gid=0
  const spreadsheetId = "1g-Xojxb_09TIkaHegXbJVaNvSh5nGOUTRVGnuwWQAfQ"; // Replace with your Spreadsheet ID
  const range = "Sheet1!A1:M10"; // Replace with your desired range
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  const { data: homePageData, error: homePageDataError } = useSWR<HomePageData>(`${II_CONTENTFUL_API}/homepage`, fetcher);
  console.log("🚀 ~ Home ~ homePageData:", homePageData);

  const { data, error } = useSWR(url, fetcher);

  const featuredSlugs = data?.values ? data.values[0].slice(1) : [];
  const superSalonSlugs = data?.values ? data.values[1].slice(1) : [];
  const comingUpSlugs = data?.values ? data.values[2].slice(1) : [];
  const justLisedSlugs = data?.values ? data.values[3].slice(1) : [];

  const { data: featuredSalon1 } = useSWR(featuredSlugs[0] ? getSalonUrl(featuredSlugs[0]) : null, fetcher);
  const { data: featuredSalon2 } = useSWR(featuredSlugs[1] ? getSalonUrl(featuredSlugs[1]) : null, fetcher);
  const { data: featuredSalon3 } = useSWR(featuredSlugs[2] ? getSalonUrl(featuredSlugs[2]) : null, fetcher);

  const { data: superSalon1 } = useSWR(superSalonSlugs[0] ? getSalonUrl(superSalonSlugs[0]) : null, fetcher);
  const { data: superSalon2 } = useSWR(superSalonSlugs[1] ? getSalonUrl(superSalonSlugs[1]) : null, fetcher);
  const { data: superSalon3 } = useSWR(superSalonSlugs[2] ? getSalonUrl(superSalonSlugs[2]) : null, fetcher);

  const { data: comingUpSalon1 } = useSWR(comingUpSlugs[0] ? getSalonUrl(comingUpSlugs[0]) : null, fetcher);
  const { data: comingUpSalon2 } = useSWR(comingUpSlugs[1] ? getSalonUrl(comingUpSlugs[1]) : null, fetcher);
  const { data: comingUpSalon3 } = useSWR(comingUpSlugs[2] ? getSalonUrl(comingUpSlugs[2]) : null, fetcher);

  const { data: justListedSalon1 } = useSWR(justLisedSlugs[0] ? getSalonUrl(justLisedSlugs[0]) : null, fetcher);
  const { data: justListedSalon2 } = useSWR(justLisedSlugs[1] ? getSalonUrl(justLisedSlugs[1]) : null, fetcher);
  const { data: justListedSalon3 } = useSWR(justLisedSlugs[2] ? getSalonUrl(justLisedSlugs[2]) : null, fetcher);

  const featured = [featuredSalon1, featuredSalon2, featuredSalon3].filter(Boolean) as ExtendedSalon[];
  const superSalons = [superSalon1, superSalon2, superSalon3].filter(Boolean) as ExtendedSalon[];
  const comingUp = [comingUpSalon1, comingUpSalon2, comingUpSalon3].filter(Boolean) as ExtendedSalon[];
  const justListed = [justListedSalon1, justListedSalon2, justListedSalon3].filter(Boolean) as ExtendedSalon[];

  if (error) return <div>Failed to load data</div>;
  if (!data) return <LoadingModal isLoading={!data} />;

  return (
    <Layout>
      <Hero />
      <SalonSelection heading="Editors' Picks" salons={featured as ExtendedSalon[]} isSuperSalon={false} />
      <CTACommunity />
      <SalonSelection heading="SuperSalons" salons={superSalons as ExtendedSalon[]} isSuperSalon={true} />
      <SalonSelection heading="Coming Up Next" salons={comingUp} isSuperSalon={false} />
      <LandingPageForm />
      <SalonSelection heading="Just Listed" salons={justListed as ExtendedSalon[]} isSuperSalon={false} />
      <NewsletterCTA />
      <CommunitySection />
      <Hosts />
      <Testimonials />
      <HostingCTA />
      <VideoEmbed />
      <PartnerSection />
    </Layout>
  );
}
