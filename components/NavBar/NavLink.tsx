import { Text } from "@mantine/core";
import Link from "next/link";
import styles from "./NavList.module.css";

export type NavLinkProps = {
  label: string;
  href: string;
  active?: boolean;
  colorScheme?: string;
};

export default function NavLink({
  label,
  href,
  active,
  colorScheme,
}: NavLinkProps) {
  return (
    <Text
      component={Link}
      href={href}
      className={`${colorScheme === "dark" ? styles.darkBorderColor : ""} 
      ${styles.navLink} ${active ? styles.active : ""}`}
    >
      {label}
    </Text>
  );
}
