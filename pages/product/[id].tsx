import { getLayout } from "@/components/MainLayout";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { Product } from "@/components/ProductCard";
import useSWR, { Fetcher } from "swr";
import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  Popover,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { IconShare } from "@tabler/icons-react";

import ItemCard, { Item } from "@/components/ItemCard";
import { useClipboard } from "@mantine/hooks";
import { useEffect, useState } from "react";

// TODO: Hacer fetcher generico y que valide la url
const fetcher: Fetcher<{ product: Product; items: Item[] }, string> = (url) =>
  fetch(url).then((res) => res.json());

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { id: idProduct } = router.query;
  let url = `http://127.0.0.1:8080/items/${idProduct ?? 1}`;
  const { data, error, isLoading } = useSWR(url, fetcher);

  const [order, setOrder] = useState<string | null>("pricePerUnit");
  const { items } = data ? data : { items: new Array<Item>() };

  // Se estan renderizando datos viejos
  useEffect(() => {
    if (order === "pricePerUnit") {
      items.sort((prev, next) => prev.pricePerUnit - next.pricePerUnit);
    } else if (order === "price") {
      items.sort((prev, next) => prev.price - next.price);
    }
    // else {
    //   items.sort((prev, next) => prev.quantity - next.quantity);
    // }
  }, [order, items]);

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
      <Flex direction="column" align="center" mt={10}>
        <Card
          bg="transparent"
          withBorder
          shadow="lg"
          radius="lg"
          padding="lg"
          styles={{ "align-items": "center" }}
        >
          <Grid>
            <Grid.Col span={5}>
              <Popover withArrow shadow="md" onOpen={clipboardHandler}>
                <Popover.Target>
                  <ActionIcon
                    size="lg"
                    variant="outline"
                    color="indigo"
                    radius="xl"
                    style={{ position: "absolute", margin: "1rem", zIndex: 2 }}
                  >
                    <IconShare stroke={2} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text>Copiado</Text>
                </Popover.Dropdown>
              </Popover>

              <Image
                radius="lg"
                src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                withPlaceholder
                alt={data?.product.name}
              ></Image>
            </Grid.Col>
            <Grid.Col span={7}>
              <Badge>{data?.product.subcategory.name}</Badge>
              <Title>{data?.product.name}</Title>
              <Text>{data?.product.description}</Text>
              <Group position="apart" maw={250}>
                <Text color="green">Más barato</Text>
                <Group spacing="xs">
                  <Text weight={700} size="xl">
                    $
                    {order === "pricePerUnit"
                      ? data?.items[0]?.pricePerUnit
                      : data?.items[0]?.price}
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
                      ? getLast(data?.items)?.pricePerUnit
                      : getLast(data?.items)?.price}
                  </Text>
                  {order === "pricePerUnit" && (
                    <Text>por {data?.product.units}</Text>
                  )}
                </Group>
              </Group>
              <Grid.Col span={5}>
                <Select
                  label="Ordernar por"
                  value={order}
                  onChange={setOrder}
                  data={[
                    { value: "pricePerUnit", label: "Precio por unidad" },
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
              <Grid.Col key={item.id} xs={4} sm={4} md={4} lg={3} xl={2}>
                <ItemCard data={item} position={index + 1} />
              </Grid.Col>
            ))}
        </Grid>
      </Flex>
    </>
  );
};

Page.getLayout = getLayout;

export default Page;
