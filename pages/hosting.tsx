import Layout from "@components/Layout/Layout";
import { Box } from "@mui/material";
import HostingHero from "@components/HostingPage/HostingHero/HostingHero";
import CommunityMostofInterintellectSection from "@components/CommunityPage/CommunityMostofInterintellectSection/CommunityMostofInterintellectSection";
import CommunityAboutUs from "@components/CommunityPage/CommunityAboutUs/CommunityAboutUs";
import Testimonials from "@components/Homepage/Testimonials";
import CommunityJoinUs from "@components/CommunityPage/CommunityJoinUs/CommunityJoinUs";
import HostingTabsContent from "@components/HostingPage/HostingTabsContent/HostingTabsContent";
import { II_CONTENTFUL_API } from "@config";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";

const FotoSection = () => {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Box component="img" src="/images/hosting/hosting-wide.png" alt="Image 1" width="100%" />
    </Box>
  );
};

interface Tab {
  title: string;
  content: string;
}

interface HostingProps {
  contenfulPage: {
    value: {
      heroSection: any;
      tabsSection: {
        tabs: Tab[];
      };
      testimonials: any;
      benefitsSection: any;
      testimonialSection: any;
      createHostAccountSection: any;
    };
  };
}

const Hosting: React.FC<HostingProps> = ({ contenfulPage }) => {
  if (!contenfulPage || !contenfulPage.value) return <LoadingModal isLoading={!contenfulPage || !contenfulPage.value} />;

  const {
    heroSection,
    tabsSection,
    testimonials,
    benefitsSection,
    testimonialSection,
    createHostAccountSection,
  } = contenfulPage.value;

  const transformedTestimonials = testimonials.map((testimonial: any) => ({
    name: testimonial.name,
    title: testimonial.jobTitle,
    comment: testimonial.text,
  }));

  return (
    <Layout>
      <HostingHero data={{...heroSection, subTitle: heroSection.description}} />
      <CommunityMostofInterintellectSection data={benefitsSection} />
      <CommunityAboutUs data={{
        name: testimonialSection.authorName,
        text: testimonialSection.text,
        image: testimonialSection.imgUrl,
        jobTitle: testimonialSection.authorJobTitle
      }} />
      <Testimonials data={transformedTestimonials} />
      <FotoSection />
      <HostingTabsContent tabs={tabsSection.tabs} />
      <CommunityJoinUs data={{
        image: createHostAccountSection.imgUrl,
        title: createHostAccountSection.title,
        buttonUrl: createHostAccountSection.buttonUrl,
        buttonText: createHostAccountSection.buttonTitle,
        description: createHostAccountSection.description,
      }} />
    </Layout>
  );
};

export async function getServerSideProps() {
  const apiUrl = `${process.env.NEXTAUTH_URL}${II_CONTENTFUL_API}/pages?name=hostingPage`;

  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    console.error("Failed to fetch data:", response.statusText);
    return {
      notFound: true,
    };
  }
  
  const contenfulPage = await response.json();

  return {
    props: {
      contenfulPage,
    },
  };
}

export default Hosting;