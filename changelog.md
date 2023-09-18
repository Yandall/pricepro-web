# Changelog

## Patch v0.2.2-beta

- Removed webhook to update product data

## Patch v0.2.1-beta

- Updated metatags data

## Patch v0.2.0-beta

- Added 4 new stores (D1, Makro, Zapatoca and Olímpica)
- Refactored the way data is obtained
- Added group by store option
- Migrated from cloudinary to cloudflare R2

## Patch v0.1.4-beta

- Avoid products being updated by robots

## Patch v0.1.3-beta

- Improve SEO performance
- Added `robots.txt` and `sitemap.xml` files

## Patch v0.1.2-beta

- Change max height for product price chart
- Added store icon for lowest and highest price in product info
- Use memo for footer, navbar and navlist for better performance
- Fixed bug with fetch in search page by using `getServerSideProps()`

## Patch v0.1.1-beta

- Change update notification time from 2 min to 1 min
- Change product card and item card to have a bigger anchor tag
- Change some components to use semantic elements
- Added new PricePro brand images

## Release v0.1-beta

First major release of PricePro. Features

- Search for product
- View product description
- View lowest and highest price of product
- Order products by price per unit or total price
- Show history price chart for product and especific products
- Allow add suggestion for new products
- Button to save to clipboard current product link page
- Click in especific product to open new tab for the store page
- Auto reload product page when data is old (this happens only after 7 days from last update)
- Filter products by category
