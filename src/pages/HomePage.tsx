import React, { useState, useEffect } from 'react';
import { Calculator, Zap, Leaf, Globe } from 'lucide-react';
import CalculatorForm from '../components/CalculatorForm';
import ResultCard from '../components/ResultCard';
import LeadModal from '../components/LeadModal';
import { calculateEmissions } from '../lib/comparisons';
import { upsertLead } from '../lib/leads';

interface FormData {
  modelId: string;
  tokensPerMonth: number;
  requestsPerMonth: number;
}

interface CalculationResult {
  totalEmissions: number;
  comparisons: Array<{
    type: string;
    value: number;
    unit: string;
    description: string;
  }>;
}

const HomePage: React.FC = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const [hasReportAccess, setHasReportAccess] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  const handleCalculation = async (data: FormData) => {
    console.log('handleCalculation called with:', data);
    
    try {
      const calculationResult = await calculateEmissions(
        data.modelId,
        data.tokensPerMonth,
        data.requestsPerMonth
      );
      
      console.log('Calculation result:', calculationResult);
      setResult(calculationResult);
      setFormData(data);
      setHasReportAccess(true);
      
      return calculationResult;
    } catch (error) {
      console.error('Calculation failed:', error);
      throw error;
    }
  };

  const handleFormSubmit = (data: FormData) => {
    console.log('Form submitted, opening lead modal with pending data:', data);
    setPendingFormData(data);
    setIsLeadModalOpen(true);
  };

  const handleReportConfirmed = async () => {
    console.log('handleReportConfirmed called');
    
    if (!pendingFormData) {
      console.error('No pending form data');
      return;
    }

    try {
      console.log('Running calculation with pending data:', pendingFormData);
      await handleCalculation(pendingFormData);
      console.log('Calculation completed, hasReportAccess set to true');
      
      // Close modal
      setIsLeadModalOpen(false);
      // Clear pending data
      setPendingFormData(null);
    } catch (error) {
      console.error('Error in handleReportConfirmed:', error);
      alert('Failed to process calculation. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Carbon Calculator</h1>
              <p className="text-gray-600">Calculate your AI model's environmental impact</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Calculator Form */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Measure Your AI's Carbon Footprint
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get detailed insights into the environmental impact of your AI usage and discover ways to reduce your carbon footprint.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Calculator className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Calculate Emissions</h3>
              </div>
              
              <CalculatorForm onSubmit={handleFormSubmit} />
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <h4 className="font-semibold text-gray-900">Real-time Analysis</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Get instant calculations based on the latest emission factors and model data.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold text-gray-900">Global Impact</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Understand your contribution to global carbon emissions and climate change.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:sticky lg:top-8">
            {hasReportAccess && result ? (
              <ResultCard 
                result={result}
                formData={formData}
                sessionId={sessionId}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Calculate
                </h3>
                <p className="text-gray-600">
                  Fill out the form to see your AI model's carbon footprint and environmental impact analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Lead Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setPendingFormData(null);
        }}
        sessionId={sessionId}
        onReportConfirmed={handleReportConfirmed}
        reportData={pendingFormData}
      />
    </div>
  );
};

export default HomePage;