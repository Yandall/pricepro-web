import { Badge, Card, Group, Image, Text } from "@mantine/core";
import Link from "next/link";

export type Product = {
  id: number;
  name: string;
  description: string;
  units: string;
  subcategory: { name: string };
};

export default function ProductCard({ data }: { data: any }) {
  return (
    <Card radius="lg" h="100%" shadow="md" withBorder>
      <Card.Section>
        <Link href={`/product/${data.id}`}>
          <Image
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            alt={data.name}
            fit="scale-down"
          />
        </Link>
      </Card.Section>
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

      <Badge color="indigo">{data.subcategory.name}</Badge>
    </Card>
  );
}
