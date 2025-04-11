import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/patients/PatientList";
import PatientForm from "./pages/patients/PatientForm";
import PatientDetail from "./pages/patients/PatientDetail";
import AppointmentList from "./pages/appointments/AppointmentList";
import AppointmentForm from "./pages/appointments/AppointmentForm";
import MedicalRecordList from "./pages/medical-records/MedicalRecordList";
import MedicalRecordForm from "./pages/medical-records/MedicalRecordForm";
import OutpatientQueue from "./pages/outpatient/OutpatientQueue";
import PharmacyInventory from "./pages/pharmacy/PharmacyInventory";
import PrescriptionList from "./pages/pharmacy/PrescriptionList";
import LabRequestList from "./pages/laboratory/LabRequestList";
import LabResultForm from "./pages/laboratory/LabResultForm";
import Reports from "./pages/reports/Reports";
import BillingList from "./pages/billing/BillingList";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/patients" component={PatientList} />
      <Route path="/patients/new" component={PatientForm} />
      <Route path="/patients/:id">{(params) => <PatientDetail id={parseInt(params.id)} />}</Route>
      <Route path="/appointments" component={AppointmentList} />
      <Route path="/appointments/new" component={AppointmentForm} />
      <Route path="/medical-records">{() => <MedicalRecordList />}</Route>
      <Route path="/medical-records/new" component={MedicalRecordForm} />
      <Route path="/outpatient" component={OutpatientQueue} />
      <Route path="/pharmacy/inventory" component={PharmacyInventory} />
      <Route path="/pharmacy/prescriptions" component={PrescriptionList} />
      <Route path="/laboratory/requests" component={LabRequestList} />
      <Route path="/laboratory/results/new/:requestId">{(params) => (
        <LabResultForm requestId={parseInt(params.requestId)} />
      )}</Route>
      <Route path="/reports" component={Reports} />
      <Route path="/billing" component={BillingList} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Router />
      </MainLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
