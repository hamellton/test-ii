import CommunityHero from "@components/CommunityPage/CommunityHero/CommunityHero";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";
import Layout from "@components/Layout/Layout";
import { II_CONTENTFUL_API } from "@config";
import { Chip, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { CommunityPageData, MeetsSectionItem } from "@utils/contentfulTypes";
import LanguageIcon from "@mui/icons-material/Language";
import CommunityAboutUs from "@components/CommunityPage/CommunityAboutUs/CommunityAboutUs";
import CommunityExpectations from "@components/CommunityPage/CommunityExpectations/CommunityExpectations";
import CommunityJoinUs from "@components/CommunityPage/CommunityJoinUs/CommunityJoinUs";
import CommunityMostofInterintellectSection from "@components/CommunityPage/CommunityMostofInterintellectSection/CommunityMostofInterintellectSection";


const LocationChip = ({ name }: { name: string }) => {
  return (
    <Chip
      icon={<LanguageIcon />}
      label={name}
      variant="outlined"
      sx={{ position: "absolute", mr: 2, bottom: "20px", right: "0", backgroundColor: "white" }}
    />
  );
};

const FirstSection = ({ data }: { data: MeetsSectionItem[] }) => {
  return (
    <Box>
      <Grid container spacing={0}>
        {data && data.length > 0 && data.map((meet: MeetsSectionItem, index: number) => {
          return (
            <Grid key={index + meet.location} item xs={12} sm={4}>
              <Box sx={{ position: "relative" }}>
                {meet?.imageUrl && <Box component="img" src={meet.imageUrl} alt="Image 1" width="100%" />}
                {meet?.location && <LocationChip name={meet.location} />}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box >
  );
};

export default function Community({ contenfulPage }: { contenfulPage: CommunityPageData }) {
  if (!contenfulPage || !contenfulPage.value) return <LoadingModal isLoading={true} />;

  const {
    heroSection,
    eventsSection,
    communityCollectiveSparkSection,
    joinUsSection,
    expectationsSection,
    meetsSection,
  } 
  = contenfulPage.value;

  return (
    <Layout>
      <CommunityHero data={heroSection} />
      <FirstSection data={meetsSection} />
      <CommunityMostofInterintellectSection data={eventsSection} />
      <CommunityAboutUs data={communityCollectiveSparkSection} />
      <CommunityExpectations data={expectationsSection} />
      <CommunityJoinUs data={joinUsSection} />
    </Layout>
  );
}

export async function getServerSideProps() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}${II_CONTENTFUL_API}/pages?name=communityPage`);
  const contenfulPage: CommunityPageData = await response.json();

  return {
    props: {
      contenfulPage,
    },
  };
}