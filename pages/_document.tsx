import * as React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
} from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import { AppType } from "next/app";
import { roboto } from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import { MyAppProps } from "./_app";
import { ServerStyleSheet } from "styled-components";

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: JSX.Element[];
  styledComponentsStyleTags: JSX.Element[];
}

export default function MyDocument({ emotionStyleTags, styledComponentsStyleTags }: MyDocumentProps) {
  return (
    <Html lang="en" className={roboto.className}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        {/* <link href="https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@700&display=swap" rel="stylesheet" /> */}
        <link href='https://fonts.googleapis.com/css?family=Abhaya Libre' rel='stylesheet' />
        <meta name="emotion-insertion-point" content="" />
        {emotionStyleTags}
        {styledComponentsStyleTags}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;

  // Setup for Emotion
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  // Setup for styled-components
  const sheet = new ServerStyleSheet();

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: React.ComponentType<React.ComponentProps<AppType> & MyAppProps>) =>
          function EnhanceApp(props) {
            return sheet.collectStyles(<App emotionCache={cache} {...props} />);
          },
      });

    const initialProps = await Document.getInitialProps(ctx);

    // Extract styles for Emotion
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    // Extract styles for styled-components
    const styledComponentsStyleTags = sheet.getStyleElement();

    return {
      ...initialProps,
      emotionStyleTags,
      styledComponentsStyleTags,
    };
  } finally {
    sheet.seal();
  }
};
