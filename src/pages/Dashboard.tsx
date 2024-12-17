import React, { useState } from 'react';
import Header from '../components/Header';
import FileUploader from '../components/FileUploader';

export default function Dashboard() {
  // State to manage the key of the FileUploader component
  const [fileUploaderKey, setFileUploaderKey] = useState(0);

  // Function to reload the FileUploader by changing its key
  const reloadFileUploader = () => {
    setFileUploaderKey((prevKey) => prevKey + 1); // Increment the key to trigger remount
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Button to reload the FileUploader */}
        <button
          onClick={reloadFileUploader}
          className="bg-blue-600 text-white py-2 px-4 rounded mb-4"
        >
          Not Working? Click here.
        </button>

        {/* FileUploader component with dynamic key */}
        <FileUploader key={fileUploaderKey} />
      </main>
    </div>
  );
}
