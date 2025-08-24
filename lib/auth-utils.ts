export const hashPassword = async (password: string): Promise<string> => {
  // In a real app, use proper password hashing like bcrypt
  return btoa(password);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  // In a real app, use proper password verification
  return btoa(password) === hash;
};
