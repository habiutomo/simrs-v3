import {
  users, User, InsertUser,
  patients, Patient, InsertPatient,
  departments, Department, InsertDepartment,
  doctors, Doctor, InsertDoctor,
  doctorSchedules, DoctorSchedule, InsertDoctorSchedule,
  appointments, Appointment, InsertAppointment,
  medicalRecords, MedicalRecord, InsertMedicalRecord,
  prescriptions, Prescription, InsertPrescription,
  prescriptionItems, PrescriptionItem, InsertPrescriptionItem,
  medications, Medication, InsertMedication,
  labTests, LabTest, InsertLabTest,
  labRequests, LabRequest, InsertLabRequest,
  labRequestItems, LabRequestItem, InsertLabRequestItem,
  labResults, LabResult, InsertLabResult,
  rooms, Room, InsertRoom,
  beds, Bed, InsertBed,
  inpatientAdmissions, InpatientAdmission, InsertInpatientAdmission,
  billings, Billing, InsertBilling,
  billingItems, BillingItem, InsertBillingItem,
  insuranceProviders, InsuranceProvider, InsertInsuranceProvider,
  patientInsurances, PatientInsurance, InsertPatientInsurance
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;

  // Patient operations
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByMRN(mrn: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient>;
  getPatients(): Promise<Patient[]>;
  searchPatients(query: string): Promise<Patient[]>;

  // Department operations
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  getDepartments(): Promise<Department[]>;

  // Doctor operations
  getDoctor(id: number): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  getDoctors(): Promise<Doctor[]>;
  getDoctorsByDepartment(departmentId: number): Promise<Doctor[]>;

  // Doctor Schedule operations
  getDoctorSchedule(id: number): Promise<DoctorSchedule | undefined>;
  createDoctorSchedule(schedule: InsertDoctorSchedule): Promise<DoctorSchedule>;
  getDoctorSchedules(doctorId: number): Promise<DoctorSchedule[]>;
  getDepartmentSchedules(departmentId: number): Promise<DoctorSchedule[]>;

  // Appointment operations
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  getAppointments(): Promise<Appointment[]>;
  getPatientAppointments(patientId: number): Promise<Appointment[]>;
  getDoctorAppointments(doctorId: number): Promise<Appointment[]>;
  getDepartmentAppointments(departmentId: number): Promise<Appointment[]>;
  getTodayAppointments(): Promise<Appointment[]>;
  getUpcomingAppointments(): Promise<Appointment[]>;

  // Medical Record operations
  getMedicalRecord(id: number): Promise<MedicalRecord | undefined>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  updateMedicalRecord(id: number, record: Partial<InsertMedicalRecord>): Promise<MedicalRecord>;
  getPatientMedicalRecords(patientId: number): Promise<MedicalRecord[]>;

  // Prescription operations
  getPrescription(id: number): Promise<Prescription | undefined>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  updatePrescription(id: number, prescription: Partial<InsertPrescription>): Promise<Prescription>;
  getPatientPrescriptions(patientId: number): Promise<Prescription[]>;
  
  // Prescription Item operations
  getPrescriptionItem(id: number): Promise<PrescriptionItem | undefined>;
  createPrescriptionItem(item: InsertPrescriptionItem): Promise<PrescriptionItem>;
  getPrescriptionItems(prescriptionId: number): Promise<PrescriptionItem[]>;

  // Medication operations
  getMedication(id: number): Promise<Medication | undefined>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  updateMedication(id: number, medication: Partial<InsertMedication>): Promise<Medication>;
  getMedications(): Promise<Medication[]>;
  getMedicationsByCategory(category: string): Promise<Medication[]>;
  getLowStockMedications(): Promise<Medication[]>;

  // Lab Test operations
  getLabTest(id: number): Promise<LabTest | undefined>;
  createLabTest(test: InsertLabTest): Promise<LabTest>;
  getLabTests(): Promise<LabTest[]>;

  // Lab Request operations
  getLabRequest(id: number): Promise<LabRequest | undefined>;
  createLabRequest(request: InsertLabRequest): Promise<LabRequest>;
  updateLabRequest(id: number, request: Partial<InsertLabRequest>): Promise<LabRequest>;
  getPatientLabRequests(patientId: number): Promise<LabRequest[]>;

  // Lab Request Item operations
  getLabRequestItem(id: number): Promise<LabRequestItem | undefined>;
  createLabRequestItem(item: InsertLabRequestItem): Promise<LabRequestItem>;
  getLabRequestItems(requestId: number): Promise<LabRequestItem[]>;

  // Lab Result operations
  getLabResult(id: number): Promise<LabResult | undefined>;
  createLabResult(result: InsertLabResult): Promise<LabResult>;
  updateLabResult(id: number, result: Partial<InsertLabResult>): Promise<LabResult>;
  getLabRequestResults(requestId: number): Promise<LabResult[]>;

  // Room operations
  getRoom(id: number): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  getRooms(): Promise<Room[]>;
  getRoomsByType(type: string): Promise<Room[]>;

  // Bed operations
  getBed(id: number): Promise<Bed | undefined>;
  createBed(bed: InsertBed): Promise<Bed>;
  updateBed(id: number, bed: Partial<InsertBed>): Promise<Bed>;
  getRoomBeds(roomId: number): Promise<Bed[]>;
  getAllBeds(): Promise<Bed[]>;
  getAvailableBeds(): Promise<Bed[]>;
  getOccupiedBeds(): Promise<Bed[]>;

  // Inpatient Admission operations
  getInpatientAdmission(id: number): Promise<InpatientAdmission | undefined>;
  createInpatientAdmission(admission: InsertInpatientAdmission): Promise<InpatientAdmission>;
  updateInpatientAdmission(id: number, admission: Partial<InsertInpatientAdmission>): Promise<InpatientAdmission>;
  getPatientAdmissions(patientId: number): Promise<InpatientAdmission[]>;
  getActiveAdmissions(): Promise<InpatientAdmission[]>;

  // Billing operations
  getBilling(id: number): Promise<Billing | undefined>;
  createBilling(billing: InsertBilling): Promise<Billing>;
  updateBilling(id: number, billing: Partial<InsertBilling>): Promise<Billing>;
  getPatientBillings(patientId: number): Promise<Billing[]>;
  getPendingBillings(): Promise<Billing[]>;

  // Billing Item operations
  getBillingItem(id: number): Promise<BillingItem | undefined>;
  createBillingItem(item: InsertBillingItem): Promise<BillingItem>;
  getBillingItems(billingId: number): Promise<BillingItem[]>;

  // Insurance Provider operations
  getInsuranceProvider(id: number): Promise<InsuranceProvider | undefined>;
  getInsuranceProviderByCode(code: string): Promise<InsuranceProvider | undefined>;
  createInsuranceProvider(provider: InsertInsuranceProvider): Promise<InsuranceProvider>;
  updateInsuranceProvider(id: number, provider: Partial<InsertInsuranceProvider>): Promise<InsuranceProvider>;
  getInsuranceProviders(): Promise<InsuranceProvider[]>;
  getActiveInsuranceProviders(): Promise<InsuranceProvider[]>;

  // Patient Insurance operations
  getPatientInsurance(id: number): Promise<PatientInsurance | undefined>;
  createPatientInsurance(insurance: InsertPatientInsurance): Promise<PatientInsurance>;
  updatePatientInsurance(id: number, insurance: Partial<InsertPatientInsurance>): Promise<PatientInsurance>;
  getPatientInsurances(patientId: number): Promise<PatientInsurance[]>;
  getActivePatientInsurances(patientId: number): Promise<PatientInsurance[]>;

  // Dashboard data
  getDashboardStats(): Promise<{
    totalPatients: number;
    outpatientToday: number;
    inpatientActive: number;
    monthlyRevenue: number;
  }>;
  getRecentActivities(): Promise<any[]>;
  getUpcomingAppointmentsList(): Promise<any[]>;
  getHospitalCapacity(): Promise<{
    bedCapacity: { total: number; occupied: number };
    icuCapacity: { total: number; occupied: number };
    outpatientCapacity: { total: number; occupied: number };
    emergencyCapacity: { total: number; occupied: number };
  }>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private patients: Map<number, Patient>;
  private departments: Map<number, Department>;
  private doctors: Map<number, Doctor>;
  private doctorSchedules: Map<number, DoctorSchedule>;
  private appointments: Map<number, Appointment>;
  private medicalRecords: Map<number, MedicalRecord>;
  private prescriptions: Map<number, Prescription>;
  private prescriptionItems: Map<number, PrescriptionItem>;
  private medications: Map<number, Medication>;
  private labTests: Map<number, LabTest>;
  private labRequests: Map<number, LabRequest>;
  private labRequestItems: Map<number, LabRequestItem>;
  private labResults: Map<number, LabResult>;
  private rooms: Map<number, Room>;
  private beds: Map<number, Bed>;
  private inpatientAdmissions: Map<number, InpatientAdmission>;
  private billings: Map<number, Billing>;
  private billingItems: Map<number, BillingItem>;
  private insuranceProviders: Map<number, InsuranceProvider>;
  private patientInsurances: Map<number, PatientInsurance>;

  // Auto-incrementing IDs
  private userId: number;
  private patientId: number;
  private departmentId: number;
  private doctorId: number;
  private scheduleId: number;
  private appointmentId: number;
  private medicalRecordId: number;
  private prescriptionId: number;
  private prescriptionItemId: number;
  private medicationId: number;
  private labTestId: number;
  private labRequestId: number;
  private labRequestItemId: number;
  private labResultId: number;
  private roomId: number;
  private bedId: number;
  private admissionId: number;
  private billingId: number;
  private billingItemId: number;
  private insuranceProviderId: number;
  private patientInsuranceId: number;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.departments = new Map();
    this.doctors = new Map();
    this.doctorSchedules = new Map();
    this.appointments = new Map();
    this.medicalRecords = new Map();
    this.prescriptions = new Map();
    this.prescriptionItems = new Map();
    this.medications = new Map();
    this.labTests = new Map();
    this.labRequests = new Map();
    this.labRequestItems = new Map();
    this.labResults = new Map();
    this.rooms = new Map();
    this.beds = new Map();
    this.inpatientAdmissions = new Map();
    this.billings = new Map();
    this.billingItems = new Map();
    this.insuranceProviders = new Map();
    this.patientInsurances = new Map();

    this.userId = 1;
    this.patientId = 1;
    this.departmentId = 1;
    this.doctorId = 1;
    this.scheduleId = 1;
    this.appointmentId = 1;
    this.medicalRecordId = 1;
    this.prescriptionId = 1;
    this.prescriptionItemId = 1;
    this.medicationId = 1;
    this.labTestId = 1;
    this.labRequestId = 1;
    this.labRequestItemId = 1;
    this.labResultId = 1;
    this.roomId = 1;
    this.bedId = 1;
    this.admissionId = 1;
    this.billingId = 1;
    this.billingItemId = 1;
    this.insuranceProviderId = 1;
    this.patientInsuranceId = 1;

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create a test admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      name: "Admin User",
      role: "admin",
      email: "admin@hospital.com",
      phone: "123-456-7890"
    });
    
    // Create sample insurance providers
    const insuranceProviderIds = {
      bpjs: this.createInsuranceProvider({
        name: "BPJS Kesehatan",
        code: "BPJS",
        type: "government",
        contact: "Pusat Layanan Informasi BPJS",
        email: "info@bpjs-kesehatan.go.id",
        phone: "1500400",
        address: "Jl. Gatot Subroto No.80, Jakarta",
        apiEndpoint: "https://api.bpjs-kesehatan.go.id/v2",
        status: "active",
        lastSyncDate: new Date()
      }).id,
      prudential: this.createInsuranceProvider({
        name: "Prudential Indonesia",
        code: "PRUD",
        type: "private",
        contact: "Customer Service Prudential",
        email: "customer.service@prudential.co.id",
        phone: "1500085",
        address: "Prudential Tower, Jl. Jend. Sudirman Kav. 79, Jakarta",
        apiEndpoint: "https://api.prudential.co.id/partner",
        status: "active",
        lastSyncDate: new Date()
      }).id,
      allianz: this.createInsuranceProvider({
        name: "Allianz Indonesia",
        code: "ALIZ",
        type: "private",
        contact: "Allianz Care",
        email: "contact.center@allianz.co.id",
        phone: "1500136",
        address: "Allianz Tower, Jl. HR Rasuna Said, Jakarta",
        apiEndpoint: "https://api.allianz.co.id/v1",
        status: "inactive",
        lastSyncDate: null
      }).id,
      mandiri: this.createInsuranceProvider({
        name: "AXA Mandiri",
        code: "AXAM",
        type: "private",
        contact: "AXA Mandiri Contact Center",
        email: "customer.service@axa-mandiri.co.id",
        phone: "1500803",
        address: "AXA Tower, Jl. Prof. Dr. Satrio Kav. 18, Jakarta",
        apiEndpoint: "https://api.axa-mandiri.co.id/services",
        status: "active",
        lastSyncDate: new Date()
      }).id,
      inhealth: this.createInsuranceProvider({
        name: "Mandiri Inhealth",
        code: "MINH",
        type: "private",
        contact: "Mandiri Inhealth Contact Center",
        email: "customer.service@mandiriinhealth.co.id",
        phone: "1500822",
        address: "Menara Palma, Jl. HR Rasuna Said Blok X2 Kav. 6, Jakarta",
        apiEndpoint: "https://api.mandiriinhealth.co.id/rest",
        status: "pending",
        lastSyncDate: null
      }).id
    };

    // Create sample departments
    const departmentIds = {
      general: this.createDepartment({ name: "Poli Umum", code: "UMUM", description: "General Outpatient Department" }).id,
      cardiology: this.createDepartment({ name: "Poli Jantung", code: "JNTG", description: "Cardiology Department" }).id,
      pediatric: this.createDepartment({ name: "Poli Anak", code: "ANAK", description: "Pediatric Department" }).id,
      dental: this.createDepartment({ name: "Poli Gigi", code: "GIGI", description: "Dental Department" }).id,
    };

    // Create sample doctors
    const doctorIds = {
      general: this.createDoctor({
        name: "Dr. Suparman",
        specialization: "General Practice",
        licenseNumber: "GP123456",
        departmentId: departmentIds.general,
        email: "suparman@hospital.com",
        phone: "123-456-7891"
      }).id,
      cardio: this.createDoctor({
        name: "Dr. Pratiwi",
        specialization: "Cardiology",
        licenseNumber: "CD123456",
        departmentId: departmentIds.cardiology,
        email: "pratiwi@hospital.com",
        phone: "123-456-7892"
      }).id,
      pediatric: this.createDoctor({
        name: "Dr. Widya",
        specialization: "Pediatrics",
        licenseNumber: "PD123456",
        departmentId: departmentIds.pediatric,
        email: "widya@hospital.com",
        phone: "123-456-7893"
      }).id,
      dental: this.createDoctor({
        name: "Dr. Hartono",
        specialization: "Dentistry",
        licenseNumber: "DT123456",
        departmentId: departmentIds.dental,
        email: "hartono@hospital.com",
        phone: "123-456-7894"
      }).id
    };

    // Create doctor schedules
    Object.entries(doctorIds).forEach(([type, doctorId], index) => {
      const departmentId = Object.values(departmentIds)[index];
      
      // Morning schedule (Monday, Wednesday, Friday)
      this.createDoctorSchedule({
        doctorId,
        departmentId,
        dayOfWeek: 1, // Monday
        startTime: "08:00:00",
        endTime: "12:00:00",
        maxPatients: 20
      });
      
      this.createDoctorSchedule({
        doctorId,
        departmentId,
        dayOfWeek: 3, // Wednesday
        startTime: "08:00:00",
        endTime: "12:00:00",
        maxPatients: 20
      });
      
      this.createDoctorSchedule({
        doctorId,
        departmentId,
        dayOfWeek: 5, // Friday
        startTime: "08:00:00",
        endTime: "12:00:00",
        maxPatients: 20
      });
      
      // Afternoon schedule (Tuesday, Thursday)
      this.createDoctorSchedule({
        doctorId,
        departmentId,
        dayOfWeek: 2, // Tuesday
        startTime: "13:00:00",
        endTime: "17:00:00",
        maxPatients: 15
      });
      
      this.createDoctorSchedule({
        doctorId,
        departmentId,
        dayOfWeek: 4, // Thursday
        startTime: "13:00:00",
        endTime: "17:00:00",
        maxPatients: 15
      });
    });

    // Create sample patients
    const patientIds = {
      patient1: this.createPatient({
        medicalRecordNumber: "MRN00001",
        name: "Siti Nurhaliza",
        gender: "female",
        birthDate: new Date("1990-05-15"),
        address: "Jl. Merdeka No. 123, Jakarta",
        phone: "081234567890",
        email: "siti@email.com",
        identityNumber: "1234567890123456",
        insuranceNumber: "BPJS123456789",
        insuranceProvider: "BPJS",
        bloodType: "O",
        rhesus: "positive",
        allergies: "None"
      }).id,
      patient2: this.createPatient({
        medicalRecordNumber: "MRN00002",
        name: "Budi Santoso",
        gender: "male",
        birthDate: new Date("1985-08-21"),
        address: "Jl. Pahlawan No. 45, Surabaya",
        phone: "081234567891",
        email: "budi@email.com",
        identityNumber: "1234567890123457",
        insuranceNumber: null,
        insuranceProvider: null,
        bloodType: "A",
        rhesus: "positive",
        allergies: "Penicillin"
      }).id,
      patient3: this.createPatient({
        medicalRecordNumber: "MRN00003",
        name: "Sri Mulyani",
        gender: "female",
        birthDate: new Date("1975-10-30"),
        address: "Jl. Sudirman No. 78, Bandung",
        phone: "081234567892",
        email: "sri@email.com",
        identityNumber: "1234567890123458",
        insuranceNumber: "INS987654321",
        insuranceProvider: "Prudential",
        bloodType: "B",
        rhesus: "negative",
        allergies: "Sulfa, Dairy"
      }).id,
      patient4: this.createPatient({
        medicalRecordNumber: "MRN00004",
        name: "Ahmad Dhani",
        gender: "male",
        birthDate: new Date("1980-12-05"),
        address: "Jl. Gatot Subroto No. 12, Semarang",
        phone: "081234567893",
        email: "ahmad@email.com",
        identityNumber: "1234567890123459",
        insuranceNumber: "BPJS987654321",
        insuranceProvider: "BPJS",
        bloodType: "AB",
        rhesus: "positive",
        allergies: "None"
      }).id,
      patient5: this.createPatient({
        medicalRecordNumber: "MRN00005",
        name: "Dewi Fortuna",
        gender: "female",
        birthDate: new Date("1995-03-25"),
        address: "Jl. Diponegoro No. 56, Yogyakarta",
        phone: "081234567894",
        email: "dewi@email.com",
        identityNumber: "1234567890123460",
        insuranceNumber: null,
        insuranceProvider: null,
        bloodType: "O",
        rhesus: "positive",
        allergies: "Shellfish"
      }).id
    };
    
    // Create sample patient insurances
    this.createPatientInsurance({
      patientId: patientIds.patient1,
      insuranceProviderId: insuranceProviderIds.bpjs,
      memberNumber: "BPJS123456789",
      cardNumber: "0001234567890",
      policyNumber: null,
      startDate: new Date("2019-01-01"),
      endDate: new Date("2030-12-31"),
      coverageType: "Full",
      coverageLimit: null,
      status: "active",
      verificationStatus: "verified",
      verificationDate: new Date(),
      notes: "Covered by national health insurance"
    });
    
    this.createPatientInsurance({
      patientId: patientIds.patient3,
      insuranceProviderId: insuranceProviderIds.prudential,
      memberNumber: "INS987654321",
      cardNumber: "PRUD98765432",
      policyNumber: "POL-123456",
      startDate: new Date("2020-05-15"),
      endDate: new Date("2025-05-14"),
      coverageType: "Premium",
      coverageLimit: "500000000",
      status: "active",
      verificationStatus: "verified",
      verificationDate: new Date(),
      notes: "Premium health insurance with international coverage"
    });
    
    this.createPatientInsurance({
      patientId: patientIds.patient4,
      insuranceProviderId: insuranceProviderIds.bpjs,
      memberNumber: "BPJS987654321",
      cardNumber: "0009876543210",
      policyNumber: null,
      startDate: new Date("2018-03-10"),
      endDate: new Date("2030-12-31"),
      coverageType: "Full",
      coverageLimit: null,
      status: "active",
      verificationStatus: "verified",
      verificationDate: new Date(),
      notes: "Covered by national health insurance"
    });

    // Create sample medications
    const medicationIds = {
      paracetamol: this.createMedication({
        name: "Paracetamol",
        code: "PARA500",
        category: "Analgesic",
        unit: "Tablet",
        stock: 1000,
        minStock: 100,
        price: "5000"
      }).id,
      amoxicillin: this.createMedication({
        name: "Amoxicillin",
        code: "AMOX500",
        category: "Antibiotic",
        unit: "Capsule",
        stock: 500,
        minStock: 50,
        price: "15000"
      }).id,
      omeprazole: this.createMedication({
        name: "Omeprazole",
        code: "OMEP20",
        category: "Antacid",
        unit: "Capsule",
        stock: 300,
        minStock: 30,
        price: "10000"
      }).id,
      amlodipine: this.createMedication({
        name: "Amlodipine",
        code: "AMLO5",
        category: "Antihypertensive",
        unit: "Tablet",
        stock: 200,
        minStock: 20,
        price: "20000"
      }).id
    };

    // Create sample lab tests
    const labTestIds = {
      cbc: this.createLabTest({
        name: "Complete Blood Count",
        code: "CBC",
        description: "Measures different components of blood",
        price: "150000"
      }).id,
      glucose: this.createLabTest({
        name: "Blood Glucose",
        code: "GLU",
        description: "Measures blood sugar level",
        price: "100000"
      }).id,
      lipid: this.createLabTest({
        name: "Lipid Profile",
        code: "LIPID",
        description: "Measures cholesterol levels",
        price: "200000"
      }).id,
      liver: this.createLabTest({
        name: "Liver Function Test",
        code: "LFT",
        description: "Assesses liver function",
        price: "250000"
      }).id
    };

    // Create sample rooms
    const roomIds = {
      general1: this.createRoom({
        roomNumber: "R101",
        wardName: "General Ward",
        roomType: "regular",
        bedCount: 4,
        costPerDay: "500000"
      }).id,
      general2: this.createRoom({
        roomNumber: "R102",
        wardName: "General Ward",
        roomType: "regular",
        bedCount: 4,
        costPerDay: "500000"
      }).id,
      vip1: this.createRoom({
        roomNumber: "V201",
        wardName: "VIP Ward",
        roomType: "vip",
        bedCount: 1,
        costPerDay: "1500000"
      }).id,
      icu1: this.createRoom({
        roomNumber: "ICU01",
        wardName: "Intensive Care Unit",
        roomType: "icu",
        bedCount: 1,
        costPerDay: "3000000"
      }).id
    };

    // Create beds for each room
    Object.entries(roomIds).forEach(([roomType, roomId]) => {
      const room = this.getRoom(roomId)!;
      
      for (let i = 1; i <= room.bedCount; i++) {
        this.createBed({
          roomId,
          bedNumber: `${room.roomNumber}-${i}`,
          status: "available"
        });
      }
    });

    // Create today's date
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Create tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    // Create sample appointments
    this.createAppointment({
      patientId: patientIds.patient3,
      doctorId: doctorIds.general,
      departmentId: departmentIds.general,
      appointmentDate: new Date(todayStr),
      appointmentTime: "14:30:00",
      status: "confirmed",
      notes: "Regular check-up"
    });

    this.createAppointment({
      patientId: patientIds.patient1,
      doctorId: doctorIds.cardio,
      departmentId: departmentIds.cardiology,
      appointmentDate: new Date(todayStr),
      appointmentTime: "15:00:00",
      status: "pending",
      notes: "Chest pain evaluation"
    });

    this.createAppointment({
      patientId: patientIds.patient4,
      doctorId: doctorIds.dental,
      departmentId: departmentIds.dental,
      appointmentDate: new Date(tomorrowStr),
      appointmentTime: "09:00:00",
      status: "confirmed",
      notes: "Dental cleaning"
    });

    this.createAppointment({
      patientId: patientIds.patient5,
      doctorId: doctorIds.pediatric,
      departmentId: departmentIds.pediatric,
      appointmentDate: new Date(tomorrowStr),
      appointmentTime: "10:30:00",
      status: "confirmed",
      notes: "Fever follow-up"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Patient operations
  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientByMRN(mrn: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.medicalRecordNumber === mrn,
    );
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const id = this.patientId++;
    const newPatient: Patient = { 
      ...patient, 
      id, 
      createdAt: new Date() 
    };
    this.patients.set(id, newPatient);
    return newPatient;
  }

  async updatePatient(id: number, data: Partial<InsertPatient>): Promise<Patient> {
    const patient = await this.getPatient(id);
    if (!patient) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    
    const updatedPatient: Patient = { ...patient, ...data };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  async getPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async searchPatients(query: string): Promise<Patient[]> {
    query = query.toLowerCase();
    return Array.from(this.patients.values()).filter(
      (patient) => 
        patient.name.toLowerCase().includes(query) ||
        patient.medicalRecordNumber.toLowerCase().includes(query) ||
        (patient.identityNumber && patient.identityNumber.toLowerCase().includes(query)) ||
        (patient.insuranceNumber && patient.insuranceNumber.toLowerCase().includes(query))
    );
  }

  // Department operations
  async getDepartment(id: number): Promise<Department | undefined> {
    return this.departments.get(id);
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const id = this.departmentId++;
    const newDepartment: Department = { ...department, id };
    this.departments.set(id, newDepartment);
    return newDepartment;
  }

  async getDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  // Doctor operations
  async getDoctor(id: number): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const id = this.doctorId++;
    const newDoctor: Doctor = { ...doctor, id };
    this.doctors.set(id, newDoctor);
    return newDoctor;
  }

  async getDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async getDoctorsByDepartment(departmentId: number): Promise<Doctor[]> {
    return Array.from(this.doctors.values()).filter(
      (doctor) => doctor.departmentId === departmentId
    );
  }

  // Doctor Schedule operations
  async getDoctorSchedule(id: number): Promise<DoctorSchedule | undefined> {
    return this.doctorSchedules.get(id);
  }

  async createDoctorSchedule(schedule: InsertDoctorSchedule): Promise<DoctorSchedule> {
    const id = this.scheduleId++;
    const newSchedule: DoctorSchedule = { ...schedule, id };
    this.doctorSchedules.set(id, newSchedule);
    return newSchedule;
  }

  async getDoctorSchedules(doctorId: number): Promise<DoctorSchedule[]> {
    return Array.from(this.doctorSchedules.values()).filter(
      (schedule) => schedule.doctorId === doctorId
    );
  }

  async getDepartmentSchedules(departmentId: number): Promise<DoctorSchedule[]> {
    return Array.from(this.doctorSchedules.values()).filter(
      (schedule) => schedule.departmentId === departmentId
    );
  }

  // Appointment operations
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentId++;
    const newAppointment: Appointment = { 
      ...appointment, 
      id, 
      createdAt: new Date() 
    };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: number, data: Partial<InsertAppointment>): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    if (!appointment) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    
    const updatedAppointment: Appointment = { ...appointment, ...data };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getPatientAppointments(patientId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.patientId === patientId
    );
  }

  async getDoctorAppointments(doctorId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.doctorId === doctorId
    );
  }

  async getDepartmentAppointments(departmentId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.departmentId === departmentId
    );
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.appointments.values()).filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate.getTime() === today.getTime();
    });
  }

  async getUpcomingAppointments(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.appointments.values())
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() >= today.getTime();
      })
      .sort((a, b) => {
        const dateA = new Date(a.appointmentDate);
        const dateB = new Date(b.appointmentDate);
        return dateA.getTime() - dateB.getTime() || 
               a.appointmentTime.localeCompare(b.appointmentTime);
      });
  }

  // Medical Record operations
  async getMedicalRecord(id: number): Promise<MedicalRecord | undefined> {
    return this.medicalRecords.get(id);
  }

  async createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord> {
    const id = this.medicalRecordId++;
    const newRecord: MedicalRecord = { 
      ...record, 
      id, 
      createdAt: new Date() 
    };
    this.medicalRecords.set(id, newRecord);
    return newRecord;
  }

  async updateMedicalRecord(id: number, data: Partial<InsertMedicalRecord>): Promise<MedicalRecord> {
    const record = await this.getMedicalRecord(id);
    if (!record) {
      throw new Error(`Medical Record with ID ${id} not found`);
    }
    
    const updatedRecord: MedicalRecord = { ...record, ...data };
    this.medicalRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async getPatientMedicalRecords(patientId: number): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values())
      .filter((record) => record.patientId === patientId)
      .sort((a, b) => {
        const dateA = new Date(a.visitDate);
        const dateB = new Date(b.visitDate);
        return dateB.getTime() - dateA.getTime(); // Sort newest first
      });
  }

  // Prescription operations
  async getPrescription(id: number): Promise<Prescription | undefined> {
    return this.prescriptions.get(id);
  }

  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const id = this.prescriptionId++;
    const newPrescription: Prescription = { 
      ...prescription, 
      id, 
      createdAt: new Date() 
    };
    this.prescriptions.set(id, newPrescription);
    return newPrescription;
  }

  async updatePrescription(id: number, data: Partial<InsertPrescription>): Promise<Prescription> {
    const prescription = await this.getPrescription(id);
    if (!prescription) {
      throw new Error(`Prescription with ID ${id} not found`);
    }
    
    const updatedPrescription: Prescription = { ...prescription, ...data };
    this.prescriptions.set(id, updatedPrescription);
    return updatedPrescription;
  }

  async getPatientPrescriptions(patientId: number): Promise<Prescription[]> {
    return Array.from(this.prescriptions.values())
      .filter((prescription) => prescription.patientId === patientId)
      .sort((a, b) => {
        const dateA = new Date(a.prescriptionDate);
        const dateB = new Date(b.prescriptionDate);
        return dateB.getTime() - dateA.getTime(); // Sort newest first
      });
  }

  // Prescription Item operations
  async getPrescriptionItem(id: number): Promise<PrescriptionItem | undefined> {
    return this.prescriptionItems.get(id);
  }

  async createPrescriptionItem(item: InsertPrescriptionItem): Promise<PrescriptionItem> {
    const id = this.prescriptionItemId++;
    const newItem: PrescriptionItem = { ...item, id };
    this.prescriptionItems.set(id, newItem);
    return newItem;
  }

  async getPrescriptionItems(prescriptionId: number): Promise<PrescriptionItem[]> {
    return Array.from(this.prescriptionItems.values()).filter(
      (item) => item.prescriptionId === prescriptionId
    );
  }

  // Medication operations
  async getMedication(id: number): Promise<Medication | undefined> {
    return this.medications.get(id);
  }

  async createMedication(medication: InsertMedication): Promise<Medication> {
    const id = this.medicationId++;
    const newMedication: Medication = { ...medication, id };
    this.medications.set(id, newMedication);
    return newMedication;
  }

  async updateMedication(id: number, data: Partial<InsertMedication>): Promise<Medication> {
    const medication = await this.getMedication(id);
    if (!medication) {
      throw new Error(`Medication with ID ${id} not found`);
    }
    
    const updatedMedication: Medication = { ...medication, ...data };
    this.medications.set(id, updatedMedication);
    return updatedMedication;
  }

  async getMedications(): Promise<Medication[]> {
    return Array.from(this.medications.values());
  }

  async getMedicationsByCategory(category: string): Promise<Medication[]> {
    return Array.from(this.medications.values()).filter(
      (medication) => medication.category === category
    );
  }

  async getLowStockMedications(): Promise<Medication[]> {
    return Array.from(this.medications.values()).filter(
      (medication) => medication.stock <= medication.minStock
    );
  }

  // Lab Test operations
  async getLabTest(id: number): Promise<LabTest | undefined> {
    return this.labTests.get(id);
  }

  async createLabTest(test: InsertLabTest): Promise<LabTest> {
    const id = this.labTestId++;
    const newTest: LabTest = { ...test, id };
    this.labTests.set(id, newTest);
    return newTest;
  }

  async getLabTests(): Promise<LabTest[]> {
    return Array.from(this.labTests.values());
  }

  // Lab Request operations
  async getLabRequest(id: number): Promise<LabRequest | undefined> {
    return this.labRequests.get(id);
  }

  async createLabRequest(request: InsertLabRequest): Promise<LabRequest> {
    const id = this.labRequestId++;
    const newRequest: LabRequest = { 
      ...request, 
      id, 
      createdAt: new Date() 
    };
    this.labRequests.set(id, newRequest);
    return newRequest;
  }

  async updateLabRequest(id: number, data: Partial<InsertLabRequest>): Promise<LabRequest> {
    const request = await this.getLabRequest(id);
    if (!request) {
      throw new Error(`Lab Request with ID ${id} not found`);
    }
    
    const updatedRequest: LabRequest = { ...request, ...data };
    this.labRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async getPatientLabRequests(patientId: number): Promise<LabRequest[]> {
    return Array.from(this.labRequests.values())
      .filter((request) => request.patientId === patientId)
      .sort((a, b) => {
        const dateA = new Date(a.requestDate);
        const dateB = new Date(b.requestDate);
        return dateB.getTime() - dateA.getTime(); // Sort newest first
      });
  }

  // Lab Request Item operations
  async getLabRequestItem(id: number): Promise<LabRequestItem | undefined> {
    return this.labRequestItems.get(id);
  }

  async createLabRequestItem(item: InsertLabRequestItem): Promise<LabRequestItem> {
    const id = this.labRequestItemId++;
    const newItem: LabRequestItem = { ...item, id };
    this.labRequestItems.set(id, newItem);
    return newItem;
  }

  async getLabRequestItems(requestId: number): Promise<LabRequestItem[]> {
    return Array.from(this.labRequestItems.values()).filter(
      (item) => item.labRequestId === requestId
    );
  }

  // Lab Result operations
  async getLabResult(id: number): Promise<LabResult | undefined> {
    return this.labResults.get(id);
  }

  async createLabResult(result: InsertLabResult): Promise<LabResult> {
    const id = this.labResultId++;
    const newResult: LabResult = { 
      ...result, 
      id, 
      createdAt: new Date() 
    };
    this.labResults.set(id, newResult);
    return newResult;
  }

  async updateLabResult(id: number, data: Partial<InsertLabResult>): Promise<LabResult> {
    const result = await this.getLabResult(id);
    if (!result) {
      throw new Error(`Lab Result with ID ${id} not found`);
    }
    
    const updatedResult: LabResult = { ...result, ...data };
    this.labResults.set(id, updatedResult);
    return updatedResult;
  }

  async getLabRequestResults(requestId: number): Promise<LabResult[]> {
    return Array.from(this.labResults.values()).filter(
      (result) => result.labRequestId === requestId
    );
  }

  // Room operations
  async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async createRoom(room: InsertRoom): Promise<Room> {
    const id = this.roomId++;
    const newRoom: Room = { ...room, id };
    this.rooms.set(id, newRoom);
    return newRoom;
  }

  async getRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async getRoomsByType(type: string): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter(
      (room) => room.roomType === type
    );
  }

  // Bed operations
  async getBed(id: number): Promise<Bed | undefined> {
    return this.beds.get(id);
  }

  async createBed(bed: InsertBed): Promise<Bed> {
    const id = this.bedId++;
    const newBed: Bed = { ...bed, id };
    this.beds.set(id, newBed);
    return newBed;
  }

  async updateBed(id: number, data: Partial<InsertBed>): Promise<Bed> {
    const bed = await this.getBed(id);
    if (!bed) {
      throw new Error(`Bed with ID ${id} not found`);
    }
    
    const updatedBed: Bed = { ...bed, ...data };
    this.beds.set(id, updatedBed);
    return updatedBed;
  }

  async getRoomBeds(roomId: number): Promise<Bed[]> {
    return Array.from(this.beds.values()).filter(
      (bed) => bed.roomId === roomId
    );
  }

  async getAvailableBeds(): Promise<Bed[]> {
    return Array.from(this.beds.values()).filter(
      (bed) => bed.status === "available"
    );
  }

  // Inpatient Admission operations
  async getInpatientAdmission(id: number): Promise<InpatientAdmission | undefined> {
    return this.inpatientAdmissions.get(id);
  }

  async createInpatientAdmission(admission: InsertInpatientAdmission): Promise<InpatientAdmission> {
    const id = this.admissionId++;
    const newAdmission: InpatientAdmission = { 
      ...admission, 
      id, 
      createdAt: new Date() 
    };
    this.inpatientAdmissions.set(id, newAdmission);
    
    // Update the bed status to occupied
    const bed = await this.getBed(admission.bedId);
    if (bed) {
      await this.updateBed(bed.id, { status: "occupied" });
    }
    
    return newAdmission;
  }

  async updateInpatientAdmission(id: number, data: Partial<InsertInpatientAdmission>): Promise<InpatientAdmission> {
    const admission = await this.getInpatientAdmission(id);
    if (!admission) {
      throw new Error(`Inpatient Admission with ID ${id} not found`);
    }
    
    const updatedAdmission: InpatientAdmission = { ...admission, ...data };
    this.inpatientAdmissions.set(id, updatedAdmission);
    
    // If discharged, update the bed status to available
    if (data.status === "discharged" && data.dischargeDate) {
      const bed = await this.getBed(admission.bedId);
      if (bed) {
        await this.updateBed(bed.id, { status: "available" });
      }
    }
    
    return updatedAdmission;
  }

  async getPatientAdmissions(patientId: number): Promise<InpatientAdmission[]> {
    return Array.from(this.inpatientAdmissions.values())
      .filter((admission) => admission.patientId === patientId)
      .sort((a, b) => {
        const dateA = new Date(a.admissionDate);
        const dateB = new Date(b.admissionDate);
        return dateB.getTime() - dateA.getTime(); // Sort newest first
      });
  }

  async getActiveAdmissions(): Promise<InpatientAdmission[]> {
    return Array.from(this.inpatientAdmissions.values()).filter(
      (admission) => admission.status === "active"
    );
  }

  // Billing operations
  async getBilling(id: number): Promise<Billing | undefined> {
    return this.billings.get(id);
  }

  async createBilling(billing: InsertBilling): Promise<Billing> {
    const id = this.billingId++;
    const newBilling: Billing = { 
      ...billing, 
      id, 
      createdAt: new Date() 
    };
    this.billings.set(id, newBilling);
    return newBilling;
  }

  async updateBilling(id: number, data: Partial<InsertBilling>): Promise<Billing> {
    const billing = await this.getBilling(id);
    if (!billing) {
      throw new Error(`Billing with ID ${id} not found`);
    }
    
    const updatedBilling: Billing = { ...billing, ...data };
    this.billings.set(id, updatedBilling);
    return updatedBilling;
  }

  async getPatientBillings(patientId: number): Promise<Billing[]> {
    return Array.from(this.billings.values())
      .filter((billing) => billing.patientId === patientId)
      .sort((a, b) => {
        const dateA = new Date(a.billDate);
        const dateB = new Date(b.billDate);
        return dateB.getTime() - dateA.getTime(); // Sort newest first
      });
  }

  async getPendingBillings(): Promise<Billing[]> {
    return Array.from(this.billings.values()).filter(
      (billing) => billing.status === "pending" || billing.status === "partial"
    );
  }

  // Billing Item operations
  async getBillingItem(id: number): Promise<BillingItem | undefined> {
    return this.billingItems.get(id);
  }

  async createBillingItem(item: InsertBillingItem): Promise<BillingItem> {
    const id = this.billingItemId++;
    const newItem: BillingItem = { ...item, id };
    this.billingItems.set(id, newItem);
    return newItem;
  }

  async getBillingItems(billingId: number): Promise<BillingItem[]> {
    return Array.from(this.billingItems.values()).filter(
      (item) => item.billingId === billingId
    );
  }

  // Dashboard data
  async getDashboardStats(): Promise<{
    totalPatients: number;
    outpatientToday: number;
    inpatientActive: number;
    monthlyRevenue: number;
  }> {
    const totalPatients = this.patients.size;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const outpatientRecords = Array.from(this.medicalRecords.values()).filter((record) => {
      const recordDate = new Date(record.visitDate);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime() && record.visitType === "outpatient";
    });
    
    const activeAdmissions = Array.from(this.inpatientAdmissions.values()).filter(
      (admission) => admission.status === "active"
    );
    
    // Calculate monthly revenue from billings
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const monthlyBillings = Array.from(this.billings.values()).filter((billing) => {
      const billDate = new Date(billing.billDate);
      return billDate >= firstDayOfMonth && billDate <= lastDayOfMonth;
    });
    
    const monthlyRevenue = monthlyBillings.reduce(
      (sum, billing) => sum + Number(billing.paidAmount), 
      0
    );
    
    return {
      totalPatients,
      outpatientToday: outpatientRecords.length,
      inpatientActive: activeAdmissions.length,
      monthlyRevenue,
    };
  }

  async getRecentActivities(): Promise<any[]> {
    const activities = [] as any[];
    
    // Get recent medical records
    const medicalRecords = Array.from(this.medicalRecords.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    for (const record of medicalRecords) {
      const patient = await this.getPatient(record.patientId);
      if (patient) {
        activities.push({
          patientId: patient.id,
          patientName: patient.name,
          activity: record.visitType === "outpatient" 
            ? "Pemeriksaan Rawat Jalan" 
            : record.visitType === "inpatient" 
              ? "Pemeriksaan Rawat Inap" 
              : "Pemeriksaan UGD",
          timestamp: record.createdAt,
        });
      }
    }
    
    // Get recent lab results
    const labResults = Array.from(this.labResults.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    
    for (const result of labResults) {
      const request = await this.getLabRequest(result.labRequestId);
      if (request) {
        const patient = await this.getPatient(request.patientId);
        if (patient) {
          const test = await this.getLabTest(result.labTestId);
          activities.push({
            patientId: patient.id,
            patientName: patient.name,
            activity: `Pemeriksaan Lab ${test?.name || ''}`,
            timestamp: result.createdAt,
          });
        }
      }
    }
    
    // Get recent prescriptions
    const prescriptions = Array.from(this.prescriptions.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    
    for (const prescription of prescriptions) {
      const patient = await this.getPatient(prescription.patientId);
      if (patient) {
        activities.push({
          patientId: patient.id,
          patientName: patient.name,
          activity: "Pengambilan Obat",
          timestamp: prescription.createdAt,
        });
      }
    }
    
    // Sort all activities by timestamp (newest first) and return top 5
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }

  async getUpcomingAppointmentsList(): Promise<any[]> {
    const upcomingAppointments = await this.getUpcomingAppointments();
    const result = [] as any[];
    
    for (const appointment of upcomingAppointments.slice(0, 4)) {
      const patient = await this.getPatient(appointment.patientId);
      const doctor = await this.getDoctor(appointment.doctorId);
      const department = await this.getDepartment(appointment.departmentId);
      
      if (patient && doctor && department) {
        result.push({
          id: appointment.id,
          patientId: patient.id,
          patientName: patient.name,
          doctorName: doctor.name,
          departmentName: department.name,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          status: appointment.status,
        });
      }
    }
    
    return result;
  }

  async getHospitalCapacity(): Promise<{
    bedCapacity: { total: number; occupied: number };
    icuCapacity: { total: number; occupied: number };
    outpatientCapacity: { total: number; occupied: number };
    emergencyCapacity: { total: number; occupied: number };
  }> {
    // Bed capacity
    const regularBeds = Array.from(this.beds.values()).filter(
      (bed) => {
        const room = this.rooms.get(bed.roomId);
        return room && room.roomType === "regular";
      }
    );
    
    const occupiedRegularBeds = regularBeds.filter(
      (bed) => bed.status === "occupied"
    );
    
    // ICU capacity
    const icuBeds = Array.from(this.beds.values()).filter(
      (bed) => {
        const room = this.rooms.get(bed.roomId);
        return room && room.roomType === "icu";
      }
    );
    
    const occupiedIcuBeds = icuBeds.filter(
      (bed) => bed.status === "occupied"
    );
    
    // For outpatient and emergency, we'll simulate capacity
    const outpatientTotal = 150;
    const outpatientOccupied = Math.min(
      this.medicalRecords.size % outpatientTotal, 
      outpatientTotal
    );
    
    const emergencyTotal = 15;
    const emergencyOccupied = Math.min(
      this.medicalRecords.size % emergencyTotal,
      emergencyTotal
    );
    
    return {
      bedCapacity: {
        total: regularBeds.length,
        occupied: occupiedRegularBeds.length,
      },
      icuCapacity: {
        total: icuBeds.length,
        occupied: occupiedIcuBeds.length,
      },
      outpatientCapacity: {
        total: outpatientTotal,
        occupied: outpatientOccupied,
      },
      emergencyCapacity: {
        total: emergencyTotal,
        occupied: emergencyOccupied,
      },
    };
  }
  
  // Insurance Provider operations
  async getInsuranceProvider(id: number): Promise<InsuranceProvider | undefined> {
    return this.insuranceProviders.get(id);
  }

  async getInsuranceProviderByCode(code: string): Promise<InsuranceProvider | undefined> {
    return Array.from(this.insuranceProviders.values()).find(
      (provider) => provider.code === code
    );
  }

  async createInsuranceProvider(provider: InsertInsuranceProvider): Promise<InsuranceProvider> {
    const id = this.insuranceProviderId++;
    const newProvider: InsuranceProvider = { 
      ...provider, 
      id, 
      createdAt: new Date() 
    };
    this.insuranceProviders.set(id, newProvider);
    return newProvider;
  }

  async updateInsuranceProvider(id: number, data: Partial<InsertInsuranceProvider>): Promise<InsuranceProvider> {
    const provider = await this.getInsuranceProvider(id);
    if (!provider) {
      throw new Error(`Insurance Provider with ID ${id} not found`);
    }
    
    const updatedProvider: InsuranceProvider = { ...provider, ...data };
    this.insuranceProviders.set(id, updatedProvider);
    return updatedProvider;
  }

  async getInsuranceProviders(): Promise<InsuranceProvider[]> {
    return Array.from(this.insuranceProviders.values());
  }

  async getActiveInsuranceProviders(): Promise<InsuranceProvider[]> {
    return Array.from(this.insuranceProviders.values()).filter(
      (provider) => provider.status === 'active'
    );
  }

  // Patient Insurance operations
  async getPatientInsurance(id: number): Promise<PatientInsurance | undefined> {
    return this.patientInsurances.get(id);
  }

  async createPatientInsurance(insurance: InsertPatientInsurance): Promise<PatientInsurance> {
    const id = this.patientInsuranceId++;
    const newInsurance: PatientInsurance = { 
      ...insurance, 
      id, 
      createdAt: new Date() 
    };
    this.patientInsurances.set(id, newInsurance);
    return newInsurance;
  }

  async updatePatientInsurance(id: number, data: Partial<InsertPatientInsurance>): Promise<PatientInsurance> {
    const insurance = await this.getPatientInsurance(id);
    if (!insurance) {
      throw new Error(`Patient Insurance with ID ${id} not found`);
    }
    
    const updatedInsurance: PatientInsurance = { ...insurance, ...data };
    this.patientInsurances.set(id, updatedInsurance);
    return updatedInsurance;
  }

  async getPatientInsurances(patientId: number): Promise<PatientInsurance[]> {
    return Array.from(this.patientInsurances.values()).filter(
      (insurance) => insurance.patientId === patientId
    );
  }

  async getActivePatientInsurances(patientId: number): Promise<PatientInsurance[]> {
    return Array.from(this.patientInsurances.values()).filter(
      (insurance) => insurance.patientId === patientId && insurance.status === 'active'
    );
  }
}

export const storage = new MemStorage();
