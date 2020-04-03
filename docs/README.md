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

Allow `sku-list` block in your version of `store.product` block.

```js
// store/interfaces.json
// ...
  {
    "store.product.custom": {
      "allowed": [
        "sku-list"
      ]
    }
  }
```

Add the block `sku-list` to `store.product`.

Example:

```diff
{
-  "store.product": {
+  "store.product.custom": {
     "children": [
       "flex-layout.row#product-breadcrumb",
-      "flex-layout.row#product-main",
+      "flex-layout.row#images-and-items",
+      "flex-layout.row#buy-button",
       "flex-layout.row#description",
       "shelf.relatedProducts",
       "product-reviews",
       "product-questions-and-answers"
     ]
   },
+  "flex-layout.row#images-and-items": {
+    "children": [
+      "product-images",
+      "flex-layout.col#sku-list"
+    ],
+    "props": {
+      "preventHorizontalStretch": false
+    }
+  },
+  "flex-layout.col#sku-list": {
+    "children": [
+      "flex-layout.row#sku-list-header",
+      "sku-list"
+    ],
+    "props": {
+      "preventVerticalStretch": true,
+      "width": "60%",
+      "blockClass": "skuList"
+    }
+  },
+  "flex-layout.row#sku-list-header": {
+    "props": {
+      "preventHorizontalStretch": false,
+      "blockClass": "skuListHeader"
+    },
+    "children": [
+      "rich-text#certificates",
+      "rich-text#expiry-date",
+      "rich-text#inventory",
+      "rich-text#price",
+      "rich-text#quantity-selector"
+    ]
+  },
+  "rich-text#certificates": {
+    "props": {
+      "text": "**Has Certificates?**",
+      "blockClass": "skuList",
+      "width": "20%"
+    }
+  },
+  "rich-text#expiry-date": {
+    "props": {
+      "text": "**Expires at**",
+      "blockClass": "skuList",
+      "width": "20%"
+    }
+  },
+  "rich-text#inventory": {
+    "props": {
+      "text": "**Stock**",
+      "blockClass": "skuList",
+      "width": "20%"
+    }
+  },
+  "rich-text#price": {
+    "props": {
+      "text": "**Price**",
+      "blockClass": "skuList",
+      "width": "20%"
+    }
+  },
+  "rich-text#quantity-selector": {
+    "props": {
+      "text": "**Quantity**",
+      "blockClass": "skuList",
+      "width": "20%"
+    }
+  },
+  "sku-list": {
+    "blocks": [
+      "sku-content.desktop",
+      "sku-content.mobile"
+    ]
+  },
+  "sku-content.desktop": {
+    "children": [
+      "flex-layout.row#item-main-desktop"
+    ]
+  },
+  "flex-layout.row#item-main-desktop": {
+    "props": {
+      "preventHorizontalStretch": false
+    },
+    "children": [
+      "flex-layout.col#sku-highlight-certificates",
+      "flex-layout.col#sku-highlight-expiry-date",
+      "flex-layout.col#sku-inventory",
+      "flex-layout.col#sku-price",
+      "flex-layout.col#sku-quantity-selector"
+    ]
+  },
+  "flex-layout.col#sku-highlight-certificates": {
+    "props": {
+      "width": "20%"
+    },
+    "children": [
+      "sku-highlights#certificates"
+    ]
+  },
+  "sku-highlights#certificates": {
+    "props": {
+      "conditional": {
+        "highlight": "admin/editor.sku-list.highlights.chooseDefaultSpecification",
+        "typeSpecifications": "Has Certificates"
+      },
+      "showLabel": false
+    }
+  },
+  "flex-layout.col#sku-highlight-expiry-date": {
+    "props": {
+      "width": "20%"
+    },
+    "children": [
+      "sku-highlights#expiry-date"
+    ]
+  },
+  "sku-highlights#expiry-date": {
+    "props": {
+      "conditional": {
+        "highlight": "admin/editor.sku-list.highlights.chooseDefaultSpecification",
+        "typeSpecifications": "Expiry Date"
+      },
+      "showLabel": false
+    }
+  },
+  "flex-layout.col#sku-inventory": {
+    "props": {
+      "width": "20%"
+    },
+    "children": [
+      "sku-inventory#default"
+    ]
+  },
+  "sku-inventory#default": {
+    "props": {
+      "showLabel": false
+    }
+  },
+  "sku-seller#inventory": {
+    "children": [
+      "seller-inventory"
+    ]
+  },
+  "flex-layout.col#sku-price": {
+    "props": {
+      "width": "20%"
+    },
+    "children": [
+      "sku-price"
+    ]
+  },
+  "flex-layout.col#sku-quantity-selector": {
+    "props": {
+      "width": "20%"
+    },
+    "children": [
+      "sku-quantity-selector"
+    ]
+  },
+
+
+
+  "sku-content.mobile": {
+    "children": [
+      "flex-layout.row#item-main-mobile"
+    ]
+  },
+  "flex-layout.row#item-main-mobile": {
+    "props": {
+      "preventHorizontalStretch": false
+    },
+    "children": [
+      "flex-layout.col#sku-highlight-certificates-mobile",
+      "flex-layout.col#sku-highlight-expiry-date-mobile",
+      "flex-layout.col#sku-inventory-mobile",
+      "flex-layout.col#sku-price-mobile",
+      "flex-layout.col#sku-quantity-selector-mobile"
+    ]
+  },
+  "flex-layout.col#sku-highlight-certificates-mobile": {
+    "props": {
+      "width": "20%"
+    },
+    "children": [
+      "sku-highlights#certificates-mobile"
+    ]
+  },
+  "sku-highlights#certificates-mobile": {
+    "props": {
+      "conditional": {
+        "highlight": "admin/editor.sku-list.highlights.chooseDefaultSpecification",
+        "typeSpecifications": "Has Certificates"
+      },
+      "showLabel": true
+    }
+  },
+  "flex-layout.col#sku-highlight-expiry-date-mobile": {
+    "props": {
+      "width": "20%"
+    },
+    "children": [
+      "sku-highlights#expiry-date-mobile"
+    ]
+  },
+  "sku-highlights#expiry-date-mobile": {
+    "props": {
+      "conditional": {
+        "highlight": "admin/editor.sku-list.highlights.chooseDefaultSpecification",
+        "typeSpecifications": "Expiry Date"
+      },
+      "showLabel": true
+    }
+  },
+  "flex-layout.col#sku-inventory-mobile": {
+    "props": {
+      "width": "20%"
+    },
+    "children": [
+      "sku-inventory#default-mobile"
+    ]
+  },
+  "sku-inventory#default-mobile": {
+    "props": {
+      "showLabel": true
+    }
+  },
+  "sku-seller#inventory-mobile": {
+    "children": [
+      "seller-inventory#mobile"
+    ]
+  },
+  "seller-inventory#mobile": {
+    "props": {
+      "showLabel": true
+    }
+  },
+  "flex-layout.col#sku-price-mobile": {
+    "props": {
+      "width": "20%"
+    },
+    "children": [
+      "sku-price#mobile"
+    ]
+  },
+  "sku-price#mobile": {
+    "props": {
+      "showLabel": true
+    }
+  },
+  "flex-layout.col#sku-quantity-selector-mobile": {
+    "props": {
+      "width": "20%"
+    },
+    "children": [
+      "sku-quantity-selector"
+    ]
+  },
+  "sku-quantity-selector#mobile": {
+    "props": {
+      "showLabel": true
+    }
+  },
+
+
   "flex-layout.row#product-breadcrumb": {
     "props": {
       "marginTop": 4
@@ -61,7 +326,8 @@
   },
   "product-images": {
     "props": {
-      "displayThumbnailsArrows": true
+      "displayThumbnailsArrows": true,
+      "width": "40%"
     }
   },
   "flex-layout.col#right-col": {
```

Hide the headings in mobile layout.

```css
// styles/css/vtex.flex-layout.css
// ...
.flexRow--skuListHeader {
  display: none;
}

@media only screen and (min-width: 40em) {
  .flexRow--skuListHeader {
    display: flex;
  }
}
```

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles                               |
| ----------------------------------------- |
| `sellerInventoryWrapper`                  |
| `sellerInventory`                         |
| `sellerName`                              |
| `productPriceBreaksContainer`             |
| `productPriceTable`                       |
| `colGroupQuantityBreak`                   |
| `colGroupUnitPrice`                       |
| `colGroupLeadTime`                        |
| `productPriceTableMainHeader`             |
| `productPricingTableTitle`                |
| `productPriceTableHeader`                 |
| `productPriceTableHeaderRow`              |
| `productPriceTableHeaderRowData`          |
| `productPriceTableRow`                    |
| `productPriceQuantityDataColumn`          |
| `productPriceTableQuantities`             |
| `productPriceTablePriceColumn`            |
| `productPriceTableLeadTimeColumn`         |
| `productPriceTableFooterRow`              |
| `productPriceTableFooterMultipleColumn`   |
| `productPriceBreaksContainer`             |
| `buyButtonText`                           |
| `buttonDataContainer`                     |
| `buttonItemsPrice`                        |
| `buyButtonContainer`                      |
| `buyButtonText`                           |
| `skuContentWrapper`                       |
| `selectedSkuContentWrapper`               |
| `skuImage`                                |
| `skuName`                                 |
| `specificationsTableContainer`            |
| `specificationsTabsContainer`             |
| `specificationsTitle`                     |
| `specificationsTable`                     |
| `specificationsTablePropertyHeading`      |
| `specificationsTableSpecificationHeading` |
| `specificationItemProperty`               |
| `specificationItemSpecifications`         |
| `quantitySelectorContainer`               |
| `quantitySelectorTitle`                   |
| `quantitySelectorStepper`                 |
| `availableQuantityContainer`              |
| `highlightContent`                        |
| `itemHighlight`                           |
| `highlightTitle`                          |
| `highlightValue`                          |
| `priceContainer`                          |
| `sellerPriceContainer`                    |
| `inventoryContainer`                      |
| `inventory`                               |
