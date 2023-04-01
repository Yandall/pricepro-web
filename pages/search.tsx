import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import { getLayout } from "@/components/MainLayout";
import { Flex, Grid, Loader } from "@mantine/core";
import ProductCard, { Product } from "@/components/ProductCard";
import useSWR, { Fetcher } from "swr";

const fetcher: Fetcher<{ list: Product[] }, string> = (url) =>
  fetch(url).then((res) => res.json());

const Page: NextPageWithLayout = () => {
  const router = useRouter();

  const query = router.query;

  let url = "http://127.0.0.1:8080/products/search?search=";

  if (query.q && query.q != "") {
    url += query.q;
  }
  const { data, error, isLoading } = useSWR(url, fetcher);
  return (
    <>
      <Flex miw={300} justify="center" direction="column" gap="lg">
        <Grid>
          {isLoading && (
            <Grid.Col span={12} offset={6}>
              <Loader size="xl" />
            </Grid.Col>
          )}
          {data &&
            data.list.length > 0 &&
            data.list.map((prod) => (
              <Grid.Col key={prod.id} sm={6} md={4} lg={3}>
                <ProductCard data={prod} />
              </Grid.Col>
            ))}
        </Grid>
      </Flex>
    </>
  );
};

Page.getLayout = getLayout;

export default Page;
