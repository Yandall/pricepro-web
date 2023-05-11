import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>
          <meta
            name="description"
            content="Encuentra y compara precios de tiendas en Colombia"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="autor" content="Yandall" />
          <meta
            name="keywords"
            content="supermercado, comparar, precio, productos, colombia, alimentos, tiendas, d1, exito, carulla, jumbo"
          />
          <meta property="og:url" content="https://pricepro.vercel.app" />
          <meta
            property="og:description"
            content="Encuentra el precio más bajo en tiendas de Colombia"
          />
          <meta
            property="og:title"
            content="PricePro | Encuentra el precio más bajo"
          />
          <meta property="og:site_name" content="PricePro" />
          <meta property="twitter:card" content="summary" />
          <meta property="twitter:url" content="https://pricepro.vercel.app" />
          <meta property="twitter:site" content="@priceproapp"></meta>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
