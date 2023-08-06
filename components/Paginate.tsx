import { Flex, Pagination, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  pages?: number;
  total?: number;
  current?: number;
};

export function Paginate({ pages, total, current }: Props) {
  const { query, asPath } = useRouter();
  function getPaginationUrl(page: number) {
    let currentPath = asPath.split("?")[0];
    let pageLink = `${currentPath}?page=${page}`;
    let queryParams = Object.keys(query);
    if (queryParams.length > 0) {
      for (const key of queryParams) {
        // Ignore [id] and page params
        if (query[key] !== "" && key !== "id" && key !== "page") {
          pageLink += `&${key}=${query[key]}`;
        }
      }
    }
    return pageLink;
  }
  return (
    <Flex align="center" direction="column">
      <Text>
        {current || 0} de {total || 0}
      </Text>

      <Pagination
        value={Number(query.page) || 1}
        total={pages || 1}
        getItemProps={(page) => ({
          component: Link,
          href: getPaginationUrl(page),
        })}
        getControlProps={(control) => {
          let activePage = Number(query.page || 1);
          if (control === "previous" && activePage - 1 > 0)
            return {
              component: Link,
              href: getPaginationUrl(activePage - 1),
            };
          if (control === "next" && activePage + 1 <= (pages || 1))
            return {
              component: Link,
              href: getPaginationUrl(activePage + 1),
            };
          return {};
        }}
      />
    </Flex>
  );
}
