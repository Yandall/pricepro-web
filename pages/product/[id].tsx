import { getLayout } from "@/components/MainLayout";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { Product } from "@/components/ProductCard";
import useSWR, { SWRConfig } from "swr";
import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  MediaQuery,
  Popover,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { IconShare } from "@tabler/icons-react";

import ItemCard, { Item } from "@/components/ItemCard";
import { useClipboard } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { NextPageContext } from "next";
import Head from "next/head";
import PlaceholderImg from "@/components/PlaceHolderImg";

type ResponseData =
  | {
      product: Product;
      items: Item[];
    }
  | undefined;

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

function Content() {
  const router = useRouter();
  const { id: idProduct } = router.query;
  let url = idProduct ? `http://127.0.0.1:8080/items/${idProduct}` : "";

  const { data, mutate } = useSWR<ResponseData>(url, fetcher);
  const [order, setOrder] = useState<string | null>("pricePerUnit");
  const { items } = data?.items ? data : { items: new Array<Item>() };
  useEffect(() => {
    if (order === "pricePerUnit" && items.length > 0) {
      mutate({
        ...data!,
        items: Array.from(
          items.sort((prev, next) => prev.pricePerUnit - next.pricePerUnit)
        ),
      });
    } else if (order === "price" && items.length > 0) {
      mutate({
        ...data!,
        items: Array.from(items.sort((prev, next) => prev.price - next.price)),
      });
    }
  }, [order, items, data, mutate]);

  const clipboard = useClipboard();

  function clipboardHandler() {
    let copyUrl = `http://127.0.0.1:3000/items/${idProduct}`;
    clipboard.copy(copyUrl);
  }

  function getLast<T>(list?: Array<T>) {
    if (!list) return;
    return list[list.length - 1];
  }
  return (
    <>
      <Head>
        {data ? (
          <title>{`${data.product.name} - PricePro`}</title>
        ) : (
          <title>Producto no encontrado - PricePro</title>
        )}
      </Head>
      <Flex direction="column" align="center" mt={10}>
        {data ? (
          <>
            <Card
              bg="transparent"
              withBorder
              shadow="lg"
              radius="lg"
              padding="lg"
              w="100%"
              styles={{ "align-items": "center" }}
            >
              <Grid>
                <Grid.Col span={12} xs={5}>
                  <Popover withArrow shadow="md" onOpen={clipboardHandler}>
                    <Popover.Target>
                      <ActionIcon
                        size="lg"
                        variant="outline"
                        color="indigo"
                        radius="xl"
                        style={{
                          position: "absolute",
                          margin: "1rem",
                          zIndex: 2,
                        }}
                      >
                        <IconShare stroke={2} />
                      </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Text>Copiado</Text>
                    </Popover.Dropdown>
                  </Popover>
                  <MediaQuery largerThan="md" styles={{ display: "none" }}>
                    <Image
                      radius="lg"
                      src={data.product.imgUrl}
                      height={200}
                      placeholder={<PlaceholderImg />}
                      withPlaceholder
                      alt={data.product.name}
                    ></Image>
                  </MediaQuery>
                  <MediaQuery smallerThan="md" styles={{ display: "none" }}>
                    <Image
                      radius="lg"
                      height={400}
                      src={data.product.imgUrl}
                      placeholder={<PlaceholderImg />}
                      withPlaceholder
                      alt={data.product.name}
                    ></Image>
                  </MediaQuery>
                </Grid.Col>
                <Grid.Col span={12} xs={7}>
                  <Badge>{data.product.subcategory.name}</Badge>
                  <Title>{data.product.name}</Title>
                  <Text>{data.product.description}</Text>
                  <Group position="apart" maw={250}>
                    <Text color="green">Más barato</Text>
                    <Group spacing="xs">
                      <Text weight={700} size="xl">
                        $
                        {order === "pricePerUnit"
                          ? data.items[0]?.pricePerUnit
                          : data.items[0]?.price}
                      </Text>
                      {order === "pricePerUnit" && (
                        <Text>por {data?.product.units}</Text>
                      )}
                    </Group>
                  </Group>
                  <Group position="apart" maw={250}>
                    <Text color="red">Más caro</Text>
                    <Group spacing="xs">
                      <Text weight={700} size="xl">
                        $
                        {order === "pricePerUnit"
                          ? getLast(data.items)?.pricePerUnit
                          : getLast(data.items)?.price}
                      </Text>
                      {order === "pricePerUnit" && (
                        <Text>por {data.product.units}</Text>
                      )}
                    </Group>
                  </Group>
                  <Grid.Col span={7} md={5}>
                    <Select
                      label="Ordernar por"
                      value={order}
                      onChange={setOrder}
                      data={[
                        {
                          value: "pricePerUnit",
                          label: "Precio por unidad",
                        },
                        { value: "price", label: "Precio" },
                        // { value: "quantity", label: "Cantidad" },
                      ]}
                    ></Select>
                  </Grid.Col>
                </Grid.Col>
              </Grid>
            </Card>
            <Grid m="1.2rem">
              {data &&
                data.items.length > 0 &&
                data.items.map((item, index) => (
                  <Grid.Col key={item.id} span={6} lg={3} xl={2}>
                    <ItemCard data={item} position={index + 1} />
                  </Grid.Col>
                ))}
            </Grid>
          </>
        ) : (
          <Title order={1}>Producto no encontrado</Title>
        )}
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
  const { id: idProduct } = ctx.query;
  const url = `http://127.0.0.1:8080/items/${idProduct}`;
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
