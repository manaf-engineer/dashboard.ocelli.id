// /common/error-utils.ts
import { ValidationError } from 'class-validator';

export const extractErrorMessages = (
  errors: ValidationError[],
  parentPath = '',
): { field: string; message: string }[] => {
  const messages: { field: string; message: string }[] = [];

  errors.forEach((error, index) => {
    const currentField = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      messages.push({
        field: currentField,
        message: error.constraints[Object.keys(error.constraints)[0]],
      });
    }

    if (error.children && error.children.length > 0) {
      // Include index for child elements
      error.children.forEach((childError, childIndex) => {
        messages.push(...extractErrorMessages([childError], currentField));
      });
    }
  });

  return messages;
};
