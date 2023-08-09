import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import { getLayout } from "@/components/MainLayout";
import { ActionIcon, Badge, Flex, Grid, Loader, Text } from "@mantine/core";
import ProductCard from "@/components/ProductCard";
import { SWRConfig } from "swr";
import useSWRImmutable from "swr/immutable";
import { NextPageContext } from "next";
import Head from "next/head";
import { fetcher } from "@/utils/fetcher";
import type { Item, Product, Subcategory } from "@/utils/types";
import { useLocalStorage } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { Paginate } from "@/components/Paginate";

type ResponseData =
  | { list: Product[]; metadata: { total: number; pages: number } }
  | undefined;

function Content() {
  const router = useRouter();
  const query = router.query;
  const pageQuery = `&page=${Number(query.page) > 0 ? query.page : 1}`;
  const subcategoryQuery = query.subcategory
    ? `&subcategory=${query.subcategory}`
    : "";
  const urlProducts = `/api/products/search?search=${
    query.q || ""
  }${pageQuery}${subcategoryQuery}`;

  const { data, isLoading } = useSWRImmutable<ResponseData>(
    urlProducts,
    fetcher
  );

  const requestBody = {
    orderBy: "pricePerUnit",
    products: data?.list.map((p) => p.id),
    lowest: true,
  };
  const urlLowestPrice = requestBody.products ? `/api/products/lowHiPrice` : "";
  const { data: dataLowestPrice } = useSWRImmutable<{ list: Item[] }>(
    [
      urlLowestPrice,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      },
    ],
    ([url, options]: [string, RequestInit]) => fetcher(url, options)
  );
  const [subcategoryList] = useLocalStorage<Subcategory[]>({
    key: "subcategoryList",
  });
  const subcategorySelected = subcategoryList?.find(
    (s) => s.id === Number(query.subcategory)
  );

  return (
    <>
      <Head>
        <title>{`${query.q || "Productos"} - PricePro`}</title>
        <link rel="canonical" href="https://pricepro.com.co/search" />
        <meta
          name="description"
          content="Buscador de productos. Encuentra el precio más barato en diferentes tiendas del país"
          key="description"
        />
        <meta
          name="og:description"
          content="Buscador de productos. Encuentra el precio más barato en diferentes tiendas del país"
          key="og:description"
        />
        <meta
          property="og:url"
          content={`https://pricepro.com.co${router.asPath}`}
          key="og:url"
        />
        <meta
          property="og:title"
          content={`${query.q || "Productos"} - PricePro`}
          key="og:title"
        />
      </Head>
      <Flex justify="space-between" direction="column" gap="lg" h="100%">
        <Grid>
          {isLoading && (
            <Grid.Col span={12} style={{ textAlign: "center" }}>
              <Loader size="xl" />
            </Grid.Col>
          )}

          {subcategorySelected && (
            <Grid.Col span={12}>
              <Badge
                size="xl"
                variant="filled"
                color="teal"
                pr={3}
                component="h2"
                m={0}
                rightSection={
                  <ActionIcon
                    size="md"
                    radius="xl"
                    variant="transparent"
                    c="white"
                    onClick={() => router.push("/search")}
                  >
                    <IconX></IconX>
                  </ActionIcon>
                }
              >
                {subcategorySelected.category.name} - {subcategorySelected.name}
              </Badge>
            </Grid.Col>
          )}
          {data && data.list.length > 0 && (
            <>
              <Text fw={600} fz={30} ta="center" component="h1" display="none">
                Productos
              </Text>
              {data.list.map((prod) => (
                <Grid.Col key={prod.id} span={6} md={4} lg={2.4} xl={2}>
                  <ProductCard
                    data={prod}
                    cheapest={dataLowestPrice?.list.find(
                      (item) => item.product === prod.id
                    )}
                  />
                </Grid.Col>
              ))}
            </>
          )}
          {(!data || data.list.length === 0) && !isLoading && (
            <Grid.Col span={12}>
              <Text fw={600} fz={30} ta="center" component="h1">
                No se encontraron productos
              </Text>
            </Grid.Col>
          )}
        </Grid>
        <Paginate
          pages={data?.metadata.pages}
          total={data?.metadata.total}
          current={data?.list.length}
        />
      </Flex>
    </>
  );
}

const Page: NextPageWithLayout<{ fallback: { [k: string]: ResponseData } }> = ({
  fallback,
}) => {
  return (
    <SWRConfig value={{ fallback: fallback }}>
      <Content />
    </SWRConfig>
  );
};

Page.getLayout = getLayout;

export async function getServerSideProps(ctx: NextPageContext) {
  const { q: searchQuery, page, subcategory } = ctx.query;
  const apiHost = process.env.API_HOST;
  const pageQuery = `&page=${Number(page) > 0 ? page : 1}`;
  const subcategoryQuery = subcategory ? `&subcategory=${subcategory}` : "";
  const endpoint = `products/search?search=${
    searchQuery || ""
  }${pageQuery}${subcategoryQuery}`;
  const url = `${apiHost}${endpoint}`;
  let res: ResponseData;
  try {
    res = await fetcher(url);
  } catch (error) {
    console.error(error);
  }
  return {
    props: {
      fallback: {
        [`/api/${endpoint}`]: res,
      },
    },
  };
}

export default Page;
