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
      if (!username || !password || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const sanitizedUsername = String(username).replace(/[^a-zA-Z0-9_]/g, '').substring(0, 50);
      const sanitizedName = String(name).replace(/[<>"'&]/g, '').substring(0, 100);
      const sanitizedRole = role === 'admin' ? 'admin' : 'user';
      const user = await createUser(sanitizedUsername, password, sanitizedName, sanitizedRole);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: 'Registration failed' });
    }
  });

  app.post("/api/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: 'Login failed' });
        req.logIn(user, (err) => {
          if (err) return next(err);
          res.json({ user });
        });
      })(req, res, next);
    } catch (error: any) {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  });

  app.post("/api/logout", requireAuth, (req, res) => {
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

  app.get("/api/csrf-token", requireAuth, (req, res) => {
    res.json({ csrfToken: req.session?.id || '' });
  });

  app.post("/api/init-spreadsheet", requireAuth, async (req, res) => {
    try {
      const { title } = req.body;
      const sanitizedTitle = typeof title === 'string' 
        ? title.replace(/[<>"'&]/g, '').substring(0, 100)
        : "MHNET - Data Pelanggan WiFi";
      const spreadsheet = await createSpreadsheet(
        sanitizedTitle || "MHNET - Data Pelanggan WiFi",
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
      res.status(500).json({ error: 'Failed to initialize spreadsheet' });
    }
  });

  app.get("/api/customers", requireAuth, async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error: any) {
      console.error('Failed to fetch customers:', error);
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  });

  app.get("/api/psb", requireAuth, async (req, res) => {
    try {
      const psbCustomers = await storage.getAllPSB();
      res.json(psbCustomers);
    } catch (error: any) {
      console.error('Failed to fetch PSB:', error);
      res.status(500).json({ error: 'Failed to fetch PSB' });
    }
  });

  app.get("/api/customers/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id.replace(/[^a-zA-Z0-9-]/g, '');
      const customer = await storage.getCustomer(id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch customer' });
    }
  });

  app.post("/api/customers", requireAuth, async (req, res) => {
    try {
      const validated = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validated);
      res.json(customer);
    } catch (error: any) {
      res.status(400).json({ error: 'Invalid customer data' });
    }
  });

  app.put("/api/customers/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id.replace(/[^a-zA-Z0-9-]/g, '');
      const validated = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(id, validated);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error: any) {
      res.status(400).json({ error: 'Invalid customer data' });
    }
  });

  app.delete("/api/customers/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id.replace(/[^a-zA-Z0-9-]/g, '');
      const success = await storage.deleteCustomer(id);
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete customer' });
    }
  });

  app.get("/api/packages", requireAuth, async (req, res) => {
    try {
      const packages = await storage.getAllPackages();
      res.json(packages);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch packages' });
    }
  });

  app.get("/api/packages/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id.replace(/[^a-zA-Z0-9-]/g, '');
      const pkg = await storage.getPackage(id);
      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(pkg);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch package' });
    }
  });

  app.post("/api/packages", requireAuth, async (req, res) => {
    try {
      const validated = insertPackageSchema.parse(req.body);
      const pkg = await storage.createPackage(validated);
      res.json(pkg);
    } catch (error: any) {
      res.status(400).json({ error: 'Invalid package data' });
    }
  });

  app.put("/api/packages/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id.replace(/[^a-zA-Z0-9-]/g, '');
      const validated = insertPackageSchema.partial().parse(req.body);
      const pkg = await storage.updatePackage(id, validated);
      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(pkg);
    } catch (error: any) {
      res.status(400).json({ error: 'Invalid package data' });
    }
  });

  app.delete("/api/packages/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id.replace(/[^a-zA-Z0-9-]/g, '');
      const success = await storage.deletePackage(id);
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete package' });
    }
  });

  app.get("/api/payments", requireAuth, async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  });

  app.get("/api/payments/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id.replace(/[^a-zA-Z0-9-]/g, '');
      const payment = await storage.getPayment(id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch payment' });
    }
  });

  app.post("/api/payments", requireAuth, async (req, res) => {
    try {
      const validated = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validated);
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ error: 'Invalid payment data' });
    }
  });

  app.put("/api/payments/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id.replace(/[^a-zA-Z0-9-]/g, '');
      const validated = insertPaymentSchema.partial().parse(req.body);
      const payment = await storage.updatePayment(id, validated);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ error: 'Invalid payment data' });
    }
  });

  app.delete("/api/payments/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id.replace(/[^a-zA-Z0-9-]/g, '');
      const success = await storage.deletePayment(id);
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete payment' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
