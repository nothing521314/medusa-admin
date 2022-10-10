import qs from "qs";

const allowedFilters = ["query", "offset", "limit"];

export type TQuotationFilters = {
  limit: number;
  offset: number;
  query: string;
};

const DEFAULT_PAGE_SIZE = 15;

export const parseQuotationQueryString = (
  queryString?: string
): unknown => {
  const defaultVal: TQuotationFilters = {
    offset: 0,
    limit: DEFAULT_PAGE_SIZE,
    query: "",
  };

  if (queryString) {
    const filters = qs.parse(queryString);
    for (const [key, value] of Object.entries(filters)) {
      if (allowedFilters.includes(key)) {
        switch (key) {
          case "offset": {
            if (typeof value === "string") {
              defaultVal.offset = parseInt(value);
            }
            break;
          }
          case "limit": {
            if (typeof value === "string") {
              defaultVal.limit = parseInt(value);
            }
            break;
          }
          case "query": {
            if (typeof value === "string") {
              defaultVal.query = value;
            }
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  }

  return removeEmptyProperties(defaultVal);
};

export const removeEmptyProperties = (obj: {
  [key: string]: string | number | Array<string> | undefined | boolean;
}) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== "")
  );
};
