// src/utils/hotjar.js
import { injectContentsquareScript } from '@contentsquare/tag-sdk';

export const initHotjar = () => {
  injectContentsquareScript({
    siteId: "5357982", // your site ID
    async: true,
    defer: false,
  });
};

