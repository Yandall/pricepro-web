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
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="Encuentra y compara precios de tiendas en Colombia como exito, carulla, jumbo, etc..."
          key="description"
        />
        <meta name="autor" content="Yandall" />
        <meta
          name="keywords"
          content="supermercado, comparar, precio, productos, colombia, alimentos, tiendas, d1, exito, carulla, jumbo"
        />
        <meta
          property="og:url"
          content="https://pricepro.vercel.app"
          key="og:url"
        />
        <meta
          property="og:description"
          content="Encuentra el precio más bajo en tiendas de Colombia como exito, carulla, jumbo, etc..."
          key="og:description"
        />
        <meta
          property="og:title"
          content="PricePro | Encuentra el precio más bajo"
          key="og:title"
        />
        <meta property="og:site_name" content="PricePro" />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:url" content="https://pricepro.vercel.app" />
        <meta property="twitter:site" content="@priceproapp"></meta>
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
          {getLayout(<Component {...pageProps} />)}
          <Analytics />
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
