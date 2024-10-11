import Layout from "@components/Layout/Layout";
import { SALON_ENDPOINT } from "@config";
import { fetchGetJSON } from "@utils/api-helpers";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
  padding: 64px 0 120px;
`;

const Image = styled.img`
  width: 272px;
  margin-bottom: 20px;
`;

const Message = styled.p`
  color: #231F20;
  margin-bottom: 24px;
  margin-top: 25px;
  font-size: 32px;
  font-weight: 700;
  line-height: 48px;
  text-align: center;
`;

const BackButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 22px;
  text-decoration: none;
  border-radius: 8px;
  border: 1px solid #D3D3D3;
  box-shadow: 0px 1px 2px 0px #0000000F;
  box-shadow: 0px 1px 3px 0px #0000001A;
`;

function Cancel() {
  const router = useRouter();
  const { salonId } = router.query;

  const { data: salon, error: salonError } = useSWR(salonId ? `${SALON_ENDPOINT}/${salonId}` : null, fetchGetJSON);

  return (
    <Layout>
      <Wrapper>
        <Image src="/images/cencel/flowers.png" alt="Cancellation" />
        <Message>Oh no! We couldn’t register you this time. You haven’t completed the payment.</Message>
        {salon && salon.slug && (
          <BackButton href={`/salons/${salon.slug}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_8837_13839)">
                <path d="M12.843 6.175L11.668 5L6.66797 10L11.668 15L12.843 13.825L9.0263 10L12.843 6.175Z" fill="#FC714E"/>
              </g>
              <defs>
                <clipPath id="clip0_8837_13839">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span>Back to the Event</span>
          </BackButton>
        )}
      </Wrapper>
    </Layout>
  );
}

export default Cancel;
