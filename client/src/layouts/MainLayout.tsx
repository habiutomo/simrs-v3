import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useLocation } from "wouter";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 flex-shrink-0 flex-col bg-white border-r border-gray-200 h-full">
        <Sidebar />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center px-4 h-16">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-primary">SIMRS</h1>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
                <h1 className="text-xl font-semibold text-primary">SIMRS</h1>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-grow overflow-y-auto">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0 pb-4 px-4 md:px-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
