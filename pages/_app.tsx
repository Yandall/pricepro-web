// import '@/styles/globals.css'
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { IsClientCtxProvider } from "@/components/IsClient";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>PricePro - Comparador de precios</title>

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="PricePro es un comparador de precios de supermercados en Colombia. 
          Encuentra los mejores precios de éxito, carulla, jumbo, d1 y muchos más."
          key="description"
        />
        <meta name="autor" content="Yandall" />
        <meta
          name="keywords"
          content="supermercado, comparar, precio, productos, colombia, alimentos, tiendas, d1, exito, carulla, jumbo"
        />
        <meta
          property="og:url"
          content="https://pricepro.com.co"
          key="og:url"
        />
        <meta
          property="og:description"
          content="PricePro es un comparador de precios de supermercados en Colombia. 
          Encuentra los mejores precios de éxito, carulla, jumbo, d1 y muchos más."
          key="og:description"
        />
        <meta
          property="og:title"
          content="PricePro - Comparador de precios"
          key="og:title"
        />
        <meta property="og:site_name" content="PricePro" />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:url" content="https://pricepro.com.co" />
        <meta property="twitter:site" content="@priceproapp"></meta>
        <meta
          name="google-site-verification"
          content="jXNXNIoNpVIC_MJm1THRaC823vFRLW_yVEPIwj3NbiI"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withCSSVariables
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme,
            loader: "dots",
          }}
        >
          <Notifications />
          <IsClientCtxProvider>
            {getLayout(<Component {...pageProps} />)}
          </IsClientCtxProvider>
          <Analytics />
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
