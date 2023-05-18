import { getLayout } from "@/components/MainLayout";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import useSWR, { SWRConfig } from "swr";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
import { IconCheck, IconShare } from "@tabler/icons-react";
import ItemCard, { Props as ItemProps } from "@/components/ItemCard";
import { useClipboard, useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { NextPageContext } from "next";
import Head from "next/head";
import PlaceholderImg from "@/components/PlaceHolderImg";
import { notifications } from "@mantine/notifications";
import { fetcher } from "@/utils/fetcher";
import type { Product, Item } from "@/utils/types";
import { Paginate } from "@/components/Paginate";

type ResponseData =
  | {
      product: Product;
      items: Item[];
      updating: boolean;
      metadata: { pages: number; total: number };
    }
  | undefined;

function Content() {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  const router = useRouter();
  const [order, setOrder] = useState<string | null>("pricePerUnit");
  let { id: idProduct, page } = router.query;
  idProduct = (idProduct as string).split("-")[0];
  const pageQuery = `?page=${Number(page) > 0 ? page : 1}`;
  const isViewPortXl = useMediaQuery("(min-width: 88em)");
  const pageSizeQuery = `&pagesize=${isViewPortXl ? 24 : 12}`;
  const orderByQuery = `&orderby=${order}`;
  const urlItems = idProduct
    ? `${apiHost}items/${idProduct}${pageQuery}${pageSizeQuery}${orderByQuery}`
    : "";
  const { data, mutate } = useSWR<ResponseData>(urlItems, fetcher);

  const urlLowHiPrices = `${apiHost}products/lowHiPrice`;
  const requestBody = {
    orderBy: order,
    products: [Number(idProduct)],
    lowest: true,
  };
  const { data: itemLowestPrice } = useSWR<{ list: Item[] }>(
    [
      urlLowHiPrices,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      },
    ],
    ([url, options]: [string, RequestInit]) => fetcher(url, options)
  );
  requestBody.lowest = false;
  const { data: itemHighestPrice } = useSWR<{ list: Item[] }>(
    [
      urlLowHiPrices,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      },
    ],
    ([url, options]: [string, RequestInit]) => fetcher(url, options)
  );
  const clipboard = useClipboard();

  useEffect(() => {
    if (data?.updating) {
      notifications.show({
        id: "updating-data",
        title: "Actualizando producto",
        message: "Datos actualizados en aproximadamente dos minutos",
        loading: true,
        autoClose: false,
        withCloseButton: true,
      });

      setTimeout(() => {
        notifications.update({
          id: "updating-data",
          color: "teal",
          title: "¡Producto actualizado!",
          message:
            "Se actualizaron los datos del producto. Ya puedes cerrar esta notificación",
          icon: <IconCheck />,
          autoClose: 5000,
        });
        mutate({ ...data, updating: false });
      }, 120 * 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clipboardHandler() {
    let copyUrl = window.location.href;
    clipboard.copy(copyUrl);
  }

  function sort(list: Item[], orderBy: string) {
    if (orderBy === "pricePerUnit" && list.length > 0) {
      return list.sort((prev, next) => prev.pricePerUnit - next.pricePerUnit);
    } else if (orderBy === "price" && list.length > 0) {
      return list.sort((prev, next) => prev.price - next.price);
    }
    return list;
  }

  function getItemPosition(offset: number = 0) {
    let position = isViewPortXl ? 24 : 12;
    position *= Number(page || 1) - 1;
    return position + offset;
  }

  return (
    <>
      <Head>
        {data ? (
          <>
            <title>{`${data.product.name} - PricePro`}</title>
            <meta
              property="og:title"
              content={`${data.product.name} - PricePro`}
              key="og:title"
            />
            <meta
              name="description"
              content={`Encuentra los precios más baratos de ${data.product.name} en PricePro`}
              key="description"
            />
            <meta
              property="og:description"
              content={`Encuentra los precios más baratos de ${data.product.name} en PricePro`}
              key="og:description"
            />
            <meta
              property="og:url"
              content={`https://pricepro.vercel.app${router.asPath}`}
              key="og:url"
            />

            <meta property="og:image" content={`${data.product.imgUrl}.jpg`} />
          </>
        ) : (
          <>
            <title>Producto no encontrado - PricePro</title>
            <meta
              property="og:title"
              content="Producto no encontrado - Pricepro"
              key="og:title"
            />
          </>
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
                        color="teal"
                        radius="xl"
                        style={{
                          position: "absolute",
                          margin: "1rem",
                          zIndex: 2,
                          borderWidth: "2px",
                        }}
                      >
                        <IconShare stroke={2} />
                      </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Text>¡Enlace copiado!</Text>
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
                  <Text fw={200} fz={12}>
                    Actualizado en{" "}
                    {format(new Date(data.product.lastUpdate), "PPP", {
                      locale: es,
                    })}
                  </Text>
                  <Badge color="teal">{data.product.subcategory.name}</Badge>
                  <Title>{data.product.name}</Title>
                  <Text>{data.product.description}</Text>
                  <Group position="apart" maw={250}>
                    <Text color="green">Más barato</Text>
                    <Group spacing="xs">
                      <Text weight={700} size="xl">
                        $
                        {order === "pricePerUnit"
                          ? itemLowestPrice?.list[0]?.pricePerUnit
                          : itemLowestPrice?.list[0]?.price}
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
                          ? itemHighestPrice?.list[0]?.pricePerUnit
                          : itemHighestPrice?.list[0]?.price}
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
            <Flex justify="space-between" direction="column" gap="lg" h="100%">
              <Grid m="1.2rem">
                {data &&
                  data.items.length > 0 &&
                  sort(data.items, order!).map((item, index) => (
                    <Grid.Col key={item.id} span={12} xs={6} lg={3} xl={2}>
                      <ItemCard
                        data={item}
                        position={getItemPosition(index + 1)}
                        orderBy={order as ItemProps["orderBy"]}
                      />
                    </Grid.Col>
                  ))}
              </Grid>
              <Paginate
                total={data.metadata.total}
                pages={data.metadata.pages}
                current={data.items.length}
              />
            </Flex>
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
  let { id: idProduct, page } = ctx.query;
  idProduct = (idProduct as string).split("-")[0];
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  let pageQuery = `?page=${Number(page) > 0 ? page : 1}`;
  const url = `${apiHost}items/${idProduct}${pageQuery}&pagesize=12&orderby=pricePerUnit`;
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
