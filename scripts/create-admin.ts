import { DbStorage } from "../server/db-storage";

const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123",
  name: "Administrator",
  role: "admin",
} as const;

async function createAdmin() {
  const storage = new DbStorage();
  
  try {
    const existing = await storage.getUserByUsername(DEFAULT_ADMIN.username);
    if (existing) {
      console.log("Admin user already exists");
      return;
    }

    const admin = await storage.createUser(DEFAULT_ADMIN);

    console.log("Admin user created successfully:");
    console.log("Username:", admin.username);
    console.log("\n⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdmin();
