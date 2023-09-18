import { getLayout } from "@/components/MainLayout";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { SWRConfig } from "swr";
import useSWRImmutable from "swr/immutable";
import useSWRMutation from "swr/mutation";

import { Divider, Flex, Grid, Text, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import ItemCard, { Props as ItemProps } from "@/components/ItemCard";
import { useEffect, useMemo } from "react";
import { NextPageContext } from "next";
import Head from "next/head";
import { notifications } from "@mantine/notifications";
import { fetcher } from "@/utils/fetcher";
import type { Product, Item } from "@/utils/types";
import { Paginate } from "@/components/Paginate";
import isbot from "isbot";
import ProductSummary from "@/components/ProductSummary";
import { useQueryState } from "next-usequerystate";
import { useIsClient } from "@/components/IsClient";
import StoreIcon from "@/components/StoreIcon";

type ItemsData =
  | {
      items: Item[];
      metadata: { pages: number; total: number };
    }
  | undefined;

type ProductData = { product: Product } | undefined;

type UpdatingData =
  | {
      isProuctOld: boolean;
      lastUpdate: string;
    }
  | {
      productUpdated: boolean;
      lastUpdate: string;
    }
  | undefined;

function Content() {
  const router = useRouter();
  let { id: idProduct, page } = router.query;
  const [orderBy, setOrderBy] = useQueryState("orderBy", {
    defaultValue: (router.query.orderBy as string) || "pricePerUnit",
  });
  const [groupBy, setGroupBy] = useQueryState("groupBy", {
    defaultValue: (router.query.groupBy as string) || "none",
  });

  const isClient = useIsClient();
  if (isClient && !["price", "pricePerUnit"].includes(orderBy!))
    setOrderBy("pricePerUnit");
  if (isClient && !["store", "none"].includes(groupBy!)) setGroupBy("none");
  idProduct = (idProduct as string).split("-")[0];
  const urlProduct = `/api/product/${idProduct}`;
  const { data: dataProduct, mutate: mutateProduct } =
    useSWRImmutable<ProductData>(urlProduct, fetcher);

  const pageQuery = `?page=${Number(page) > 0 ? page : 1}`;
  const pageSizeQuery = `&pagesize=24`;
  let orderByQuery = "&orderby=pricePerUnit";
  if (orderBy || groupBy) {
    const queryValues = [groupBy === "store" ? groupBy : undefined, orderBy];
    orderByQuery = `&orderby=${queryValues.filter(Boolean).join()}`;
  }
  const urlItems = idProduct
    ? `/api/items/${idProduct}${pageQuery}${orderByQuery}${pageSizeQuery}`
    : "";
  const { data: dataItems, mutate: mutateItems } = useSWRImmutable<ItemsData>(
    urlItems,
    fetcher
  );

  const urlLowHiPrices = `/api/products/lowHiPrice`;
  const requestBody = {
    orderBy: orderBy,
    products: [Number(idProduct)],
    lowest: true,
  };

  const { data: itemLowestPrice, mutate: mutateLowestPrice } = useSWRImmutable<{
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
  const { data: itemHighestPrice, mutate: mutateHighestPrice } =
    useSWRImmutable<{
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

  const groupedItems = useMemo(() => {
    if (typeof dataItems === "undefined" || dataItems.items.length === 0)
      return null;

    if (groupBy === "store") {
      const stores = Array.from(
        new Set(dataItems.items.map((i) => i.store.name))
      );
      const storeGroupItems: [string, Item[]][] = stores.map((store) => [
        store,
        dataItems.items.filter((item) => item.store.name === store),
      ]);
      return storeGroupItems;
    } else {
      const noGroupItems: [string, Item[]][] = [["none", dataItems.items]];
      return noGroupItems;
    }
  }, [groupBy, dataItems]);
  const tryUpdateUrl = `/api/product/updateList/${idProduct}`;
  const { trigger: tryUpdate } = useSWRMutation<UpdatingData>(
    tryUpdateUrl,
    (url: string) => fetcher(url)
  );
  useEffect(() => {
    if (isbot(navigator.userAgent)) return;

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
      }, 60 * 1000);
    }, 2000);
    tryUpdate()
      .then((res) => {
        if (!res) return;
        if ("isProductOld" in res) clearTimeout(timeout);
      })
      .catch(() => {
        clearTimeout(timeout);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        {dataProduct ? (
          <>
            <title>{`${dataProduct.product.name} - PricePro`}</title>
            <link
              rel="canonical"
              href={`https://pricepro.com.co/product/${router.query.id}`}
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
              content={`https://pricepro.com.co${router.asPath}`}
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
            <ProductSummary
              product={dataProduct.product}
              orderBy={orderBy || "pricePerUnit"}
              setOrderBy={setOrderBy}
              groupBy={groupBy || "none"}
              setGroupBy={setGroupBy}
              itemLowestPrice={itemLowestPrice?.list[0]}
              itemHighestPrice={itemHighestPrice?.list[0]}
            />
            <Flex
              justify="space-between"
              direction="column"
              gap="lg"
              h="100%"
              w="100%"
            >
              <Grid m="1.2rem">
                {dataItems &&
                  groupedItems?.map((group) => (
                    <>
                      {groupBy === "store" && (
                        <Grid.Col key={group[0]} span={12}>
                          <Divider
                            label={
                              <Text
                                fz={22}
                                fw={600}
                                component={Flex}
                                gap="xs"
                                style={{ alignItems: "center" }}
                              >
                                <StoreIcon store={group[0]} size={28} />

                                {group[0]}
                              </Text>
                            }
                            size="md"
                            labelPosition="center"
                          />
                        </Grid.Col>
                      )}
                      {group[1].map((item) => (
                        <Grid.Col key={item.id} span={12} xs={6} lg={3} xl={2}>
                          <ItemCard
                            data={item}
                            key={item.id}
                            product={dataProduct.product}
                            orderBy={orderBy as ItemProps["orderBy"]}
                          />
                        </Grid.Col>
                      ))}
                    </>
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
  let { id: idProduct, page, orderBy, groupBy } = ctx.query;
  orderBy = ["price", "pricePerUnit"].includes(orderBy as string)
    ? orderBy
    : "pricePerUnit";
  groupBy = groupBy === "store" ? groupBy : undefined;
  let orderByQuery = "&orderby=pricePerUnit";
  if (orderBy || groupBy)
    orderByQuery = `&orderby=${[groupBy, orderBy].filter(Boolean).join()}`;
  idProduct = (idProduct as string).split("-")[0];
  const apiHost = process.env.API_HOST;
  const pageQuery = `?page=${Number(page) > 0 ? page : 1}`;
  const endpointItems = `items/${idProduct}${pageQuery}${orderByQuery}&pagesize=24`;
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
