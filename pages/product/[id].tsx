import { getLayout } from "@/components/MainLayout";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import useSWR, { SWRConfig } from "swr";
import useSWRImmutable from "swr/immutable";
import useSWRMutation from "swr/mutation";
import { compareAsc, format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Accordion,
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
import { IconChartLine, IconCheck, IconShare } from "@tabler/icons-react";
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
import { PriceChart } from "@/components/PriceChart/PriceChart";
import StoreIcon from "@/components/StoreIcon";
import isbot from "isbot";

type ItemsData =
  | {
      items: Item[];
      metadata: { pages: number; total: number };
    }
  | undefined;

type ProductData = { product: Product } | undefined;

type UpdatingData = {
  isProuctOld: boolean,
  lastUpdate: string
} | {
  productUpdated: boolean,
  lastUpdate:string
} | undefined

function Content() {
  const router = useRouter();
  const [order, setOrder] = useState<string | null>("pricePerUnit");
  let { id: idProduct, page } = router.query;
  idProduct = (idProduct as string).split("-")[0];
  const urlProduct = `/api/product/${idProduct}`;
  const { data: dataProduct, mutate: mutateProduct } =
    useSWRImmutable<ProductData>(urlProduct, fetcher);

  const pageQuery = `?page=${Number(page) > 0 ? page : 1}`;
  const isViewPortXl = useMediaQuery("(min-width: 88em)");
  const pageSizeQuery = `&pagesize=${isViewPortXl ? 24 : 12}`;
  const orderByQuery = `&orderby=${order}`;
  const urlItems = idProduct
    ? `/api/items/${idProduct}${pageQuery}${pageSizeQuery}${orderByQuery}`
    : "";
  const { data: dataItems, mutate: mutateItems } = useSWR<ItemsData>(
    urlItems,
    fetcher
  );

  const urlLowHiPrices = `/api/products/lowHiPrice`;
  const requestBody = {
    orderBy: order,
    products: [Number(idProduct)],
    lowest: true,
  };

  const { data: itemLowestPrice, mutate: mutateLowestPrice } = useSWR<{
    list: Item[];
  }>(
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
  const { data: itemHighestPrice, mutate: mutateHighestPrice } = useSWR<{
    list: Item[];
  }>(
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
  const tryUpdateUrl = `/api/product/updateList/${idProduct}`
  const {trigger: tryUpdate} = useSWRMutation<UpdatingData>(tryUpdateUrl, (url: string) => fetcher(url))
  useEffect(() => {
    if (isbot(navigator.userAgent)) 
      return
    
    const timeout = setTimeout(() => {
      notifications.show({
            id: `updating-data-${dataProduct?.product.name}`,
            title: `Actualizando producto "${dataProduct?.product.name}"`,
            message: "Datos actualizados en aproximadamente un minuto",
            loading: true,
            autoClose: false,
            withCloseButton: true,
          });
          setTimeout(() => {
            notifications.update({
              id: `updating-data-${dataProduct?.product.name}`,
              color: "teal",
              title: "¡Producto actualizado!",
              message:
                "Se actualizaron los datos del producto. Ya puedes cerrar esta notificación",
              icon: <IconCheck />,
              autoClose: 5000,
            });
            mutateProduct();
            mutateItems();
            mutateLowestPrice();
            mutateHighestPrice();
          }, 60 * 1000)
    }, 2000)
    tryUpdate().then(res => {
      if (!res) return
      if ("isProductOld" in res) clearTimeout(timeout)
    })
    .catch(() => {
      clearTimeout(timeout)
    })
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

  function getDateFormatted(date: string) {
    if (compareAsc(new Date(date), new Date(2023, 1, 1)) === -1) return "Nunca";
    return format(new Date(date), "PPP", {
      locale: es,
    });
  }

  return (
    <>
      <Head>
        {dataProduct ? (
          <>
            <title>{`${dataProduct.product.name} - PricePro`}</title>
            <link
              rel="canonical"
              href={`https://pricepro.vercel.app/product/${router.query.id}`}
            />
            <meta
              property="og:title"
              content={`${dataProduct.product.name} - PricePro`}
              key="og:title"
            />
            <meta
              name="description"
              content={`Compara y encuentra los precios más baratos de ${dataProduct.product.name} en PricePro`}
              key="description"
            />
            <meta
              property="og:description"
              content={`Compara y encuentra los precios más baratos de ${dataProduct.product.name} en PricePro`}
              key="og:description"
            />
            <meta
              property="og:url"
              content={`https://pricepro.vercel.app${router.asPath}`}
              key="og:url"
            />

            <meta
              property="og:image"
              content={`${dataProduct.product.imgUrl}`}
            />
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
        {dataProduct ? (
          <>
            <Card
              bg="transparent"
              withBorder
              shadow="lg"
              radius="lg"
              padding="lg"
              w="100%"
              styles={{ "align-items": "center" }}
              component="section"
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
                      src={dataProduct.product.imgUrl}
                      height={200}
                      placeholder={<PlaceholderImg />}
                      withPlaceholder
                      alt={dataProduct.product.name}
                    ></Image>
                  </MediaQuery>
                  <MediaQuery smallerThan="md" styles={{ display: "none" }}>
                    <Image
                      radius="lg"
                      height={400}
                      src={dataProduct.product.imgUrl}
                      placeholder={<PlaceholderImg />}
                      withPlaceholder
                      alt={dataProduct.product.name}
                    ></Image>
                  </MediaQuery>
                </Grid.Col>
                <Grid.Col span={12} xs={7}>
                  <Text fw={200} fz={12}>
                    Actualizado{" "}
                    {getDateFormatted(dataProduct.product.lastUpdate)}
                  </Text>
                  <Badge color="teal">
                    {dataProduct.product.subcategory.name}
                  </Badge>
                  <Title>{dataProduct.product.name}</Title>
                  <Text>{dataProduct.product.description}</Text>
                  <Group position="apart" maw={300}>
                    <Text color="green">Más barato</Text>
                    <Group spacing="xs">
                      <Text
                        weight={700}
                        size="xl"
                        component={Flex}
                        gap="xs"
                        style={{ alignItems: "center" }}
                      >
                        $
                        {order === "pricePerUnit"
                          ? itemLowestPrice?.list[0]?.pricePerUnit
                          : itemLowestPrice?.list[0]?.price}
                        {itemLowestPrice?.list[0] && (
                          <StoreIcon
                            store={itemLowestPrice.list[0].store.name}
                          />
                        )}
                      </Text>
                      {order === "pricePerUnit" && (
                        <Text>por {dataProduct.product.units}</Text>
                      )}
                    </Group>
                  </Group>
                  <Group position="apart" maw={300}>
                    <Text color="red">Más caro</Text>
                    <Group spacing="xs">
                      <Text
                        weight={700}
                        size="xl"
                        component={Flex}
                        gap="xs"
                        style={{ alignItems: "center" }}
                      >
                        $
                        {order === "pricePerUnit"
                          ? itemHighestPrice?.list[0]?.pricePerUnit
                          : itemHighestPrice?.list[0]?.price}
                        {itemHighestPrice?.list[0] && (
                          <StoreIcon
                            store={itemHighestPrice.list[0].store.name}
                          />
                        )}
                      </Text>
                      {order === "pricePerUnit" && (
                        <Text>por {dataProduct.product.units}</Text>
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
                      ]}
                    ></Select>
                  </Grid.Col>
                </Grid.Col>
                <Grid.Col span={12}>
                  {dataProduct.product.history.length > 1 && (
                    <>
                      <Accordion>
                        <Accordion.Item value="historyChart">
                          <Accordion.Control>
                            <Text component={Flex} gap="xs">
                              Historial de precios <IconChartLine />
                            </Text>
                          </Accordion.Control>
                          <Accordion.Panel>
                            <MediaQuery
                              smallerThan="md"
                              styles={{ height: "300px !important" }}
                            >
                              <PriceChart
                                history={dataProduct.product.history}
                                style={{ maxHeight: "50vh" }}
                              />
                            </MediaQuery>
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    </>
                  )}
                </Grid.Col>
              </Grid>
            </Card>
            <Flex
              justify="space-between"
              direction="column"
              gap="lg"
              h="100%"
              w="100%"
            >
              <Grid m="1.2rem">
                {dataItems &&
                  dataItems.items.length > 0 &&
                  sort(dataItems.items, order!).map((item, index) => (
                    <Grid.Col key={item.id} span={12} xs={6} lg={3} xl={2}>
                      <ItemCard
                        data={item}
                        product={dataProduct.product}
                        position={getItemPosition(index + 1)}
                        orderBy={order as ItemProps["orderBy"]}
                      />
                    </Grid.Col>
                  ))}
              </Grid>
              <Paginate
                total={dataItems?.metadata.total}
                pages={dataItems?.metadata.pages}
                current={dataItems?.items.length}
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
  fallback: { [k: string]: ItemsData | ProductData };
}> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback: fallback }}>
      <Content />
    </SWRConfig>
  );
};

Page.getLayout = getLayout;

export async function getServerSideProps(ctx: NextPageContext) {
  let { id: idProduct, page } = ctx.query;
  idProduct = (idProduct as string).split("-")[0];
  const apiHost = process.env.API_HOST;
  const pageQuery = `?page=${Number(page) > 0 ? page : 1}`;
  const endpointItems = `items/${idProduct}${pageQuery}&pagesize=12&orderby=pricePerUnit`;
  const endpointProduct = `product/${idProduct}`;
  const urlProduct = `${apiHost}${endpointProduct}`;
  const urlItems = `${apiHost}${endpointItems}`;
  let resItems: ItemsData = null!;
  let resProduct: ProductData = null!;
  try {
    resProduct = await fetcher(urlProduct);
    resItems = await fetcher(urlItems);
  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      fallback: {
        [`/api/${endpointItems}`]: resItems,
        [`/api/${endpointProduct}`]: resProduct,
      },
    },
  };
}

export default Page;
