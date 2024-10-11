import Layout from "@components/Layout/Layout";
import SalonCard from "@components/Common/SalonCard/SalonCard";
import SalonSearch from "@components/Common/SalonSearch";
import { SALONS_GROUPED_ENDPOINT, SALONS_ALL_ENDPOINT } from "@config";
import { Box, Button, Typography } from "@mui/material";
import { fetchGetJSON } from "@utils/api-helpers";
import useSWR from "swr";
import CTACommunity from "@components/Common/CTACommunity";
import { ExtendedSalon, GroupedSalons } from "@utils/types";
import { explorePageSalonCardStyle, explorePageSalonBoxStyle } from "@utils/style-helpers";
import { useState, useEffect } from "react";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";

export default function Salons() {
  const { data: salon } = useSWR<ExtendedSalon>(`${SALONS_ALL_ENDPOINT}?nextSalon=true`, fetchGetJSON);

  const [direction, setDirection] = useState<"newer" | "older">("newer");
  const [currentSalonId, setCurrentSalonId] = useState<string | null>(salon?.id || null);
  const [searchResults, setSearchResults] = useState<GroupedSalons | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data, error, mutate } = useSWR<GroupedSalons>(currentSalonId ? `${SALONS_GROUPED_ENDPOINT}&salonId=${currentSalonId}&direction=${direction}` : null, fetchGetJSON);

  useEffect(() => {
    if (salon?.id) {
      setCurrentSalonId(salon.id);
    }
  }, [salon]);

  if (error) return <div>Failed to load</div>;
  if (!data && !searchResults && !loading) return <LoadingModal isLoading={!data && !searchResults && !loading} />;

  const salons = searchResults || data;

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.trim() === "") {
      setSearchResults(null);
      setCurrentSalonId(salon?.id || null);
      setLoading(false);
      mutate();
    } else {
      setLoading(true);
      const results = await fetchGetJSON(`${SALONS_ALL_ENDPOINT}?terms=${encodeURIComponent(searchTerm)}`);
      setSearchResults(results);
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setDirection("newer");
    if (salons) {
      const flattenedSalons = Object.values(salons)
        .flatMap(year => Object.values(year).flat());
      const lastSalon = flattenedSalons.pop();
      if (lastSalon) {
        setCurrentSalonId(lastSalon.id);
        mutate();
      }
    }
  };

  const handleShowPrevious = async () => {
    setDirection("older");
    if (salons) {
      const flattenedSalons = Object.values(salons)
        .flatMap(year => Object.values(year).flat());
      const firstSalon = flattenedSalons.shift();
      if (firstSalon) {
        setCurrentSalonId(firstSalon.id);
        mutate();
      }
    }
  };

  return (
    <Layout>
      <Box sx={explorePageSalonBoxStyle()}>
        <SalonSearch handleSearch={handleSearch} />
        {loading && <div style={{ marginTop: "20px" }}>Loading Search Results...</div>}
        <Box sx={{ width: "100%", borderLeft: "1px dotted #605054", paddingLeft: 5, marginTop: 5 }}>
          {salons && Object.keys(salons).map((year) => (
            <Box key={year}>
              <Typography sx={{ fontSize: 24, fontWeight: "bold", mb: 2, mt: 5 }}>
                {year}
              </Typography>
              {Object.keys(salons[parseInt(year)]).map((month) => (
                <Box key={month}>
                  <Box sx={{ display: "flex", mt: 7 }}>
                    <div style={explorePageSalonCardStyle()}></div>
                    <Typography sx={{ fontSize: 20, fontWeight: "bold", mb: 2, mt: -0.5, ml: 4 }}>
                      {new Date(0, parseInt(month, 10)).toLocaleString("default", { month: "long" })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {salons[parseInt(year)][parseInt(month)].map((salon: ExtendedSalon, index: number) => (
                      <SalonCard key={index} salon={salon} />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
          {!searchResults && (
            <Box sx={{ mt: 10, display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" color="primary" onClick={handleShowPrevious}>
                Show previous events
              </Button>
              <Button variant="outlined" color="primary" onClick={handleLoadMore}>
                Load more events
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <CTACommunity />
    </Layout>
  );
}
