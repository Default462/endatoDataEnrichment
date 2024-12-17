// const SUPABASE_API_URL = 'your-api-base-url';
const SUPABASE_API_URL = import.meta.env.VITE_SUPABASE_API_URL;

export const uploadRow = async (rowData: any): Promise<void> => {
  
  try {
    const response = await fetch(`https://mzouiorqhravqybadngk.supabase.co/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rowData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error uploading row:', error);
    // throw error;
    
  }
};