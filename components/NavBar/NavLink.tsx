import { Text } from "@mantine/core";
import Link from "next/link";
import styles from "./NavList.module.css";

export type NavLinkProps = {
  label: string;
  href: string;
  active?: boolean;
};

export default function NavLink({ label, href, active }: NavLinkProps) {
  return (
    <Text
      component={Link}
      href={href}
      className={`${styles.navLink} ${active ? styles.active : ""}`}
    >
      {label}
    </Text>
  );
}
