export const validatePass = (pass: string) => {
  const isPass = pass.length >= 8;
  return isPass ? true : "Password must be at least 8 characters long.";
};
