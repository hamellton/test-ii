import { Container } from "@mui/material";

const videoSrc = 'https://www.youtube.com/embed/_M8lY4Moj5w?si=u2mLIjhB1TCz-1WH';

export default function VideoEmbed() {
  return (
    <Container sx={{
      background: 'black',
      width: '100%',
      maxWidth: '100% !important',
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '4em',
      paddingBottom: '4em',
      overflow: 'hidden', // Ensure the padding does not cause overflow
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%' // Maintain a 16:9 aspect ratio (height 56.25% of the width 16/9 = 56.25%)
      }}>
        <iframe
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            border: 'none',
          }}
          src={videoSrc}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
          allowFullScreen>
        </iframe>
      </div>
    </Container>
  );
}
