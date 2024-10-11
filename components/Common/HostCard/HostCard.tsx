import React from "react";
import { HostContainer, HostImgContainer, HostInfo, HostMainInfo, HostQuote } from "./HostCard.styles";
import Image from "next/image";
import Link from "next/link";

const HostCard = ({ hostData }: any) => {
  return (
    <Link href={`/hosts/${hostData.slug}`}>
      <HostContainer>
        <HostImgContainer>
          <Image src={hostData.profileImageUrl} width={180} height={180} alt="host image" style={{ borderRadius: "126px", objectFit: "cover" }} />
        </HostImgContainer>
        <HostInfo>
          <HostMainInfo>
            <div className="host-name">{hostData.fullname}</div>
            <div className="host-bio">{hostData.bio}</div>
          </HostMainInfo>
          {hostData.quote && <HostQuote>{hostData.quote}</HostQuote>}
        </HostInfo>
      </HostContainer>
    </Link>
  );
};

export default HostCard;
