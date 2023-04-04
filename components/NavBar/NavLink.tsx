import { Text } from "@mantine/core";
import Link from "next/link";
import styles from "./NavBar.module.css";

export default function NavLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active?: boolean;
}) {
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
