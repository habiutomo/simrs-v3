import { pgTable, text, serial, integer, boolean, timestamp, json, date, uuid, time, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  email: text("email"),
  phone: text("phone"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  email: true,
  phone: true,
});

// Patient schema
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  medicalRecordNumber: text("medical_record_number").notNull().unique(),
  name: text("name").notNull(),
  gender: text("gender").notNull(),
  birthDate: date("birth_date").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  identityNumber: text("identity_number"),
  insuranceNumber: text("insurance_number"),
  insuranceProvider: text("insurance_provider"),
  bloodType: text("blood_type"),
  rhesus: text("rhesus"),
  allergies: text("allergies"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

// Department/Poly schema
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  description: text("description"),
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
});

// Doctor schema
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  departmentId: integer("department_id").notNull(),
  email: text("email"),
  phone: text("phone"),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
});

// Doctor schedule schema
export const doctorSchedules = pgTable("doctor_schedules", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").notNull(),
  departmentId: integer("department_id").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  maxPatients: integer("max_patients").notNull(),
});

export const insertDoctorScheduleSchema = createInsertSchema(doctorSchedules).omit({
  id: true,
});

// Appointment schema
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  departmentId: integer("department_id").notNull(),
  appointmentDate: date("appointment_date").notNull(),
  appointmentTime: time("appointment_time").notNull(),
  status: text("status").notNull(), // 'confirmed', 'pending', 'cancelled', 'completed'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

// Medical record schema
export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  departmentId: integer("department_id").notNull(),
  visitDate: date("visit_date").notNull(),
  visitType: text("visit_type").notNull(), // 'outpatient', 'inpatient', 'emergency'
  chiefComplaint: text("chief_complaint"),
  diagnosis: text("diagnosis"),
  secondaryDiagnosis: text("secondary_diagnosis"),
  clinicalNotes: text("clinical_notes"),
  treatment: text("treatment"),
  vitalSigns: json("vital_signs"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  createdAt: true,
});

// Prescription schema
export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  medicalRecordId: integer("medical_record_id").notNull(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  prescriptionDate: date("prescription_date").notNull(),
  status: text("status").notNull(), // 'pending', 'processing', 'completed', 'cancelled'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({
  id: true,
  createdAt: true,
});

// Prescription items schema
export const prescriptionItems = pgTable("prescription_items", {
  id: serial("id").primaryKey(),
  prescriptionId: integer("prescription_id").notNull(),
  medicationId: integer("medication_id").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  duration: text("duration").notNull(),
  instructions: text("instructions"),
  quantity: integer("quantity").notNull(),
});

export const insertPrescriptionItemSchema = createInsertSchema(prescriptionItems).omit({
  id: true,
});

// Medication/Drug schema
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  category: text("category").notNull(),
  unit: text("unit").notNull(),
  stock: integer("stock").notNull().default(0),
  minStock: integer("min_stock").notNull().default(0),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
});

// Lab test schema
export const labTests = pgTable("lab_tests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const insertLabTestSchema = createInsertSchema(labTests).omit({
  id: true,
});

// Lab request schema
export const labRequests = pgTable("lab_requests", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  medicalRecordId: integer("medical_record_id").notNull(),
  requestDate: date("request_date").notNull(),
  status: text("status").notNull(), // 'pending', 'processing', 'completed', 'cancelled'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLabRequestSchema = createInsertSchema(labRequests).omit({
  id: true,
  createdAt: true,
});

// Lab request items schema
export const labRequestItems = pgTable("lab_request_items", {
  id: serial("id").primaryKey(),
  labRequestId: integer("lab_request_id").notNull(),
  labTestId: integer("lab_test_id").notNull(),
  notes: text("notes"),
});

export const insertLabRequestItemSchema = createInsertSchema(labRequestItems).omit({
  id: true,
});

// Lab results schema
export const labResults = pgTable("lab_results", {
  id: serial("id").primaryKey(),
  labRequestId: integer("lab_request_id").notNull(),
  labTestId: integer("lab_test_id").notNull(),
  result: text("result").notNull(),
  referenceRange: text("reference_range"),
  unit: text("unit"),
  flag: text("flag"), // 'normal', 'high', 'low', etc.
  performedById: integer("performed_by_id").notNull(),
  performedDate: date("performed_date").notNull(),
  verified: boolean("verified").default(false),
  verifiedById: integer("verified_by_id"),
  verifiedDate: date("verified_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLabResultSchema = createInsertSchema(labResults).omit({
  id: true,
  createdAt: true,
});

// Room/Bed schema for inpatient
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  roomNumber: text("room_number").notNull().unique(),
  wardName: text("ward_name").notNull(),
  roomType: text("room_type").notNull(), // 'regular', 'vip', 'icu', etc.
  bedCount: integer("bed_count").notNull(),
  costPerDay: decimal("cost_per_day", { precision: 10, scale: 2 }).notNull(),
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
});

// Bed schema
export const beds = pgTable("beds", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  bedNumber: text("bed_number").notNull(),
  status: text("status").notNull(), // 'available', 'occupied', 'maintenance'
});

export const insertBedSchema = createInsertSchema(beds).omit({
  id: true,
});

// Inpatient admission schema
export const inpatientAdmissions = pgTable("inpatient_admissions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  bedId: integer("bed_id").notNull(),
  admissionDate: date("admission_date").notNull(),
  admissionTime: time("admission_time").notNull(),
  dischargeDate: date("discharge_date"),
  dischargeTime: time("discharge_time"),
  status: text("status").notNull(), // 'active', 'discharged', 'transferred'
  diagnosis: text("diagnosis").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInpatientAdmissionSchema = createInsertSchema(inpatientAdmissions).omit({
  id: true,
  createdAt: true,
});

// Billing schema
export const billings = pgTable("billings", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  billDate: date("bill_date").notNull(),
  billType: text("bill_type").notNull(), // 'outpatient', 'inpatient', 'pharmacy', 'laboratory'
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  paymentMethod: text("payment_method"), // 'cash', 'card', 'insurance'
  insuranceProvider: text("insurance_provider"),
  insuranceCoverageAmount: decimal("insurance_coverage_amount", { precision: 10, scale: 2 }),
  status: text("status").notNull(), // 'pending', 'paid', 'partial'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBillingSchema = createInsertSchema(billings).omit({
  id: true,
  createdAt: true,
});

// Billing items schema
export const billingItems = pgTable("billing_items", {
  id: serial("id").primaryKey(),
  billingId: integer("billing_id").notNull(),
  itemType: text("item_type").notNull(), // 'consultation', 'medication', 'lab', 'room', 'procedure'
  itemId: integer("item_id").notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

export const insertBillingItemSchema = createInsertSchema(billingItems).omit({
  id: true,
});

// Insurance Provider schema
export const insuranceProviders = pgTable("insurance_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(), // 'government', 'private'
  contact: text("contact"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  apiEndpoint: text("api_endpoint"),
  status: text("status").notNull().default("active"), // 'active', 'inactive', 'pending'
  lastSyncDate: date("last_sync_date"),
});

export const insertInsuranceProviderSchema = createInsertSchema(insuranceProviders).omit({
  id: true,
});

// Patient Insurance schema
export const patientInsurances = pgTable("patient_insurances", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  insuranceProviderId: integer("insurance_provider_id").notNull(),
  memberNumber: text("member_number").notNull(),
  policyNumber: text("policy_number"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  coverageType: text("coverage_type"), // 'basic', 'premium', 'comprehensive', etc.
  coverageLimit: decimal("coverage_limit", { precision: 12, scale: 2 }),
  status: text("status").notNull().default("active"), // 'active', 'inactive', 'expired'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPatientInsuranceSchema = createInsertSchema(patientInsurances).omit({
  id: true,
  createdAt: true,
});

// Types export
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;

export type DoctorSchedule = typeof doctorSchedules.$inferSelect;
export type InsertDoctorSchedule = z.infer<typeof insertDoctorScheduleSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;

export type Prescription = typeof prescriptions.$inferSelect;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;

export type PrescriptionItem = typeof prescriptionItems.$inferSelect;
export type InsertPrescriptionItem = z.infer<typeof insertPrescriptionItemSchema>;

export type Medication = typeof medications.$inferSelect;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;

export type LabTest = typeof labTests.$inferSelect;
export type InsertLabTest = z.infer<typeof insertLabTestSchema>;

export type LabRequest = typeof labRequests.$inferSelect;
export type InsertLabRequest = z.infer<typeof insertLabRequestSchema>;

export type LabRequestItem = typeof labRequestItems.$inferSelect;
export type InsertLabRequestItem = z.infer<typeof insertLabRequestItemSchema>;

export type LabResult = typeof labResults.$inferSelect;
export type InsertLabResult = z.infer<typeof insertLabResultSchema>;

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type Bed = typeof beds.$inferSelect;
export type InsertBed = z.infer<typeof insertBedSchema>;

export type InpatientAdmission = typeof inpatientAdmissions.$inferSelect;
export type InsertInpatientAdmission = z.infer<typeof insertInpatientAdmissionSchema>;

export type Billing = typeof billings.$inferSelect;
export type InsertBilling = z.infer<typeof insertBillingSchema>;

export type BillingItem = typeof billingItems.$inferSelect;
export type InsertBillingItem = z.infer<typeof insertBillingItemSchema>;

export type InsuranceProvider = typeof insuranceProviders.$inferSelect;
export type InsertInsuranceProvider = z.infer<typeof insertInsuranceProviderSchema>;

export type PatientInsurance = typeof patientInsurances.$inferSelect;
export type InsertPatientInsurance = z.infer<typeof insertPatientInsuranceSchema>;
