import { ChangeEvent } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface CSVUploaderProps {
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  error: string | null;
  uploadProgress: number;
}

export function CSVUploader({ 
  onFileSelect, 
  uploading, 
  error, 
  uploadProgress 
}: CSVUploaderProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <input
        type="file"
        accept=".csv"
        onChange={onFileSelect}
        className="hidden"
        id="file-upload"
        disabled={uploading}
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer inline-block px-4 py-2 ${
          uploading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white rounded`}
      >
        {uploading ? 'Uploading...' : 'Select CSV File'}
      </label>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}
      
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Processing records: {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
}