import { useState } from 'react';
import Papa from 'papaparse';
import { useAuth } from '../hooks/useAuth';
import { Navigation } from '../components/Navigation';
import { CSVUploader } from '../components/CSVUploader';
import { CSVRequirements } from '../components/CSVRequirements';
import { validateCSVHeaders, getHeaderValidationError } from '../utils/csvValidation';
import { uploadRecordsSequentially } from '../utils/api';
import type { ParseResult } from 'papaparse';

export function DashboardPage() {
  const { user } = useAuth();
  console.log("user",user)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: async (results: ParseResult<Record<string, string>>) => {
        try {
          if (!results.data || results.data.length === 0) {
            setError('The CSV file is empty or invalid');
            return;
          }

          const headers = Object.keys(results.data[0] || {});
          const headerError = getHeaderValidationError(headers);
          
          if (headerError) {
            setError(headerError);
            return;
          }

          // Filter out any rows with empty values and trim all values
          const validRecords = results.data
            .map(record => {
              const trimmedRecord: Record<string, string> = {};
              Object.entries(record).forEach(([key, value]) => {
                trimmedRecord[key] = (value || '').trim();
              });
              return trimmedRecord;
            })
            .filter(record => 
              Object.values(record).every(value => value !== '')
            );

          if (validRecords.length === 0) {
            setError('No valid records found in the CSV file');
            return;
          }

          const filename = file.name
          await uploadRecordsSequentially(
            validRecords,
            filename,
            user.email,
            (progress) => setUploadProgress(progress)
          );
          
          // Clear the file input
          event.target.value = '';
          setError(null);
        } catch (error) {
          console.error('Upload error:', error);
          setError(error instanceof Error ? error.message : 'An error occurred while uploading the data');
        } finally {
          setUploading(false);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        setError('Error parsing CSV file. Please ensure it is a valid CSV format.');
        setUploading(false);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>
          <CSVUploader
            onFileSelect={handleFileUpload}
            uploading={uploading}
            error={error}
            uploadProgress={uploadProgress}
          />
        </div>

        <CSVRequirements />
      </div>
    </div>
  );
}