import { Group } from "@mantine/core";
import { useRouter } from "next/router";
import styles from "./NavList.module.css";
import NavLink, { NavLinkProps } from "./NavLink";
import { CSSProperties } from "react";

type Props = {
  className?: string;
  colorScheme?: string;
  style?: CSSProperties;
};

export default function NavList(props: Props) {
  const router = useRouter();
  const linkList: NavLinkProps[] = [
    {
      label: "Productos",
      href: "/search",
      active: isActive("/search"),
    },
    {
      label: "Sugerir producto",
      href: "/suggest",
      active: isActive("/suggest"),
    },
    {
      label: "Acerca de",
      href: "/#about",
    },
  ];

  function isActive(path: string) {
    return path === router.pathname;
  }
  return (
    <>
      <Group
        className={`${styles.navGroup} ${props.className}`}
        style={props.style}
      >
        {linkList.map((link, index) => (
          <NavLink
            label={link.label}
            href={link.href}
            active={link.active}
            colorScheme={props.colorScheme}
            key={index}
          />
        ))}
      </Group>
    </>
  );
}
