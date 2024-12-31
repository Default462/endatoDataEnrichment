import { useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { FileTable } from '../components/FileTable';
import type { FileRecord } from '../types/file';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

export function DownloadsPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileRecord[]>([]);


  useEffect(() => {
    // Function to fetch filenames from the backend
    const fetchFilenames = async () => {
      try {
        const response = await axios.post('https://elbtdjxd5a.execute-api.eu-north-1.amazonaws.com/default/getDataFromSQL', {
          action: 'getFiles',  // Action passed to the API
          user_email: user?.email, // Pass the user's email or any other necessary parameter
        });
        const filenames = response.data.filenames;
        const updatedFiles = filenames.map((filename, index) => ({
          id: (index + 1).toString(),
          name: filename,
          size: 0,  // You can add size if you have this info
          created_at: '', // Add date if available
          user_id: '123', // Add user_id if needed
          // url: `https://example.com/files/${filename}` // Generate the file URL
        }));
        setFiles(updatedFiles);
      } catch (error) {
        console.error('Error fetching filenames:', error);
        // Handle error if needed
      }
    };
    // Call the function to fetch filenames on component mount
    setTimeout(fetchFilenames(), 2000);
  }, [user]);

  const handleDownload = async (file: FileRecord) => {
    try {
      const response = await axios.post(
        'https://elbtdjxd5a.execute-api.eu-north-1.amazonaws.com/default/getDataFromSQL',
        {
          action: 'downloadFile',
          user_email: user?.email,
          filename: 'Test_input.csv',
        },
        {
          responseType: 'blob', // Ensure the response is treated as a binary file
        }
      );

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'text/csv' });

      // Create a link element
      const link = document.createElement('a');

      // Set the download attribute with the desired file name
      link.href = URL.createObjectURL(blob);
      link.download = 'Test_input.csv';

      // Programmatically click the link to trigger the download
      document.body.appendChild(link);
      link.click();

      // Remove the link element
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error while downloading the file:', error);
    }
  };

  const handleDelete = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Downloads</h1>
        <div className="bg-white rounded-lg shadow-md">
          <FileTable
            files={files}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
