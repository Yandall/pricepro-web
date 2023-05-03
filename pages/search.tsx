import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import { getLayout } from "@/components/MainLayout";
import { Flex, Grid, Loader, Pagination, Text } from "@mantine/core";
import ProductCard, { Product } from "@/components/ProductCard";
import useSWR, { SWRConfig } from "swr";
import { NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";

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

type ResponseData =
  | { list: Product[]; metadata: { total: number; pages: number } }
  | undefined;

function Content() {
  const router = useRouter();
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  const query = router.query;
  let url = `${apiHost}products/search?search=`;
  if (query.q && query.q !== "") {
    url += query.q;
  }

  if (query.page && query.page !== "") {
    url += +query.page > 0 ? `&page=${query.page}` : `&page=1`;
  }
  function getPaginationUrl(page: number) {
    if (query.q && query.q !== "") return `?q=${query.q}&page=${page}`;
    return `?page=${page}`;
  }
  const { data, isLoading } = useSWR<ResponseData>(url, fetcher);
  return (
    <>
      <Head>
        <title>{`${query.q || "Productos"} - PricePro`}</title>
      </Head>
      <Flex
        miw={300}
        justify="space-between"
        direction="column"
        gap="lg"
        h="100%"
      >
        <Grid>
          {isLoading && (
            <Grid.Col span={12} style={{ textAlign: "center" }}>
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
          {(!data || data.list.length === 0) && (
            <Grid.Col span={12}>
              <Text fw={600} fz={30} ta="center">
                No se encontraron productos
              </Text>
            </Grid.Col>
          )}
        </Grid>
        <Flex align="center" direction="column">
          {data && (
            <Text>
              {data.list.length} de {data.metadata.total}
            </Text>
          )}
          <Pagination
            value={Number(query.page) || 1}
            total={data?.metadata.pages || 1}
            getItemProps={(page) => ({
              component: Link,
              href: getPaginationUrl(page),
            })}
            getControlProps={(control) => {
              let pages = data?.metadata.pages || 1;
              let activePage = Number(query.page || 1);
              if (control === "previous" && activePage - 1 > 0)
                return {
                  component: Link,
                  href: getPaginationUrl(activePage - 1),
                };
              if (control === "next" && activePage + 1 <= pages)
                return {
                  component: Link,
                  href: getPaginationUrl(activePage + 1),
                };
              return {};
            }}
          />
        </Flex>
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
  const { q: searchQuery, page } = ctx.query;
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  let url = `${apiHost}products/search?search=${searchQuery || ""}&page=`;
  url += Number(page) > 0 ? page : 1;
  var res: ResponseData;
  try {
    res = await fetcher(url);
  } catch (error) {
    console.error(error);
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
