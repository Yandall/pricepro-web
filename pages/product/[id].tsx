import { getLayout } from "@/components/MainLayout";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { id: idProduct } = router.query;
  console.log(router.query);
  return <h1>Hola {idProduct}</h1>;
};

Page.getLayout = getLayout;

export default Page;
