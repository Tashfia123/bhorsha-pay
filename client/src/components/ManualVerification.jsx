import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  Close as X, 
  CloudUpload as Upload, 
  Description as FileText, 
  CameraAlt as Camera, 
  Warning as AlertCircle, 
  CheckCircle as CheckCircle, 
  Schedule as Clock 
} from '@mui/icons-material';

const ManualVerification = ({ 
  isOpen, 
  onClose, 
  nidNumber, 
  validationResult,
  onSubmit 
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    fatherName: '',
    motherName: '',
    address: '',
    phoneNumber: '',
    email: '',
    additionalDocuments: [],
    explanation: '',
    contactPreference: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const { isDarkMode } = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      additionalDocuments: [...prev.additionalDocuments, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const submissionData = {
        nidNumber,
        validationResult,
        formData,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      
      // Call the parent onSubmit function
      if (onSubmit) {
        await onSubmit(submissionData);
      }
      
      setSubmissionStatus('success');
      setTimeout(() => {
        onClose();
        setStep(1);
        setFormData({
          fullName: '',
          dateOfBirth: '',
          fatherName: '',
          motherName: '',
          address: '',
          phoneNumber: '',
          email: '',
          additionalDocuments: [],
          explanation: '',
          contactPreference: 'email'
        });
        setSubmissionStatus(null);
      }, 3000);
      
    } catch (error) {
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-red-600">Manual Verification Required</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              NID: {nidNumber} • AI Risk: {validationResult?.overallRisk}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Personal Info</span>
            <span>Documents</span>
            <span>Review & Submit</span>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4">📋 Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Father's Name *</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700"
                      placeholder="Enter father's name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Mother's Name *</label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700"
                      placeholder="Enter mother's name"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700"
                      placeholder="Enter your complete address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4">📄 Additional Documents</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Supporting Documents</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                          <span>Choose Files</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="sr-only"
                          />
                        </label>
                        <p className="mt-2">or drag and drop</p>
                        <p className="text-xs">PNG, JPG, PDF, DOC up to 10MB each</p>
                      </div>
                    </div>
                  </div>

                  {/* File List */}
                  {formData.additionalDocuments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                      <div className="space-y-2">
                        {formData.additionalDocuments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Explanation for Manual Review *</label>
                    <textarea
                      name="explanation"
                      value={formData.explanation}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700"
                      placeholder="Please explain why your NID number might have been flagged and provide any additional context..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Contact Method</label>
                    <select
                      name="contactPreference"
                      value={formData.contactPreference}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4">🔍 Review & Submit</h3>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">Verification Request Summary:</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">NID Number:</span>
                      <p className="text-gray-600 dark:text-gray-400">{nidNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium">Full Name:</span>
                      <p className="text-gray-600 dark:text-gray-400">{formData.fullName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Date of Birth:</span>
                      <p className="text-gray-600 dark:text-gray-400">{formData.dateOfBirth}</p>
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p className="text-gray-600 dark:text-gray-400">{formData.phoneNumber}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Address:</span>
                      <p className="text-gray-600 dark:text-gray-400">{formData.address}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Documents:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {formData.additionalDocuments.length} file(s) selected
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-medium">What happens next?</p>
                      <ul className="mt-2 space-y-1">
                        <li>• Your request will be reviewed by our verification team</li>
                        <li>• Processing time: 24-48 hours</li>
                        <li>• You'll receive updates via {formData.contactPreference}</li>
                        <li>• If approved, your account will be activated</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
            )}
            
            <div className="ml-auto flex space-x-3">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>Submit for Review</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Submission Status */}
        <AnimatePresence>
          {submissionStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`p-6 text-center ${
                submissionStatus === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800'
              }`}
            >
              {submissionStatus === 'success' ? (
                <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle size={20} />
                  <span className="font-medium">Verification request submitted successfully!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400">
                  <AlertCircle size={20} />
                  <span className="font-medium">Submission failed. Please try again.</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ManualVerification;
