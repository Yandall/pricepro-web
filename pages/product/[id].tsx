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
import { IconCheck, IconShare } from "@tabler/icons-react";
import ItemCard, { Item, Props as ItemProps } from "@/components/ItemCard";
import { useClipboard } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { NextPageContext } from "next";
import Head from "next/head";
import PlaceholderImg from "@/components/PlaceHolderImg";
import { notifications } from "@mantine/notifications";

type ResponseData =
  | {
      product: Product;
      items: Item[];
      updating: boolean;
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
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  const router = useRouter();
  let { id: idProduct } = router.query;
  idProduct = (idProduct as string).split("-")[0];
  let url = idProduct ? `${apiHost}items/${idProduct}` : "";
  const { data, mutate } = useSWR<ResponseData>(url, fetcher);
  const [order, setOrder] = useState<string | null>("pricePerUnit");
  const clipboard = useClipboard();

  useEffect(() => {
    if (data?.updating) {
      notifications.show({
        id: "updating-data",
        title: "Actualizando producto",
        message: "Datos actualizados en aproximadamente un minuto",
        loading: true,
        autoClose: false,
        withCloseButton: false,
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
      }, 60 * 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clipboardHandler() {
    let copyUrl = window.location.href;
    clipboard.copy(copyUrl);
  }

  function getLast<T>(list?: Array<T>) {
    if (!list) return;
    return list[list.length - 1];
  }

  function sort(list: Item[], orderBy: string) {
    if (orderBy === "pricePerUnit" && list.length > 0) {
      return list.sort((prev, next) => prev.pricePerUnit - next.pricePerUnit);
    } else if (orderBy === "price" && list.length > 0) {
      return list.sort((prev, next) => prev.price - next.price);
    }
    return list;
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
                  <Badge color="teal">{data.product.subcategory.name}</Badge>
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
                sort(data.items, order!).map((item, index) => (
                  <Grid.Col key={item.id} span={12} xs={6} lg={3} xl={2}>
                    <ItemCard
                      data={item}
                      position={index + 1}
                      orderBy={order as ItemProps["orderBy"]}
                    />
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
  let { id: idProduct } = ctx.query;
  idProduct = (idProduct as string).split("-")[0];
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  const url = `${apiHost}items/${idProduct}`;
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
