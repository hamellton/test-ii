import React from "react";
import { 
  UpcomingEpisodesWrapper, 
  UpcomingEpisodesHeading, 
  SliderContainer, 
  Slider, 
  ShowMoreLink, 
  ShowMoreIcon, 
  EpisodeImage, 
  EpisodeTitle, 
  EpisodeDate,
  UpcomingEpisodesType,
//   EpisodeCardContainer,
} from "./UpcomingEpisodes.styles";
import { ExtendedSalon } from "@utils/types";
import Image from "next/image";
import Link from "next/link";
import { EpisodeCardContainer } from "@components/Tables/EpisodeTable/EpisodeTable.styles";
import { EpisodeItemTime } from "@components/SalonDetail/ParentSeries/ParentSeries.styles";
import { getLocalDateFromUTC, getLocalTimeFromUTC } from "@utils/frontend-helpers";
import { LOCATION_TYPE } from "@prisma/client";

interface UpcomingEpisodesProps {
    episodes: ExtendedSalon[] | undefined;
}

const UpcomingEpisodes = ({ episodes }: UpcomingEpisodesProps) => {
  return (
    <UpcomingEpisodesWrapper>
      {episodes && episodes.length > 0 && (
        <>
          <UpcomingEpisodesHeading>
            <h2>Upcoming Episodes</h2>
          </UpcomingEpisodesHeading>
          <SliderContainer>
            <Slider>
              {episodes.map((episode: ExtendedSalon, index) => (
                <Link key={episode.title + index} href={`/salon/${episode.slug}`}>
                  <EpisodeCardContainer>
                    {episode.imageUrl && (
                      <EpisodeImage>
                        <Image src={episode.imageUrl} width={215} height={130} alt="episode image" />
                      </EpisodeImage>
                    )}
                    {episode.startTime && (
                      <EpisodeItemTime>
                        {getLocalDateFromUTC((episode.startTime).toString(), false)}
                        <span style={{ margin: "0.2em" }}>•</span>
                        {getLocalTimeFromUTC((episode.startTime).toString())}
                      </EpisodeItemTime>
                    )}
                    <EpisodeTitle>{episode.title}</EpisodeTitle>
                    <UpcomingEpisodesType>
                      {episode.locationType === LOCATION_TYPE.IRL ? (
                        <svg width="12" height="12" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.9987 8.38607C6.08203 8.38607 5.33203 7.63607 5.33203 6.7194C5.33203 5.80273 6.08203 5.05273 6.9987 5.05273C7.91536 5.05273 8.66537 5.80273 8.66537 6.7194C8.66537 7.63607 7.91536 8.38607 6.9987 8.38607ZM11.9987 6.88607C11.9987 3.86107 9.79037 1.7194 6.9987 1.7194C4.20703 1.7194 1.9987 3.86107 1.9987 6.88607C1.9987 8.83607 3.6237 11.4194 6.9987 14.5027C10.3737 11.4194 11.9987 8.83607 11.9987 6.88607ZM6.9987 0.0527344C10.4987 0.0527344 13.6654 2.73607 13.6654 6.88607C13.6654 9.65273 11.4404 12.9277 6.9987 16.7194C2.55703 12.9277 0.332031 9.65273 0.332031 6.88607C0.332031 2.73607 3.4987 0.0527344 6.9987 0.0527344Z" fill="#605054"/>
                        </svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.30078 5.59082H11.3008M1.30078 5.59082C1.30078 8.35224 3.53936 10.5908 6.30078 10.5908M1.30078 5.59082C1.30078 2.8294 3.53936 0.59082 6.30078 0.59082M11.3008 5.59082C11.3008 8.35224 9.06221 10.5908 6.30078 10.5908M11.3008 5.59082C11.3008 2.8294 9.06221 0.59082 6.30078 0.59082M6.30078 0.59082C7.55142 1.96 8.26216 3.73684 8.30078 5.59082C8.26216 7.4448 7.55142 9.22164 6.30078 10.5908M6.30078 0.59082C5.05014 1.96 4.3394 3.73684 4.30078 5.59082C4.3394 7.4448 5.05014 9.22164 6.30078 10.5908" stroke="#605054" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      )}

                      <span>
                        {episode.locationType === LOCATION_TYPE.IRL ? "In Person" : "Online"}
                      </span>
                    </UpcomingEpisodesType>
                  </EpisodeCardContainer>
                </Link>
              ))}
            </Slider>
          </SliderContainer>
        </>
      )}
    </UpcomingEpisodesWrapper>
  );
};

export default UpcomingEpisodes;
