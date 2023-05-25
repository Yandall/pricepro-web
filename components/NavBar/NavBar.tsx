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
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

type Props = Omit<NavbarProps, "children"> & {
  setHidden?: Dispatch<SetStateAction<boolean>>;
};

export default function NavBar(props: Props) {
  const urlSubcategory = "/api/list/subcategory";
  const urlCategory = "/api/list/category";

  const { data: dataSubcategory } = useSWRImmutable<{ list: Subcategory[] }>(
    urlSubcategory,
    fetcher
  );
  const { data: dataCategory } = useSWRImmutable<{ list: Category[] }>(
    urlCategory,
    fetcher
  );

  dataSubcategory &&
    localStorage.setItem(
      "subcategoryList",
      JSON.stringify(dataSubcategory.list)
    );
  const categoryList = dataCategory?.list.map((category) => ({
    ...category,
    subcategories: dataSubcategory?.list.filter(
      (subcategory) => subcategory.category.id === category.id
    ),
  }));
  const toCopyProps = { ...props };
  delete toCopyProps.setHidden;
  return (
    <Navbar {...toCopyProps}>
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
                  {category.subcategories
                    ?.sort((prev, next) => prev.name.localeCompare(next.name))
                    .map((subcategory) => (
                      <Badge
                        color="teal"
                        key={subcategory.id}
                        component={Link}
                        href={`/search?subcategory=${subcategory.id}`}
                        onClick={() => props.setHidden?.(false)}
                        style={{ cursor: "pointer" }}
                      >
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
