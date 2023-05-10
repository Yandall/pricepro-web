import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import { getLayout } from "@/components/MainLayout";
import {
  ActionIcon,
  Badge,
  Flex,
  Grid,
  Loader,
  Pagination,
  Text,
} from "@mantine/core";
import ProductCard from "@/components/ProductCard";
import { SWRConfig } from "swr";
import useSWRImmutable from "swr/immutable";
import { NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { fetcher } from "@/utils/fetcher";
import type { Product, Subcategory } from "@/utils/types";
import { useLocalStorage } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";

type ResponseData =
  | { list: Product[]; metadata: { total: number; pages: number } }
  | undefined;

function Content() {
  const router = useRouter();
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  const query = router.query;
  let pageQuery = `&page=${Number(query.page) > 0 ? query.page : 1}`;
  let subcategoryQuery = query.subcategory
    ? `&subcategory=${query.subcategory}`
    : "";
  let url = `${apiHost}products/search?search=${
    query.q || ""
  }${pageQuery}${subcategoryQuery}`;

  const { data, isLoading } = useSWRImmutable<ResponseData>(url, fetcher);

  const [subcategoryList] = useLocalStorage<Subcategory[]>({
    key: "subcategoryList",
  });
  const subcategorySelected = subcategoryList?.find(
    (s) => s.id === Number(query.subcategory)
  );

  function getPaginationUrl(page: number) {
    if (query.q && query.q !== "") return `?q=${query.q}&page=${page}`;
    return `?page=${page}`;
  }
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

          {subcategorySelected && (
            <Grid.Col span={12}>
              <Badge
                size="xl"
                variant="filled"
                color="teal"
                pr={3}
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
  const { q: searchQuery, page, subcategory } = ctx.query;
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  let pageQuery = `&page=${Number(page) > 0 ? page : 1}`;
  let subcategoryQuery = subcategory ? `&subcategory=${subcategory}` : "";
  let url = `${apiHost}products/search?search=${
    searchQuery || ""
  }${pageQuery}${subcategoryQuery}`;
  let res: ResponseData;
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
