import axios, { AxiosError } from 'axios';

const API_ENDPOINT = 'https://gfvgh9ymci.execute-api.eu-north-1.amazonaws.com/default/addRequestToSQS';

interface APIError {
  message: string;
  details?: unknown;
}

export async function uploadRecord(data: Record<string, string>, rowNumber: Number, filename: string, useremail:string): Promise<void> {
  try {
    // Format data as required by the API
    const formattedData = {
      row_number: rowNumber,
      mail_address: data.mail_address || '',
      mail_city: data.mail_city || '',
      mail_state: data.mail_state || '',
      mail_zip: data.mail_zip || '',
      property_address: data.property_address || '',
      property_city: data.property_city || '',
      property_state: data.property_state || '',
      property_zip: data.property_zip || '',
      file_name:filename,
      ExactMatch:"CurrentOwner",
      user_email:useremail
    };

    // Validate data before sending
    if (Object.values(formattedData).some(value => !value)) {
      throw new Error('Missing required fields in record');
    }

    const response = await axios.post(API_ENDPOINT, formattedData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`);
    }

    // Add delay between requests to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to upload record');
  }
}

export async function uploadRecordsSequentially(
  records: Record<string, string>[],
  filename: string,
  useremail: string,
  onProgress: (progress: number) => void
): Promise<void> {
  let successCount = 0;
  const errors: Array<{ index: number; error: unknown }> = [];

  for (let i = 0; i < records.length; i++) {
    try {
      await uploadRecord(records[i], i+1, filename, useremail);
      successCount++;
      onProgress(Math.round(((i + 1) / records.length) * 100));
    } catch (error) {
      errors.push({ index: i, error });
      console.error(`Failed to upload record ${i + 1}:`, error);
      // Continue with next record despite error
    }
  }

  if (errors.length > 0) {
    const errorMessage = `${successCount} records uploaded successfully. ${errors.length} records failed.`;
    // alert("upload successfull, please check after 1 hours for enriched data n download section")
    if (successCount === 0) {
      throw new Error(errorMessage);
    } else {
      console.warn(errorMessage);
    }
  }
}