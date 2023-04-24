import { getLayout } from "@/components/MainLayout";
import {
  Autocomplete,
  Button,
  Card,
  Grid,
  Group,
  Image,
  List,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { Product } from "@/components/ProductCard";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconUpload, IconX } from "@tabler/icons-react";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";

type Subcategory = {
  name: string;
  id: number;
  category: { name: string; id: number };
};

type Suggestion = {
  name: string;
  description: string;
  units: string;
  subcategory: string;
  exampleUrl: string;
  imgBuffer?: FileWithPath;
};

function isUrl(error: string, required = true) {
  const urlRegex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
  return (value: string) => {
    if (!required && value === "") return null;
    return urlRegex.test(value) ? null : error;
  };
}

function getAutocompleteData(data?: { list: Product[] | Subcategory[] }) {
  return data?.list.map((p) => p.name) || [];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

async function insertSuggestion(url: string, { arg }: { arg: Suggestion }) {
  let formdata = new FormData();
  formdata.append("name", arg.name);
  formdata.append("description", arg.description);
  formdata.append("units", arg.units);
  formdata.append("exampleUrl", arg.exampleUrl);
  formdata.append("subcategory", arg.subcategory);
  if (arg.imgBuffer && arg.imgBuffer.size !== 0)
    formdata.append("imgBuffer", arg.imgBuffer, arg.imgBuffer.name);
  return fetch(url, {
    method: "POST",
    body: formdata,
  }).then((res) => res.json());
}

export default function Page() {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  const form = useForm<Suggestion>({
    initialValues: {
      name: "",
      description: "",
      units: "",
      subcategory: "",
      exampleUrl: "",
    },
    validate: {
      name: (value) =>
        value.length < 5 ? "Ingresa al menos 5 caracteres" : null,
      description: (value) =>
        value.length < 10 ? "Describe más el producto" : null,
      units: (value) => (value === "" ? "Debes eligir un valor" : null),
      subcategory: (value) => (value === "" ? "Debes elegir un valor" : null),
      exampleUrl: isUrl("Dirección invalida", false),
    },
  });
  const [imgFile, setImgFile] = useState<FileWithPath>();
  const [productUrl, setProductUrl] = useState("");
  const debouncedProductUrl = useDebouncedValue(productUrl, 500);
  const { data: productData } = useSWR<{ list: Product[] }>(
    debouncedProductUrl[0],
    fetcher
  );
  const { name: productQuery } = form.values;

  const { data: subcategoryData } = useSWR<{ list: Subcategory[] }>(
    `${apiHost}list/subcategory`,
    fetcher
  );

  const suggestionURL = `${apiHost}products/suggest`;
  const { trigger: sendSuggestion } = useSWRMutation(
    suggestionURL,
    insertSuggestion
  );

  useEffect(() => {
    setProductUrl(`${apiHost}products/search?search=${productQuery}`);
  }, [productQuery, apiHost]);

  async function submitSuggestion(values: Suggestion) {
    if (form.validate().hasErrors) return;
    const subcategoryId =
      subcategoryData?.list.find((s) => s.name === values.subcategory)?.id +
        "" || "";
    if (subcategoryId === "undefined") {
      form.setFieldError("subcategory", "Elige un valor de la lista");
      return;
    }
    if (imgFile && imgFile.size !== 0) values.imgBuffer = imgFile;
    const newSuggestion = Object.assign({}, values, {
      subcategory: +subcategoryId,
    });
    try {
      const res = await sendSuggestion(newSuggestion);
      if (res.ok) {
        form.reset();
        setImgFile(undefined);
        notifications.show({
          title: "Éxito",
          message: "La sugerencia se ha enviado",
          color: "green",
          icon: <IconCheck />,
        });
      } else
        notifications.show({
          title: "Error",
          message: "El producto ya existe",
          color: "red",
          icon: <IconX />,
        });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "La sugerencia ya existe",
        color: "red",
        icon: <IconX />,
      });
    }
  }

  return (
    <Grid justify="center" pt={20}>
      <Grid.Col span={8}>
        <Title order={1} mb={20}>
          Sugerir un producto
        </Title>
        <Text>
          Llena el formulario para sugerir un producto que pienses que debería
          estar en nuestra lista.
        </Text>
        <Text inline>
          Tu sugerencia será revisada y si cumple con nuestras condiciones la
          añadiremos a la lista de <b>Productos</b>.
        </Text>
        <Text>
          Las condiciones para que tu sugerencia sea aceptada son las
          siguientes:
        </Text>
        <List>
          <List.Item>
            Debe ser un producto que ya no esté en nuestra lista (el
            autocompletador te ayudará a verificar que no exista)
          </List.Item>
          <List.Item>
            El producto debe tener unidad (gr, ml) para poder ser ordenado
          </List.Item>
          <List.Item>
            El producto debe existir en al menos tres tiendas que esten listadas
            en <b>PricePro</b>
          </List.Item>
        </List>
        <Card mx="auto" mt={30} style={{ overflow: "auto" }}>
          <form onSubmit={form.onSubmit(submitSuggestion)}>
            <Autocomplete
              label="Producto"
              withAsterisk
              placeholder="Arroz blanco"
              mb={20}
              data={getAutocompleteData(productData)}
              {...form.getInputProps("name")}
            />
            <Textarea
              label="Descripción"
              withAsterisk
              placeholder="El arroz es un cereal rico en carbohidratos y su principal beneficio para la salud es aportarle energía al organismo. Además de esto, también contiene aminoácidos, vitaminas y minerales esenciales para el funcionamiento del cuerpo."
              mb={20}
              {...form.getInputProps("description")}
            />
            <Select
              label="Unidades"
              withAsterisk
              placeholder="Gramos"
              data={[
                { value: "gr", label: "Gramos" },
                { value: "ml", label: "Mililitros" },
              ]}
              mb={20}
              {...form.getInputProps("units")}
            />
            <Autocomplete
              label="Subcategoría"
              placeholder="Granos"
              withAsterisk
              data={getAutocompleteData(subcategoryData)}
              dropdownPosition="bottom"
              mb={20}
              {...form.getInputProps("subcategory")}
            />
            <TextInput
              label="Url ejemplo"
              placeholder="https://www.exito.com/arroz-blanco-arroba-12500-gr-61887/p"
              mb={20}
              {...form.getInputProps("exampleUrl")}
            />
            <Dropzone
              accept={IMAGE_MIME_TYPE}
              onDrop={(file) => setImgFile(file[0])}
              maxFiles={1}
              maxSize={3 * 1024 ** 2}
            >
              <Group position="center" spacing="xl">
                <IconUpload />
                Sube una imagen
              </Group>
            </Dropzone>
            {imgFile && (
              <SimpleGrid
                cols={4}
                breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                mt="xl"
              >
                <Image
                  src={URL.createObjectURL(imgFile)}
                  alt={form.values.name}
                />
              </SimpleGrid>
            )}
            <Group position="right" mt="md">
              <Button type="submit">Enviar</Button>
            </Group>
          </form>
        </Card>
      </Grid.Col>
    </Grid>
  );
}

Page.getLayout = getLayout;
