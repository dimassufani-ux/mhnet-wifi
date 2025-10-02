import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCustomerSchema, insertPackageSchema, insertPaymentSchema, loginSchema } from "@shared/schema";
import { GoogleSheetStorage } from "./sheets-storage";
import { createSpreadsheet } from "./google-sheets";
import { requireAuth } from "./auth";
import { createUser } from "./simple-auth";
import passport from "passport";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const { username, password, name, role } = req.body;
      const user = await createUser(username, password, name, role);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info?.message || "Login failed" });
        req.logIn(user, (err) => {
          if (err) return next(err);
          res.json({ user });
        });
      })(req, res, next);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  app.post("/api/init-spreadsheet", requireAuth, async (req, res) => {
    try {
      const { title } = req.body;
      const spreadsheet = await createSpreadsheet(
        title || "MHNET - Data Pelanggan WiFi",
        ["Pelanggan", "Paket", "Pembayaran"]
      );
      
      const tempStorage = new GoogleSheetStorage(spreadsheet.spreadsheetId || "");
      await tempStorage.ensureHeaders();

      res.json({
        success: true,
        spreadsheetId: spreadsheet.spreadsheetId,
        spreadsheetUrl: spreadsheet.spreadsheetUrl,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/customers", requireAuth, async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/customers/:id", requireAuth, async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/customers", requireAuth, async (req, res) => {
    try {
      const validated = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validated);
      res.json(customer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/customers/:id", requireAuth, async (req, res) => {
    try {
      const validated = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, validated);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/customers/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteCustomer(req.params.id);
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/packages", requireAuth, async (req, res) => {
    try {
      const packages = await storage.getAllPackages();
      res.json(packages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/packages/:id", requireAuth, async (req, res) => {
    try {
      const pkg = await storage.getPackage(req.params.id);
      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(pkg);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/packages", requireAuth, async (req, res) => {
    try {
      const validated = insertPackageSchema.parse(req.body);
      const pkg = await storage.createPackage(validated);
      res.json(pkg);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/packages/:id", requireAuth, async (req, res) => {
    try {
      const validated = insertPackageSchema.partial().parse(req.body);
      const pkg = await storage.updatePackage(req.params.id, validated);
      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(pkg);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/packages/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deletePackage(req.params.id);
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/payments", requireAuth, async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/payments/:id", requireAuth, async (req, res) => {
    try {
      const payment = await storage.getPayment(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/payments", requireAuth, async (req, res) => {
    try {
      const validated = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validated);
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/payments/:id", requireAuth, async (req, res) => {
    try {
      const validated = insertPaymentSchema.partial().parse(req.body);
      const payment = await storage.updatePayment(req.params.id, validated);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/payments/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deletePayment(req.params.id);
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
