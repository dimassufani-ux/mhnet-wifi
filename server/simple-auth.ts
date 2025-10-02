import bcrypt from "bcryptjs";

// Simple in-memory user storage (bisa diganti dengan Google Sheets jika mau)
const users = new Map<string, { username: string; password: string; name: string; role: string }>();

// Default admin user
const defaultAdmin = {
  username: "admin",
  password: bcrypt.hashSync("admin123", 10),
  name: "Administrator",
  role: "admin"
};
users.set("admin", defaultAdmin);

export async function verifyUser(username: string, password: string) {
  const user = users.get(username);
  if (!user) return null;
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  
  return { username: user.username, name: user.name, role: user.role };
}

export async function createUser(username: string, password: string, name: string, role: string = "user") {
  if (users.has(username)) {
    throw new Error("Username already exists");
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username, password: hashedPassword, name, role };
  users.set(username, user);
  
  return { username, name, role };
}
