import { fetcher } from "@/utils/fetcher";
import { Product } from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const host = req.headers.host;
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/xml");
  let products: Product[] = [];
  let page = 1;
  let data: { list: Product[]; metadata: { total: number; pages: number } };
  do {
    data = await fetcher(
      `${process.env.API_HOST}list/product?pagesize=100&page=${page}`
    );
    products = products.concat(data.list);
    page++;
  } while (data.list.length > 0);
  res.setHeader("Cache-control", "stale-while-revalidate, s-maxage=3600");

  let productUrls = "";
  products.forEach((product) => {
    productUrls += `
    <url>
      <loc>${host}/product/${product.id}-${product.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replaceAll(" ", "_")}</loc>
      <lastmod>${new Date()}</lastmod>
    </url>
    `;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
    <url>
      <loc>${host}</loc>
      <lastmod>${new Date()}</lastmod>
    </url>
    <url>
      <loc>${host}/search</loc>
      <lastmod>${new Date()}</lastmod>
    </url>
    <url>
      <loc>${host}/suggest</loc>
      <lastmod>${new Date()}</lastmod>
    </url>
    ${productUrls}
  </urlset>`;

  res.end(xml);
}
