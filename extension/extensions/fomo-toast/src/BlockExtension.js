import {
  extend,
  AdminBlock,
  BlockStack,
  Text
} from "@shopify/ui-extensions/admin";

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.product-details.block.render';

extend(TARGET, (root, { i18n, data }) => {
  console.log({data});

  root.append(
    // The AdminBlock component provides an API for setting the title of the Block extension wrapper.
    root.createComponent(
      AdminBlock,
      { title: "My Block Extension" },
      root.createComponent(BlockStack, null,
        root.createComponent(Text, { fontWeight: "bold" }, i18n.translate('welcome', {TARGET}))
      )
    )
  );
});