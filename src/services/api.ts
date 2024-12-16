const API_BASE_URL = 'your-api-base-url';

export const uploadRow = async (rowData: any): Promise<void> => {
  console.log(rowData)
  setTimeout("success",2000)
  // return "success"
  // try {
  //   const response = await fetch(`${API_BASE_URL}/data`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(rowData),
  //   });

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }
  // } catch (error) {
  //   console.error('Error uploading row:', error);
  //   throw error;
  // }
};