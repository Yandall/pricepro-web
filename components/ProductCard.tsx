import { Badge, Card, Container, Group, Image, Text } from "@mantine/core";
import Link from "next/link";
import PlaceholderImg from "./PlaceHolderImg";

export type Product = {
  id: number;
  name: string;
  description: string;
  units: string;
  subcategory: { name: string };
  imgUrl: string;
};

export default function ProductCard({ data }: { data: Product }) {
  return (
    <Card
      radius="lg"
      h="100%"
      shadow="md"
      withBorder
      mah={380}
      mih="20rem"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Card.Section style={{ flex: "1 1 60%" }} pos="relative">
        <Link href={`/product/${data.id}`}>
          <Image
            src={data.imgUrl !== "" ? data.imgUrl : undefined}
            alt={data.name}
            withPlaceholder
            fit="cover"
            placeholder={<PlaceholderImg />}
            height="100%"
            styles={{
              image: { position: "absolute" },
              imageWrapper: { position: "inherit" },
              placeholder: {
                position: "absolute",
                width: "100%",
                height: "100%",
              },
            }}
          />
        </Link>
      </Card.Section>
      <Container m={0} px={0} style={{ flex: "1 1 40%" }}>
        <Group position="apart" mt="md" mb="s">
          <Text weight={700} component={Link} href={`/product/${data.id}`}>
            {data.name}
          </Text>

          <Text weight={200}>
            Unidades:{" "}
            <Text weight={400} display="inline">
              {data.units}
            </Text>
          </Text>
        </Group>

        <Badge color="teal">{data.subcategory.name}</Badge>
      </Container>
    </Card>
  );
}
