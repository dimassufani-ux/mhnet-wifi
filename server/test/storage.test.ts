import { describe, it, expect, beforeEach } from "vitest";
import { MemStorage } from "../storage";

describe("MemStorage", () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  it("should create and retrieve customer", async () => {
    const customer = await storage.createCustomer({
      name: "Test Customer",
      phone: "08123456789",
      address: "Test Address",
      packageId: "pkg-1",
      status: "active",
      installationDate: new Date(),
    });

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("Test Customer");

    const retrieved = await storage.getCustomer(customer.id);
    expect(retrieved).toEqual(customer);
  });

  it("should update customer", async () => {
    const customer = await storage.createCustomer({
      name: "Test Customer",
      phone: "08123456789",
      address: "Test Address",
      packageId: "pkg-1",
      status: "active",
      installationDate: new Date(),
    });

    const updated = await storage.updateCustomer(customer.id, { name: "Updated Name" });
    expect(updated?.name).toBe("Updated Name");
  });

  it("should delete customer", async () => {
    const customer = await storage.createCustomer({
      name: "Test Customer",
      phone: "08123456789",
      address: "Test Address",
      packageId: "pkg-1",
      status: "active",
      installationDate: new Date(),
    });

    const deleted = await storage.deleteCustomer(customer.id);
    expect(deleted).toBe(true);

    const retrieved = await storage.getCustomer(customer.id);
    expect(retrieved).toBeUndefined();
  });
});
