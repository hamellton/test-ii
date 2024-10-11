import React from "react";
import { ExtendedSalon, SetIsLoadingFunction } from "@utils/types";
import {
  EpisodeListWrapper
} from "./EpisodeList.styles";
import Link from "next/link";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";

export function formatDateTime(startTimestamp: any, endTimestamp?: any): string {
  const startDate = new Date(startTimestamp);
  const endDate = endTimestamp ? new Date(endTimestamp) : null;
  
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(startDate);
  const day = startDate.getDate().toString().padStart(2, "0");
  const year = startDate.getFullYear().toString();
  
  const startTime = formatTime(startDate);
  const endTime = endDate ? formatTime(endDate) : "";
  
  return `${month} ${day}, ${year} ${startTime}${endTime ? " to " + endTime : ""} CET`;
}
  
function formatTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false // 24-hour format
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

const EpisodeList = ({ salons, setIsLoading }: { salons: ExtendedSalon[], setIsLoading: SetIsLoadingFunction }) => {

  const { device } = useDevice() ?? {};

  return salons && salons.length > 0 ? (
    <div style={{ width: "100%" }}>
      <EpisodeListWrapper>
        <div className="list-title">All episodes</div>
        <div className="list-main">
          {device !== DeviceTypes.MOBILE && <div className="list-item">
            <div className="list-item__date">
                Date
            </div>
            <div className="list-item__info">
              <div className="list-item__info__title">Episode title</div>
            </div>
          </div>}
          {salons.map((salon: any, index: number) => {
            return (
              <div key={`${salon.title}${index}`} className="list-item main-list">
                <div className="list-item__date">
                  {formatDateTime(salon.startTime)}
                </div>
                <div className="list-item__info">
                  <Link href={`/salons/${salon.slug}`}>
                    <div className="list-item__info__title">{salon.title}</div>
                  </Link>
                  <div className="list-item__info__description">{salon.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </EpisodeListWrapper>
    </div>
  ) : null;
};

export default EpisodeList;

