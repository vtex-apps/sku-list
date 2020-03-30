# SKU List for Product Details

> A list of SKUs.

## Usage

Add this app to your theme dependencies:

```js
// manifest.json
// ...
  "dependencies": {
    // ...
    "vtex.sku-list": "0.x"
  }
```

Add the block `sku-list` to `store.product`.

Example:

```diff
 {
   "store.product": {
     "children": [
       "flex-layout.row#product-breadcrumb",
       "flex-layout.row#product-main",
       "flex-layout.row#description",
+      "sku-list#default",
       "shelf.relatedProducts",
       "product-reviews",
       "product-questions-and-answers"
     ]
   },
+  "sku-list#default": {
+    "blocks": [
+      "sku-content#default"
+    ]
+  },
+  "sku-content#default": {
+    "children": [
+      "sku-name",
+      "sku-image",
+      "sku-quantity-selector",
+      "sku-buy-button",
+      "sku-seller",
+      "sku-specifications"
+    ]
+  },
+  "sku-seller": {
+    "children": [
+      "flex-layout.row#name-and-inventory"
+    ]
+  },
+  "flex-layout.row#name-and-inventory": {
+    "children": [
+      "seller-name",
+      "seller-inventory",
+      "seller-price"
+    ]
+  },
   "flex-layout.row#product-breadcrumb": {
     "props": {
       "marginTop": 4
```

This component will check if the logged in user has all conditions rules specified in the Trade Policy configuration. If not the user will be redirected to `/login`. If allowed, it will render the page.

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles |
| --- |
| `sellerInventoryWrapper` |
| `sellerInventory` |
| `sellerName` |
| `productPriceBreaksContainer` |
| `productPriceTable` |
| `colGroupQuantityBreak` |
| `colGroupUnitPrice` |
| `colGroupLeadTime` |
| `productPriceTableMainHeader` |
| `productPricingTableTitle` |
| `productPriceTableHeader` |
| `productPriceTableHeaderRow` |
| `productPriceTableHeaderRowData` |
| `productPriceTableRow` |
| `productPriceQuantityDataColumn` |
| `productPriceTableQuantities` |
| `productPriceTablePriceColumn` |
| `productPriceTableLeadTimeColumn` |
| `productPriceTableFooterRow` |
| `productPriceTableFooterMultipleColumn` |
| `productPriceBreaksContainer` |
| `buyButtonText` |
| `buttonDataContainer` |
| `buttonItemsPrice` |
| `buyButtonContainer` |
| `buyButtonText` |
| `skuContentWrapper` |
| `selectedSkuContentWrapper` |
| `skuImage` |
| `skuName` |
| `specificationsTableContainer` |
| `specificationsTabsContainer` |
| `specificationsTitle` |
| `specificationsTable` |
| `specificationsTablePropertyHeading` |
| `specificationsTableSpecificationHeading` |
| `specificationItemProperty` |
| `specificationItemSpecifications` |
| `quantitySelectorContainer` |
| `quantitySelectorTitle` |
| `quantitySelectorStepper` |
| `availableQuantityContainer` |
| `highlightContent` |
| `itemHighlight` |
| `highlightTitle` |
| `highlightValue` |
| `priceContainer` |
| `sellerPriceContainer` |
| `inventoryContainer` |
| `inventory` |
