import React from "react";
import { ExtendedSalon, frontEndAuthResponse } from "@utils/types";
import { Card, CardContent, CardMedia, Divider, Grid, Typography } from "@mui/material";
import NextSalonInfoBox from "./NextSalonInfoBox/NextSalonInfoBox";
import styled from "styled-components";
import Link from "next/link";
import useSWR from "swr";
import { USER_ENDPOINT } from "@config";
import { fetchGetJSON } from "@utils/api-helpers";
import { HostDetails, NextSalonHostInfo } from "./NextSalon.styles";
import Image from "next/image";

const NextSalonBadge = styled.div`
  position: absolute;
  top: 28px;
  left: 28px;
  background-color: #FFFFFF;
  color: #231F20;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 21px;
  font-family: "Abhaya Libre";
  font-weight: 700;
`;

const StyledCard = styled(Card)<{ shadow?: boolean }>`
  background-color: #FFFEF4;
  width: 333px;
  border-radius: 12px;
  border: 1px solid #C4C4C4;
  box-shadow: ${(props) => (props.shadow ? "0px 4px 4px rgba(0, 0, 0, 0.25)" : "none")};
  position: relative;
  padding: 16px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const getNextSalon = (salons: ExtendedSalon[]) => {
  const now = new Date();
  const upcomingSalons = salons && salons.length > 0 ? salons
    .filter(salon => new Date(salon.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) : [];

  return upcomingSalons[0] || null;
};

const NextSalon = ({ salons, user } : { salons: ExtendedSalon[], user?: frontEndAuthResponse }) => {
  const salon = getNextSalon(salons);
  // const { data: hostData, error: hostDataError } = useSWR(salon?.hostId ? `${USER_ENDPOINT}/${salon?.hostId}` : null, fetchGetJSON);

  const hostData = salon?.host || null;

  return salon ? (
    <div>
      <Grid item xs={12} sm={6} md={3}>
        <StyledCard shadow={false}>
          <NextSalonBadge>Next episode</NextSalonBadge>
          <Link href={`/salons/${salon.slug}`}>
            <CardMedia
              component="img"
              height="200"
              width="333"
              image={salon.imageUrl ? salon.imageUrl : "/images/thumbnail.jpg"}
              sx={{ borderRadius: "6px" }}
            />
          </Link>
          <CardContent sx={{ padding: "16px 0 16px 0" }}>
            <Link href={`/salons/${salon.slug}`}>
              <Typography gutterBottom variant="h4" component="div" sx={{
                fontWeight: 700,
                fontSize: 20,
                textAlign: "left",
              }}>
                {salon.title}
              </Typography>
            </Link>

            {hostData && (
              <NextSalonHostInfo>
                <Image src={hostData.profileImageUrl} width={40} height={40} alt="host image" style={{ borderRadius: "28px" }} />
                <Link href={`/hosts/${hostData.slug}`}>
                  <HostDetails>
                    <div className="host-title">Host</div>
                    <div className="host-name">{hostData.name}</div>
                  </HostDetails>
                </Link>
              </NextSalonHostInfo>
            )}

            <Divider sx={{ flexGrow: 1, mt: 2, mb: "4px" }} />
            {user && salons && salons.length > 0 && <NextSalonInfoBox user={user} salon={salon} />}
          </CardContent>
        </StyledCard>
      </Grid >
    </div>
  ) : null;
};

export default NextSalon;
