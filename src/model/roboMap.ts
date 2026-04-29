
// mapping each label to a item
export const LABEL_TO_CODE: Record<string, string> = {
  a: "jab",
  b: "uppercut",
  c: "boom",
  d: "megaboom",
  e: "doubletap",
  f: "autopunch",
  g: "bot",
  h: "helpinghand",
  i: "gattling",
  j: "poweroffriendship"
};

//reverse mapping
export const CODE_TO_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(LABEL_TO_CODE).map(([label, code]) => [code, label])
);