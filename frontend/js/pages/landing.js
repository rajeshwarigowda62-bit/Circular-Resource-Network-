import "../nav.js";
import { RESOURCE_TYPES, RESOURCE_META } from "../constants.js";
import { h, icon } from "../ui.js";

document.getElementById("category-list").replaceChildren(
  ...RESOURCE_TYPES.map((type) => {
    const meta = RESOURCE_META[type];
    return h("li", { class: `tone-${meta.tone}` },
      h("span", { class: "category-icon" }, icon(meta.icon, 24)),
      h("div", {}, h("h3", {}, type), h("p", {}, meta.blurb)));
  }),
);
