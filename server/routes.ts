import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertPatientSchema,
  insertAppointmentSchema,
  insertMedicalRecordSchema,
  insertPrescriptionSchema,
  insertPrescriptionItemSchema,
  insertLabRequestSchema,
  insertLabRequestItemSchema,
  insertLabResultSchema,
  insertInpatientAdmissionSchema,
  insertBillingSchema,
  insertBillingItemSchema,
  insertUserSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return res.json(userWithoutPassword);
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    const users = await storage.getUsers();
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(usersWithoutPasswords);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/stats", async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  app.get("/api/dashboard/recent-activities", async (req, res) => {
    const activities = await storage.getRecentActivities();
    res.json(activities);
  });

  app.get("/api/dashboard/upcoming-appointments", async (req, res) => {
    const appointments = await storage.getUpcomingAppointmentsList();
    res.json(appointments);
  });

  app.get("/api/dashboard/hospital-capacity", async (req, res) => {
    const capacity = await storage.getHospitalCapacity();
    res.json(capacity);
  });

  // Patient routes
  app.get("/api/patients", async (req, res) => {
    const { query } = req.query;
    if (query && typeof query === "string") {
      const patients = await storage.searchPatients(query);
      return res.json(patients);
    }
    const patients = await storage.getPatients();
    res.json(patients);
  });

  app.get("/api/patients/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }
    const patient = await storage.getPatient(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (error) {
      res.status(400).json({ message: "Invalid patient data", error });
    }
  });

  app.put("/api/patients/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }
    try {
      const patientData = insertPatientSchema.partial().parse(req.body);
      const patient = await storage.updatePatient(id, patientData);
      res.json(patient);
    } catch (error) {
      res.status(400).json({ message: "Invalid patient data", error });
    }
  });

  // Department routes
  app.get("/api/departments", async (req, res) => {
    const departments = await storage.getDepartments();
    res.json(departments);
  });

  app.get("/api/departments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid department ID" });
    }
    const department = await storage.getDepartment(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(department);
  });

  // Doctor routes
  app.get("/api/doctors", async (req, res) => {
    const { departmentId } = req.query;
    if (departmentId && typeof departmentId === "string") {
      const id = parseInt(departmentId);
      if (!isNaN(id)) {
        const doctors = await storage.getDoctorsByDepartment(id);
        return res.json(doctors);
      }
    }
    const doctors = await storage.getDoctors();
    res.json(doctors);
  });

  app.get("/api/doctors/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }
    const doctor = await storage.getDoctor(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  });

  app.get("/api/doctors/:id/schedules", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }
    const schedules = await storage.getDoctorSchedules(id);
    res.json(schedules);
  });

  // Appointment routes
  app.get("/api/appointments", async (req, res) => {
    const { patientId, doctorId, departmentId, today, upcoming } = req.query;
    
    if (today === "true") {
      const appointments = await storage.getTodayAppointments();
      return res.json(appointments);
    }
    
    if (upcoming === "true") {
      const appointments = await storage.getUpcomingAppointments();
      return res.json(appointments);
    }
    
    if (patientId && typeof patientId === "string") {
      const id = parseInt(patientId);
      if (!isNaN(id)) {
        const appointments = await storage.getPatientAppointments(id);
        return res.json(appointments);
      }
    }
    
    if (doctorId && typeof doctorId === "string") {
      const id = parseInt(doctorId);
      if (!isNaN(id)) {
        const appointments = await storage.getDoctorAppointments(id);
        return res.json(appointments);
      }
    }
    
    if (departmentId && typeof departmentId === "string") {
      const id = parseInt(departmentId);
      if (!isNaN(id)) {
        const appointments = await storage.getDepartmentAppointments(id);
        return res.json(appointments);
      }
    }
    
    const appointments = await storage.getAppointments();
    res.json(appointments);
  });

  app.get("/api/appointments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }
    const appointment = await storage.getAppointment(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ message: "Invalid appointment data", error });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }
    try {
      const appointmentData = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(id, appointmentData);
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ message: "Invalid appointment data", error });
    }
  });

  // Medical Record routes
  app.get("/api/medical-records", async (req, res) => {
    const { patientId } = req.query;
    if (patientId && typeof patientId === "string") {
      const id = parseInt(patientId);
      if (!isNaN(id)) {
        const records = await storage.getPatientMedicalRecords(id);
        return res.json(records);
      }
    }
    
    // We don't want to return all medical records for security reasons
    return res.status(400).json({ message: "Patient ID is required" });
  });

  app.get("/api/medical-records/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid medical record ID" });
    }
    const record = await storage.getMedicalRecord(id);
    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }
    res.json(record);
  });

  app.post("/api/medical-records", async (req, res) => {
    try {
      const recordData = insertMedicalRecordSchema.parse(req.body);
      const record = await storage.createMedicalRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: "Invalid medical record data", error });
    }
  });

  app.put("/api/medical-records/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid medical record ID" });
    }
    try {
      const recordData = insertMedicalRecordSchema.partial().parse(req.body);
      const record = await storage.updateMedicalRecord(id, recordData);
      res.json(record);
    } catch (error) {
      res.status(400).json({ message: "Invalid medical record data", error });
    }
  });

  // Prescription routes
  app.get("/api/prescriptions", async (req, res) => {
    const { patientId } = req.query;
    if (patientId && typeof patientId === "string") {
      const id = parseInt(patientId);
      if (!isNaN(id)) {
        const prescriptions = await storage.getPatientPrescriptions(id);
        return res.json(prescriptions);
      }
    }
    
    // We don't want to return all prescriptions for security reasons
    return res.status(400).json({ message: "Patient ID is required" });
  });

  app.get("/api/prescriptions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid prescription ID" });
    }
    const prescription = await storage.getPrescription(id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    
    // Get prescription items
    const items = await storage.getPrescriptionItems(id);
    
    // Enhance items with medication details
    const enhancedItems = await Promise.all(items.map(async (item) => {
      const medication = await storage.getMedication(item.medicationId);
      return {
        ...item,
        medication: medication || { name: "Unknown" },
      };
    }));
    
    res.json({
      ...prescription,
      items: enhancedItems,
    });
  });

  app.post("/api/prescriptions", async (req, res) => {
    try {
      const { prescription, items } = req.body;
      
      const prescriptionData = insertPrescriptionSchema.parse(prescription);
      const createdPrescription = await storage.createPrescription(prescriptionData);
      
      const createdItems = [];
      
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const itemData = insertPrescriptionItemSchema.parse({
            ...item,
            prescriptionId: createdPrescription.id,
          });
          
          const createdItem = await storage.createPrescriptionItem(itemData);
          createdItems.push(createdItem);
          
          // Update medication stock
          const medication = await storage.getMedication(item.medicationId);
          if (medication) {
            await storage.updateMedication(medication.id, {
              stock: medication.stock - item.quantity,
            });
          }
        }
      }
      
      res.status(201).json({
        ...createdPrescription,
        items: createdItems,
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid prescription data", error });
    }
  });

  app.put("/api/prescriptions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid prescription ID" });
    }
    try {
      const prescriptionData = insertPrescriptionSchema.partial().parse(req.body);
      const prescription = await storage.updatePrescription(id, prescriptionData);
      res.json(prescription);
    } catch (error) {
      res.status(400).json({ message: "Invalid prescription data", error });
    }
  });

  // Medication routes
  app.get("/api/medications", async (req, res) => {
    const { category, lowStock } = req.query;
    
    if (category && typeof category === "string") {
      const medications = await storage.getMedicationsByCategory(category);
      return res.json(medications);
    }
    
    if (lowStock === "true") {
      const medications = await storage.getLowStockMedications();
      return res.json(medications);
    }
    
    const medications = await storage.getMedications();
    res.json(medications);
  });

  app.get("/api/medications/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid medication ID" });
    }
    const medication = await storage.getMedication(id);
    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }
    res.json(medication);
  });

  // Lab routes
  app.get("/api/lab-tests", async (req, res) => {
    const tests = await storage.getLabTests();
    res.json(tests);
  });

  app.get("/api/lab-requests", async (req, res) => {
    const { patientId } = req.query;
    if (patientId && typeof patientId === "string") {
      const id = parseInt(patientId);
      if (!isNaN(id)) {
        const requests = await storage.getPatientLabRequests(id);
        return res.json(requests);
      }
    }
    
    // We don't want to return all lab requests for security reasons
    return res.status(400).json({ message: "Patient ID is required" });
  });

  app.get("/api/lab-requests/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid lab request ID" });
    }
    const request = await storage.getLabRequest(id);
    if (!request) {
      return res.status(404).json({ message: "Lab request not found" });
    }
    
    // Get request items
    const items = await storage.getLabRequestItems(id);
    
    // Enhance items with test details
    const enhancedItems = await Promise.all(items.map(async (item) => {
      const test = await storage.getLabTest(item.labTestId);
      return {
        ...item,
        test: test || { name: "Unknown" },
      };
    }));
    
    // Get results if any
    const results = await storage.getLabRequestResults(id);
    
    res.json({
      ...request,
      items: enhancedItems,
      results,
    });
  });

  app.post("/api/lab-requests", async (req, res) => {
    try {
      const { request, items } = req.body;
      
      const requestData = insertLabRequestSchema.parse(request);
      const createdRequest = await storage.createLabRequest(requestData);
      
      const createdItems = [];
      
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const itemData = insertLabRequestItemSchema.parse({
            ...item,
            labRequestId: createdRequest.id,
          });
          
          const createdItem = await storage.createLabRequestItem(itemData);
          createdItems.push(createdItem);
        }
      }
      
      res.status(201).json({
        ...createdRequest,
        items: createdItems,
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid lab request data", error });
    }
  });

  app.post("/api/lab-results", async (req, res) => {
    try {
      const resultData = insertLabResultSchema.parse(req.body);
      const result = await storage.createLabResult(resultData);
      
      // Update lab request status if all tests have results
      const request = await storage.getLabRequest(resultData.labRequestId);
      if (request) {
        const items = await storage.getLabRequestItems(request.id);
        const results = await storage.getLabRequestResults(request.id);
        
        if (items.length <= results.length) {
          await storage.updateLabRequest(request.id, { status: "completed" });
        }
      }
      
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid lab result data", error });
    }
  });

  // Room and Bed routes
  app.get("/api/rooms", async (req, res) => {
    const { type } = req.query;
    if (type && typeof type === "string") {
      const rooms = await storage.getRoomsByType(type);
      return res.json(rooms);
    }
    
    const rooms = await storage.getRooms();
    res.json(rooms);
  });

  app.get("/api/rooms/:id/beds", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }
    const beds = await storage.getRoomBeds(id);
    res.json(beds);
  });

  app.get("/api/beds/available", async (req, res) => {
    const beds = await storage.getAvailableBeds();
    res.json(beds);
  });

  // Inpatient Admission routes
  app.get("/api/inpatient/admissions", async (req, res) => {
    const { patientId, active } = req.query;
    
    if (active === "true") {
      const admissions = await storage.getActiveAdmissions();
      return res.json(admissions);
    }
    
    if (patientId && typeof patientId === "string") {
      const id = parseInt(patientId);
      if (!isNaN(id)) {
        const admissions = await storage.getPatientAdmissions(id);
        return res.json(admissions);
      }
    }
    
    // We don't want to return all admissions for security reasons
    return res.status(400).json({ message: "Patient ID is required or specify active=true" });
  });

  app.get("/api/inpatient/admissions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid admission ID" });
    }
    const admission = await storage.getInpatientAdmission(id);
    if (!admission) {
      return res.status(404).json({ message: "Admission not found" });
    }
    res.json(admission);
  });

  app.post("/api/inpatient/admissions", async (req, res) => {
    try {
      const admissionData = insertInpatientAdmissionSchema.parse(req.body);
      const admission = await storage.createInpatientAdmission(admissionData);
      res.status(201).json(admission);
    } catch (error) {
      res.status(400).json({ message: "Invalid admission data", error });
    }
  });

  app.put("/api/inpatient/admissions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid admission ID" });
    }
    try {
      const admissionData = insertInpatientAdmissionSchema.partial().parse(req.body);
      const admission = await storage.updateInpatientAdmission(id, admissionData);
      res.json(admission);
    } catch (error) {
      res.status(400).json({ message: "Invalid admission data", error });
    }
  });

  // Billing routes
  app.get("/api/billings", async (req, res) => {
    const { patientId, pending } = req.query;
    
    if (pending === "true") {
      const billings = await storage.getPendingBillings();
      return res.json(billings);
    }
    
    if (patientId && typeof patientId === "string") {
      const id = parseInt(patientId);
      if (!isNaN(id)) {
        const billings = await storage.getPatientBillings(id);
        return res.json(billings);
      }
    }
    
    // We don't want to return all billings for security reasons
    return res.status(400).json({ message: "Patient ID is required or specify pending=true" });
  });

  app.get("/api/billings/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid billing ID" });
    }
    const billing = await storage.getBilling(id);
    if (!billing) {
      return res.status(404).json({ message: "Billing not found" });
    }
    
    // Get billing items
    const items = await storage.getBillingItems(id);
    
    res.json({
      ...billing,
      items,
    });
  });

  app.post("/api/billings", async (req, res) => {
    try {
      const { billing, items } = req.body;
      
      const billingData = insertBillingSchema.parse(billing);
      const createdBilling = await storage.createBilling(billingData);
      
      const createdItems = [];
      
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const itemData = insertBillingItemSchema.parse({
            ...item,
            billingId: createdBilling.id,
          });
          
          const createdItem = await storage.createBillingItem(itemData);
          createdItems.push(createdItem);
        }
      }
      
      res.status(201).json({
        ...createdBilling,
        items: createdItems,
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid billing data", error });
    }
  });

  app.put("/api/billings/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid billing ID" });
    }
    try {
      const billingData = insertBillingSchema.partial().parse(req.body);
      const billing = await storage.updateBilling(id, billingData);
      res.json(billing);
    } catch (error) {
      res.status(400).json({ message: "Invalid billing data", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
