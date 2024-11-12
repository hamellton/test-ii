import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { showToast } from "@/store";
import { II_CONTENTFUL_API, II_FACEBOOK, II_INSTAGRAM, II_LINKEDIN, II_SUBSTACK, II_TWITTER, II_YOUTUBE, NEWSLETTER_SUBSCRIBE } from "@config";
import { Button, TextField } from "@mui/material";
import useSWR from "swr";
import { FooterPageData, SocialIcon } from "@utils/contentfulTypes";
import Image from "next/image";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 130px 20px 120px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ContentBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 426px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  line-height: 40px;
  text-align: left;
  margin: 0 0 24px 0;
  color: #231F20;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    
    button {
      border-radius: 8px;
      padding: 12px 42px;
    }
  }
`;

const Quote = styled.p`
  margin-top: 24px;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.01em;
  text-align: left;
  color: #231F20;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const FooterBlock = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.01em;
  text-align: left;
  color: #231F20;
  opacity: 50%;
  border-top: 2px solid #F7E6C3;
  padding-top: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const FooterText = styled.div`
  font-size: 14px;
  color: #666;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 10px;
    align-items: center;
    justify-content: space-between;
  }
`;

const SubscriptionButton = styled(Button)`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-align: left;
  cursor: pointer;
  border-radius: 0 8px 8px 0;
  margin: auto;
`;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Footer = () => {
  const { data: contenfulPage } = useSWR<FooterPageData>(`${II_CONTENTFUL_API}/pages?name=footerPage`, fetcher);

  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      dispatch(showToast({ message: "Please enter a valid email." }));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(NEWSLETTER_SUBSCRIBE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status === "exists") {
          dispatch(showToast({ message: "You are already subscribed to the newsletter." }));
        } else if (data.status === "success" || data.status === "resubscribed") {
          dispatch(showToast({ message: "Thank you for subscribing!", success: true }));
          setEmail("");
        } else {
          dispatch(showToast({ message: "An unexpected response was received.", success: false }));
        }
      } else {
        dispatch(showToast({ message: data.message || "Failed to subscribe", success: false }));
      }
    } catch (error: any) {
      dispatch(showToast({ message: error.message || "Something went wrong!", success: false }));
    } finally {
      setLoading(false);
    }
  };

  if (!contenfulPage) {
    return null;
  } 

  const {
    socialIcons,
    newsletterTitle,
    quoteText,
    footerText,
    footerLinks,
  } = contenfulPage.value;

  const socialIconsData = socialIcons && socialIcons.length > 0 ? socialIcons : [];
  const footerLinksData = footerLinks && footerLinks.length > 0 ? footerLinks : [];

  return (
    <Container>
      <ContentBlock>
        <MainContent>
          <Title>{newsletterTitle}</Title>
          <Form onSubmit={handleSubscribe}>
            <TextField
              fullWidth
              id="Email"
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              name="startTime"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              sx={{
                height: "56px",
                margin: "0",
                "& .MuiOutlinedInput-input": {
                  borderRadius: "4px 0 0 4px",
                  padding: "0 12px",
                  fontSize: "16px",
                  fontWeight: "400",
                  lineHeight: "24px",
                  textAlign: "left",
                  color: "#231F20",
                  height: "56px",
                  margin: "0",
                },
              }}
            />
            <SubscriptionButton variant="contained" disabled={loading} type="submit">
              {loading ? "Subscribing..." : "Subscribe"}
            </SubscriptionButton>
          </Form>
          <Quote>{quoteText}</Quote>
        </MainContent>
        <SocialIcons>
          {socialIconsData.length > 0 && socialIconsData.map((icon: SocialIcon) => (
            <Link key={icon.id} href={icon.url} passHref>
              <Image src={icon.image.imageUrl} alt={icon.image.alt} width="48" height="48" />
            </Link>
          ))}
        </SocialIcons>
      </ContentBlock>
      <FooterBlock>
        <FooterText>{footerText}</FooterText>
        <FooterLinks>
          {footerLinksData.length > 0 && footerLinksData.map(link => {
            return (
              <Link key={link.id} href={link.url} passHref>
                {link.title}
              </Link>
            );
          })}
        </FooterLinks>
      </FooterBlock>
    </Container>
  );
};

export default Footer;
