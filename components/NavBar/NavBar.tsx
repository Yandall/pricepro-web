import { Group } from "@mantine/core";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import styles from "./NavBar.module.css";
import NavLink from "./NavLink";

export default function NavBar() {
  const router = useRouter();

  function isActive(path: string) {
    return path === router.pathname;
  }
  return (
    <Group className={styles.navGroup}>
      <NavLink label="Productos" href="/search" active={isActive("/search")} />
      <NavLink
        label="Sugerir producto"
        href="/suggest"
        active={isActive("/suggest")}
      />
      <NavLink label="Acerca de" href="/" active={isActive("/product/[id]s")} />
    </Group>
  );
}
