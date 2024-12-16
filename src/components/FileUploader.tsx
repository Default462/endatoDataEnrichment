import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { parseFile, ParsedData } from '../utils/fileParser';
import { RateLimiter } from '../utils/rateLimiter';
import { uploadRow } from '../services/api';

const REQUESTS_PER_MINUTE = 120;

export default function FileUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [processedRows, setProcessedRows] = useState(0);

  const rateLimiter = new RateLimiter(REQUESTS_PER_MINUTE, async (row) => {
    await uploadRow(row);
    setProcessedRows(prev => prev + 1);
  });

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setProgress(0);
      setProcessedRows(0);

      const parsedData: ParsedData = await parseFile(file);
      console.log("Data is:- ", parsedData.data)
      if (parsedData.errors.length > 0) {
        console.error('Parsing errors:', parsedData.errors);
        alert('There were some errors parsing the file. Please check the console for details.');
        return;
      }

      setTotalRows(parsedData.data.length);
      rateLimiter.addToQueue(parsedData.data);

      // Update progress periodically
      const progressInterval = setInterval(() => {
        const processed = processedRows;
        const total = parsedData.data.length;
        const newProgress = Math.round((processed / total) * 100);
        setProgress(newProgress);

        if (processed === total) {
          clearInterval(progressInterval);
          setIsUploading(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
      setIsUploading(false);
    }
  }, [processedRows]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">File Upload</h1>
          <p className="text-gray-600">Upload your Excel or CSV file</p>
        </div>

        <div className="mb-6">
          <label 
            htmlFor="file-upload"
            className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isUploading ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">Excel or CSV files only</p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {isUploading && (
          <div className="space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-600">
              Processed {processedRows} of {totalRows} rows ({progress}%)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}