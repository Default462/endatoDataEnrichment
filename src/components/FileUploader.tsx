import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { parseFile, ParsedData } from '../utils/fileParser';
import { RateLimiter } from '../utils/rateLimiter';
import { uploadRow } from '../services/api';

const REQUESTS_PER_MINUTE = 120;

export default function FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [processedRows, setProcessedRows] = useState(0);

  const rateLimiter = new RateLimiter(REQUESTS_PER_MINUTE, async (row) => {
    await uploadRow(row);
    setProcessedRows((prev) => prev + 1);
  });

  const handleFileSelection = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleProcessFile = useCallback(async () => {
    if (!selectedFile) {
      alert('Please select a file before uploading.');
      return;
    }

    try {
      setIsUploading(true);
      setProgress(0);
      setProcessedRows(0);

      const parsedData: ParsedData = await parseFile(selectedFile);

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
      }, 500);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
      setIsUploading(false);
    }
  }, [selectedFile, processedRows]);

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
            className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-gray-300 hover:border-blue-500 hover:bg-blue-50"
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
              onChange={handleFileSelection}
              disabled={isUploading}
            />
          </label>
        </div>

        {selectedFile && (
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Selected File:</span> {selectedFile.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">File Size:</span> {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        {selectedFile && (
          <button
            onClick={handleProcessFile}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300"
            disabled={isUploading}
          >
            {isUploading ? 'Processing...' : 'Upload and Process'}
          </button>
        )}

        {isUploading && (
          <div className="space-y-3 mt-4">
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
