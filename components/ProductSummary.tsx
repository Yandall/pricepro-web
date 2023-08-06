import {
  Card,
  Grid,
  Popover,
  ActionIcon,
  MediaQuery,
  Badge,
  Group,
  Flex,
  Select,
  Accordion,
  Image,
  Text,
  Title,
} from "@mantine/core";
import { IconShare, IconChartLine } from "@tabler/icons-react";
import PlaceholderImg from "./PlaceHolderImg";
import { PriceChart } from "./PriceChart/PriceChart";
import StoreIcon from "./StoreIcon";
import { useClipboard } from "@mantine/hooks";
import { compareAsc, format } from "date-fns";
import { es } from "date-fns/locale";
import { Item, Product } from "@/utils/types";

type Props = {
  product: Product;
  itemLowestPrice?: Item;
  itemHighestPrice?: Item;
  orderBy: string;
  setOrderBy: (value: string) => void;
  groupBy: string;
  setGroupBy: (value: string) => void;
};

export default function ProductSummary({
  product,
  itemHighestPrice,
  itemLowestPrice,
  orderBy: order,
  setOrderBy: setOrder,
  groupBy: groupBy,
  setGroupBy: setGroupBy,
}: Props) {
  let clipboard = useClipboard();
  function clipboardHandler() {
    let copyUrl = window.location.href;
    clipboard.copy(copyUrl);
  }
  function getDateFormatted(date: string) {
    if (compareAsc(new Date(date), new Date(2023, 1, 1)) === -1) return "Nunca";
    return format(new Date(date), "PPP", {
      locale: es,
    });
  }
  return (
    <Card
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
              src={product.imgUrl}
              height={200}
              placeholder={<PlaceholderImg />}
              withPlaceholder
              alt={product.name}
            ></Image>
          </MediaQuery>
          <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <Image
              radius="lg"
              height={400}
              src={product.imgUrl}
              placeholder={<PlaceholderImg />}
              withPlaceholder
              alt={product.name}
            ></Image>
          </MediaQuery>
        </Grid.Col>
        <Grid.Col span={12} xs={7}>
          <Text fw={200} fz={12}>
            Actualizado {getDateFormatted(product.lastUpdate)}
          </Text>
          <Badge color="teal">{product.subcategory.name}</Badge>
          <Title>{product.name}</Title>
          <Text>{product.description}</Text>
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
                  ? itemLowestPrice?.pricePerUnit
                  : itemLowestPrice?.price}
              </Text>
              {order === "pricePerUnit" && <Text>por {product.units}</Text>}
              {itemLowestPrice && (
                <StoreIcon store={itemLowestPrice?.store.name} />
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
                  ? itemHighestPrice?.pricePerUnit
                  : itemHighestPrice?.price}
              </Text>
              {order === "pricePerUnit" && <Text>por {product.units}</Text>}
              {itemHighestPrice && (
                <StoreIcon store={itemHighestPrice.store.name} />
              )}
            </Group>
          </Group>
          <Grid.Col span={7} md={5}>
            <Select
              label="Ordernar por"
              value={order}
              onChange={(value) => setOrder(value!)}
              data={[
                {
                  value: "pricePerUnit",
                  label: "Precio por unidad",
                },
                { value: "price", label: "Precio" },
              ]}
            ></Select>
            <Select
              label="Agrupar por"
              value={groupBy}
              onChange={(value) => setGroupBy(value!)}
              data={[
                { value: "none", label: "Ninguno" },
                {
                  value: "store",
                  label: "Tienda",
                },
              ]}
            ></Select>
          </Grid.Col>
        </Grid.Col>
        <Grid.Col span={12}>
          {product.history.length > 1 && (
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
                        history={product.history}
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
  );
}
