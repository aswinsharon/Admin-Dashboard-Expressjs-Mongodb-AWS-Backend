import { validationObject } from "../interfaces/types/Types";

/**
 *
 * @param {string} userId
 * @returns {boolean}
 */

function validateUserId(userId: string): boolean {
  const pattern = /^[0-9a-fA-F]{24}$/;
  return pattern.test(userId);
}

/**
 *
 * @param {object} newUserObject
 * @returns {boolean}
 */
function validateNewUserObjectFields(newUserObject: any): boolean {
  const requiredFields = [
    "username",
    "email",
    "isAdmin",
    "isActive",
    "password",
    "address",
    "phone",
    "img",
  ];
  const isValid = requiredFields.every((field) => newUserObject[field]);
  return isValid;
}

/**
 *
 * @param {object} newUserObject
 * @returns {boolean}
 */

function validateNewUserObjectValues(newUserObject: any): validationObject {
  let invalidFields: string[] = [];
  let validationObject: validationObject = {
    isValid: false,
    invalidFields: [],
  };
  const requiredFields = [
    {
      name: "username",
      validator: (value: any) => typeof value === "string" && value.length > 0,
    },
    {
      name: "email",
      validator: (value: any) =>
        typeof value === "string" && /\S+@\S+\.\S+/.test(value),
    },
    {
      name: "isAdmin",
      validator: (value: any) =>
        typeof value === "string" && (value === "yes" || value === "no"),
    },
    {
      name: "isActive",
      validator: (value: any) =>
        typeof value === "string" && (value === "yes" || value === "no"),
    },
    {
      name: "password",
      validator: (value: any) => typeof value === "string" && value.length >= 8,
    },
    {
      name: "address",
      validator: (value: any) => typeof value === "string" && value.length > 0,
    },
    {
      name: "phone",
      validator: (value: any) =>
        typeof value === "string" && /^\d{10}$/.test(value),
    },
    {
      name: "img",
      validator: (value: any) => typeof value === "string" && value.length > 0,
    },
  ];
  requiredFields.forEach(({ name, validator }) => {
    if (!validator(newUserObject[name])) {
      invalidFields.push(name);
    }
  });
  if (invalidFields.length) {
    validationObject.isValid = false;
    validationObject.invalidFields = invalidFields;
  } else {
    validationObject.isValid = true;
  }
  return validationObject;
}

export {
  validateUserId,
  validateNewUserObjectFields,
  validateNewUserObjectValues,
};
