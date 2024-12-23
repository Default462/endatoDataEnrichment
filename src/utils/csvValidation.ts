export const REQUIRED_HEADERS = [
  'mail_address',
  'mail_city',
  'mail_state',
  'mail_zip',
  'property_address',
  'property_city',
  'property_state',
  'property_zip'
];

export function validateCSVHeaders(headers: string[]): boolean {
  return REQUIRED_HEADERS.every(requiredHeader => 
    headers.includes(requiredHeader)
  );
}

export function getHeaderValidationError(headers: string[]): string | null {
  const missingHeaders = REQUIRED_HEADERS.filter(header => !headers.includes(header));
  
  if (missingHeaders.length > 0) {
    return `Missing required headers: ${missingHeaders.join(', ')}`;
  }
  
  return null;
}