import React, { useEffect, useState } from "react";
import { SimilarEventsWrapper } from "./SimilarEvents.styles";
import SalonCard from "../SalonCard/SalonCard";
import { Box } from "@mui/material";
import Link from "next/link";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import styled from "styled-components";
import { logSimilarEventsShowMoreClick } from "@utils/analytics-helpers";

const CardsContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    justify-content: flex-start;
    margin-top: 16px;
    gap: 24px;
  }
`;

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY;

// Async function to get coordinates from a location string
async function getCoordinatesFromLocation(location: string): Promise<{ latitude: number, longitude: number } | null> {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`);
    if (!response.ok) {
      console.error("HTTP error:", response.status);
      return null;
    }

    const data = await response.json();
    // console.log("Geocoding response:", data);

    if (data.status === "OK" && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      // console.log(`Coordinates for ${location}:`, lat, lng);
      return { latitude: lat, longitude: lng };
    } else {
      console.error("Geocoding failed:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// Haversine formula to calculate the distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km

  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    console.error("Invalid coordinates:", lat1, lon1, lat2, lon2);
    return NaN;
  }

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  // console.log(`Distance between (${lat1}, ${lon1}) and (${lat2}, ${lon2}):`, distance);

  return distance;
}

async function findSimilarEventsByProximity(
  events: any[],
  targetLocation: { latitude: number, longitude: number },
  maxDistance: number
): Promise<any[]> {
  const eventsWithCoordinates = await Promise.all(events.map(async event => {
    if (event.latitude && event.longitude) {
      return event;
    } else if (event.location) {
      const coordinates = await getCoordinatesFromLocation(event.location);
      if (coordinates) {
        return { ...event, latitude: coordinates.latitude, longitude: coordinates.longitude };
      } else {
        // console.error("Failed to get coordinates for event:", event);
        return null;
      }
    } else {
      console.error("Missing coordinates and location for event:", event);
      return null;
    }
  }));

  return eventsWithCoordinates
    .filter(event => event !== null)
    .map(event => {
      const distance = calculateDistance(
        targetLocation.latitude,
        targetLocation.longitude,
        event.latitude,
        event.longitude
      );
      return { ...event, distance };
    })
    .filter(event => event.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}

// Find similar events by tags
function findSimilarEventsByTags(events: any[], targetTags: any[]): any[] {
  if (targetTags && targetTags.length > 0) {
    const targetLabels = targetTags.map(tag => tag.label);
    return events.filter(event => 
      event.tags.some((tag: any) => targetLabels.includes(tag.label))
    );
  }
  return [];
}

const SimilarEvents = ({ salons, location, tags, isSeries = false }: { salons: any[], location: string | null, tags: any[], isSeries?: boolean }) => {
  const [similarEvents, setSimilarEvents] = useState<any[]>([]);
  const { device } = useDevice() ?? {};

  useEffect(() => {
    const fetchSimilarEvents = async () => {
      let events: any[] = [];

      if (location) {
        const targetLocation = await getCoordinatesFromLocation(location);
        if (targetLocation) {
          events = await findSimilarEventsByProximity(salons, targetLocation, 500);
        } else {
          console.error(`Failed to get coordinates for location: ${location}`);
        }

        if (events.length > 0 && tags.length > 0) {
          events = findSimilarEventsByTags(events, tags);
        }

        if (events.length === 0) {
          console.log("No nearby events found. Searching by tags.");
          events = findSimilarEventsByTags(salons, tags);
        }
      } else {
        console.log("No location provided. Searching by tags.");
        events = findSimilarEventsByTags(salons, tags);
      }
      console.log(`Found ${events.length} similar events.`);
      setSimilarEvents(events);
    };

    fetchSimilarEvents();
  }, [salons, location, tags]);

  return similarEvents && similarEvents.length > 0 ? (
    <SimilarEventsWrapper>
      <div className="similar-events">
        <div className="similar-events-heading">
          <div className="similar-events-heading__title">
              Similar events {!isSeries ? "nearby" : "" }
          </div>
          {device !== DeviceTypes.MOBILE && (
            <div className="similar-events-heading__show-more">
              <Link href={"/salons"} onClick={() => logSimilarEventsShowMoreClick()}>
                  Show more
              </Link>
              <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 9.17806L5.16667 5.01139L1 0.844727M6.83333 9.17806L11 5.01139L6.83333 0.844727" stroke="#FC714E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
        <CardsContainer>
          {similarEvents.slice(0, 3).map((salon: any) => (
            <SalonCard
              key={salon.id}
              salon={salon}
              isSimilar={true}
              shadow={device === DeviceTypes.MOBILE}
            />
          ))}
        </CardsContainer>
        {device === DeviceTypes.MOBILE && (
          <div className="similar-events-heading__show-more">
            <Link href={"/salons"} onClick={() => logSimilarEventsShowMoreClick()}>
                Show more
            </Link>
            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 9.17806L5.16667 5.01139L1 0.844727M6.83333 9.17806L11 5.01139L6.83333 0.844727" stroke="#FC714E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </SimilarEventsWrapper>
  ) : null;
};

export default SimilarEvents;
