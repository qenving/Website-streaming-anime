import sanitizeHtml from "sanitize-html";

const cleanValue = (value) => {
  if (typeof value === "string") {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();
  }
  if (Array.isArray(value)) {
    return value.map((item) => cleanValue(item));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, cleanValue(val)]));
  }
  return value;
};

export const sanitizeBody = () => (req, res, next) => {
  if (req.body) {
    req.body = cleanValue(req.body);
  }
  next();
};

export const sanitizeQuery = () => (req, res, next) => {
  if (req.query) {
    req.query = cleanValue(req.query);
  }
  next();
};