import { DbStorage } from "../server/db-storage";

async function createAdmin() {
  const storage = new DbStorage();
  
  try {
    const existing = await storage.getUserByUsername("admin");
    if (existing) {
      console.log("Admin user already exists");
      return;
    }

    const admin = await storage.createUser({
      username: "admin",
      password: "admin123",
      name: "Administrator",
      role: "admin",
    });

    console.log("Admin user created successfully:");
    console.log("Username:", admin.username);
    console.log("Password: admin123");
    console.log("\n⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

createAdmin();
