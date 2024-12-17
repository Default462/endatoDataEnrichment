// const SUPABASE_API_URL = 'your-api-base-url';
// const SUPABASE_API_URL = import.meta.env.VITE_SUPABASE_API_URL;

export const uploadRow = async (rowData: any, filename: any): Promise<void> => {
  // console.log("row data is ", rowData)
  // return
  
  let body = rowData
  body.filename = filename
  console.log(body) 
  try {
    const response = await fetch(`https://mzouiorqhravqybadngk.supabase.co/functions/v1/enrichAndSavetoDatabase`, {
      method: 'POST',
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16b3Vpb3JxaHJhdnF5YmFkbmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxOTEyNTgsImV4cCI6MjA0OTc2NzI1OH0.tCgvbmfSaRk7_GtN7v40ypcSyNGoEnGqSaFtCs0h004",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data
  } catch (error) {
    console.error('Error uploading row:', error);
    // throw error;
    return
  }
};


export const getProcessedData = async (filename: any): Promise<void> => {
  // console.log("row data is ", rowData)
  // return 


  try {
    const response = await fetch(`https://mzouiorqhravqybadngk.supabase.co/functions/v1/fetchData`, {
      method: 'POST',
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16b3Vpb3JxaHJhdnF5YmFkbmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxOTEyNTgsImV4cCI6MjA0OTc2NzI1OH0.tCgvbmfSaRk7_GtN7v40ypcSyNGoEnGqSaFtCs0h004",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uploadname: filename }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // const data = await response.json();
    const csvContent = await response.text(); // Read the body as text (CSV)

    // Return the CSV content
    return { csvContent };

  } catch (error) {
    console.error('Error fetching processed data:', error);
    return;
  }
};