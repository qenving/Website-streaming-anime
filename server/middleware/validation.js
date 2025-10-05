import { z } from "zod";
import { AppError } from "../utils/errors.js";

const parseData = (schema, data) => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    throw new AppError("Validation failed", 422, errors);
  }
  return parsed.data;
};

export const validateBody = (schema) => (req, res, next) => {
  try {
    req.validatedBody = parseData(schema, req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateQuery = (schema) => (req, res, next) => {
  try {
    req.validatedQuery = parseData(schema, req.query);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateParams = (schema) => (req, res, next) => {
  try {
    req.validatedParams = parseData(schema, req.params);
    next();
  } catch (error) {
    next(error);
  }
};

export const idParamSchema = z.object({
  id: z.string().min(1),
});