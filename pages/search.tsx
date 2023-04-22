import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import { getLayout } from "@/components/MainLayout";
import { Flex, Grid, Loader } from "@mantine/core";
import ProductCard, { Product } from "@/components/ProductCard";
import useSWR, { SWRConfig } from "swr";
import { NextPageContext } from "next";
import Head from "next/head";

const fetcher = (url: string) => {
  if (url !== "")
    return fetch(url)
      .then(async (res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error) throw res;
        return res;
      });
  return new Promise<any>((resolve) => resolve(undefined));
};

type ResponseData = { list: Product[] } | undefined;

function Content() {
  const router = useRouter();
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  const query = router.query;

  let url = `${apiHost}products/search?search=`;

  if (query.q && query.q != "") {
    url += query.q;
  }
  const { data, isLoading } = useSWR<ResponseData>(url, fetcher);
  return (
    <>
      <Head>
        <title>{`${query.q || "Productos"} - PricePro`}</title>
      </Head>
      <Flex miw={300} justify="center" direction="column" gap="lg">
        <Grid>
          {isLoading && (
            <Grid.Col offset={6} span={6}>
              <Loader size="xl" />
            </Grid.Col>
          )}
          {data &&
            data.list.length > 0 &&
            data.list.map((prod) => (
              <Grid.Col key={prod.id} span={6} md={4} lg={3} xl={2}>
                <ProductCard data={prod} />
              </Grid.Col>
            ))}
        </Grid>
      </Flex>
    </>
  );
}

const Page: NextPageWithLayout<{
  props: { fallback: { [k: string]: ResponseData } };
}> = ({ props: { fallback } }) => {
  return (
    <SWRConfig value={{ fallback: fallback }}>
      <Content />
    </SWRConfig>
  );
};

Page.getLayout = getLayout;

Page.getInitialProps = async (ctx: NextPageContext) => {
  const { q: searchQuery } = ctx.query;
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  let url = `${apiHost}products/search?search=${searchQuery || ""}`;
  console.log(url);
  var res: ResponseData;
  try {
    res = await fetcher(url);
  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      fallback: {
        [url]: res,
      },
    },
  };
};

export default Page;
