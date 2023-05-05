import {
  Accordion,
  Badge,
  Flex,
  Navbar,
  NavbarProps,
  Title,
} from "@mantine/core";
import useSWRImmutable from "swr/immutable";
import type { Subcategory, Category } from "@/utils/types";
import { fetcher } from "@/utils/fetcher";

export default function NavBar(props: Omit<NavbarProps, "children">) {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  const urlSubcategory = `${apiHost}list/subcategory`;
  const urlCategory = `${apiHost}list/category`;

  const { data: dataSubcategory } = useSWRImmutable<{ list: Subcategory[] }>(
    urlSubcategory,
    fetcher
  );
  const { data: dataCategory } = useSWRImmutable<{ list: Category[] }>(
    urlCategory,
    fetcher
  );

  const categoryList = dataCategory?.list.map((category) => ({
    ...category,
    subcategories: dataSubcategory?.list.filter(
      (subcategory) => subcategory.category.id === category.id
    ),
  }));
  return (
    <Navbar {...props}>
      <Title order={3} mb="1rem">
        Categorías
      </Title>
      <Accordion>
        {categoryList &&
          categoryList.length > 0 &&
          categoryList.map((category) => (
            <Accordion.Item value={category.name} key={category.id}>
              <Accordion.Control>{category.name}</Accordion.Control>
              <Accordion.Panel>
                <Flex wrap="wrap" gap="sm">
                  {category.subcategories?.map((subcategory) => (
                    <Badge color="teal" key={subcategory.id}>
                      {subcategory.name}
                    </Badge>
                  ))}
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
      </Accordion>
    </Navbar>
  );
}
