import styled from "styled-components";

const Iframe = styled.iframe`
  width: 100%;
  height: 400px;
  border: 0;
`;

export default function GoogleMapsEmbed({ location }: { location: string }) {
  return (
    <Iframe
      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&q=${encodeURIComponent(location)}`}
      allowFullScreen
    ></Iframe>
  )
}
