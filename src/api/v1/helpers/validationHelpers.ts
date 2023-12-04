function validateUserId(userId: string) {
  const pattern = /^[0-9a-fA-F]{24}$/;
  return pattern.test(userId);
}

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

function validateNewUserObjectValues(newUserObject: any): boolean {
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
    { name: "isAdmin", validator: (value: any) => typeof value === "boolean" },
    { name: "isActive", validator: (value: any) => typeof value === "boolean" },
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
        typeof value === "string" && /^\d{3}-\d{3}-\d{4}$/.test(value),
    },
    {
      name: "img",
      validator: (value: any) => typeof value === "string" && value.length > 0,
    },
  ];
  const isValid = requiredFields.every(({ name, validator }) =>
    validator(newUserObject[name])
  );
  return isValid;
}
export {
  validateUserId,
  validateNewUserObjectFields,
  validateNewUserObjectValues,
};
