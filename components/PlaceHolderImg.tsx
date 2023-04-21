import { Flex } from "@mantine/core";
import { IconPhotoOff } from "@tabler/icons-react";

type Props = {
  size?: number | string;
  maxSize?: number | string;
};

export default function PlaceholderImg(props: Props) {
  return (
    <>
      <Flex
        h="100%"
        my={12}
        p={0}
        justify="center"
        align="center"
        mah={props.maxSize}
      >
        <IconPhotoOff
          width="100%"
          height="100%"
          max={props.maxSize}
          style={{ scale: "0.5" }}
        />
      </Flex>
    </>
  );
}
