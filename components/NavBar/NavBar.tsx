import { Badge, Flex, Navbar, NavbarProps, Title } from "@mantine/core";
import useSWR from "swr";

type Subcategory = {
  name: string;
  id: number;
  category: { name: string; id: string };
};

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

export default function NavBar(props: Omit<NavbarProps, "children">) {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  const url = `${apiHost}list/subcategory`;
  const { data } = useSWR<{ list: Subcategory[] }>(url, fetcher);

  return (
    <>
      <Navbar {...props}>
        <Title order={3} mb="1rem">
          Categorías
        </Title>
        <Flex wrap="wrap" gap="sm">
          {data &&
            data.list.map((subcategory) => (
              <Badge color="teal" key={subcategory.id}>
                {subcategory.name}
              </Badge>
            ))}
        </Flex>
      </Navbar>
    </>
  );
}
