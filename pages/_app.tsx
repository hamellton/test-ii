import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";

import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import "@utils/fontawesome";

import "../styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Provider } from "react-redux";
import { store } from "@/store";
import Toast from "@components/Common/Toast/Toast";
import { initAnalytics, logPageView } from "@utils/analytics";
import { useRouter } from "next/router";

// import useMemberfulScript from "@/hooks/useMemberfulScript";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const materialTheme = materialExtendTheme();

export default function MyApp(props: MyAppProps) {
  // useMemberfulScript("https://testii.memberful.com");

  const router = useRouter();

  React.useEffect(() => {
    initAnalytics();
    logPageView();

    const handleRouteChange = () => {
      logPageView();
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  const { Component, emotionCache = clientSideEmotionCache, pageProps: { session, ...pageProps } } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Interintellect</title>
        <meta name="description" content="We've reinvented the art of the French salon for the 21st century." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SessionProvider session={session}>
          <Provider store={store}>
            <Component {...pageProps} />
            <Analytics />
            <Toast />
          </Provider>
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
