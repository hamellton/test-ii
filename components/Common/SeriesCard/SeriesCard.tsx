import React from "react";
import Image from "next/image";
import { SeriesCardBadge, SeriesCardContainer, SeriesCardImage, SeriesCardInfo, SeriesCardTitle } from "./SeriesCard.styles";
import { Series, User } from "@prisma/client";
import { ExtendedSalon } from "@utils/types";
import { HostBio, HostInfo, HostInfoContainer, HostName, HostTitle, ReadMore } from "@components/SalonDetail/ParentSeries/ParentSeries.styles";
import { Divider } from "@mui/material";
import Link from "next/link";
import SalonTag from "@components/SalonDetail/SalonTag";
import { logSeriesClick, logSeriesHostClick, logSeriesReadMoreClick } from "@utils/analytics-helpers";


interface SeriesCardProps {
    series: Series;
    episodes: ExtendedSalon[] | undefined;
    host: User | undefined;
}

const SeriesCard = ({ series, episodes, host } : SeriesCardProps) => {
  return (
    <SeriesCardContainer>
      {series?.imageUrl && (
        <SeriesCardImage>
          {episodes && (
            <SeriesCardBadge>{episodes.length} Episodes</SeriesCardBadge>
          )}
          <Image src={series.imageUrl} layout="fill" objectFit="cover" alt="series image" />
          <SalonTag type={"SERIES_BADGE"} />
        </SeriesCardImage>
      )}
      <SeriesCardInfo>
        <SeriesCardTitle>{series.title}</SeriesCardTitle>
        {host && (
          <>
            <HostInfoContainer onClick={() => logSeriesHostClick(series.id, host.id)}>
              {host?.profileImageUrl && <Image src={host?.profileImageUrl} width={40} height={40} alt="host image" style={{ borderRadius: "28px" }} />}
              {host.fullname && (
                <HostInfo>
                  <HostTitle>Host:</HostTitle>
                  <HostName>{host.fullname}</HostName>
                </HostInfo>
              )}
            </HostInfoContainer>
            <Divider sx={{ margin: "8px 0" }} />
            {host.bio && (
              <HostBio>
                {host.bio}
              </HostBio>
            )}
            {series.slug && (
              <ReadMore onClick={() => logSeriesReadMoreClick(series.id)}>
                <Link href={`/series/${series.slug}`} onClick={() => logSeriesClick(series.id)}>
                    Read more
                </Link>
                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 9.17806L5.16667 5.01139L1 0.844727M6.83333 9.17806L11 5.01139L6.83333 0.844727" stroke="#FC714E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ReadMore>
            )}
          </>
        )}
      </SeriesCardInfo>
    </SeriesCardContainer>
  );
};

export default SeriesCard;
