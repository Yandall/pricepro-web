import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Image,
  Modal,
  Text,
  Tooltip,
} from "@mantine/core";
import type { Item, Product } from "@/utils/types";
import StoreIcon from "./StoreIcon";
import { IconChartLine, IconInfoCircle } from "@tabler/icons-react";
import { PriceChart } from "./PriceChart/PriceChart";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

export type Props = {
  data: Item;
  product: Product;
  orderBy: "pricePerUnit" | "price";
};

export default function ItemCard({
  data,
  product,
  orderBy = "pricePerUnit",
}: Props) {
  const [chartOpened, { open: openChart, close: closeChart }] =
    useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 50em)");
  return (
    <>
      <Card
        h="100%"
        style={{ display: "flex", flexDirection: "column" }}
        component="article"
      >
        <Card.Section>
          <a href={data.url} target="_blank" style={{ textDecoration: "none" }}>
            <Image
              src={data.imageUrl}
              alt={data.name}
              fit="contain"
              height={150}
              withPlaceholder
            />
          </a>
        </Card.Section>
        <Flex
          direction="column"
          mt="md"
          justify="space-between"
          style={{ flex: "1 0 auto" }}
        >
          <Flex direction="column" h="100%">
            <Flex justify="space-between">
              <Text component="a" href={data.url} target="_blank">
                {data.name}
              </Text>
              {data.history.length > 1 && (
                <ActionIcon onClick={openChart}>
                  <IconChartLine />
                </ActionIcon>
              )}
            </Flex>
            <Text weight={200} size="sm">
              Marca: {data.brand.name}
            </Text>
            <Text
              weight={200}
              size="sm"
              component={Flex}
              gap="xs"
              style={{ alignItems: "center" }}
            >
              Tienda: <StoreIcon store={data.store.name} />
            </Text>
            <Tooltip
              multiline
              label="El valor puede no ser exacto debido a que es calculado como PRECIO/PRECIO-POR-UNIDAD"
              events={{ focus: true, hover: true, touch: true }}
              zIndex={100}
            >
              <Text weight={200} size="sm" component={Flex} gap="xs">
                Cantidad: {data.quantity} {product.units}
                <IconInfoCircle size={16} style={{ alignSelf: "center" }} />
              </Text>
            </Tooltip>
            <Text>
              {orderBy === "pricePerUnit"
                ? `Precio: $${data.price}`
                : `Precio por ${product.units}: $${data.pricePerUnit}`}
            </Text>
            <Text mt="auto">
              {orderBy === "pricePerUnit"
                ? `Precio por ${product.units}:`
                : "Precio:"}
            </Text>
          </Flex>
          <Badge
            size="lg"
            color="yellow"
            component="a"
            href={data.url}
            target="_blank"
            style={{ cursor: "pointer" }}
          >
            ${orderBy === "pricePerUnit" ? data.pricePerUnit : data.price}
          </Badge>
        </Flex>
      </Card>
      {chartOpened && (
        <Modal.Root
          opened={chartOpened}
          onClose={closeChart}
          size={isMobile ? "100%" : "70%"}
          centered
        >
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>Historial de precios - {data.name}</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>
            <Modal.Body p="xl">
              <PriceChart
                history={data.history}
                style={{ height: "50vh", width: "100vw" }}
                show={{ price: true, pricePerUnit: false }}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
      )}
    </>
  );
}
