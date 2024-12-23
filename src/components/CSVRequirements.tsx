import { REQUIRED_HEADERS } from '../utils/csvValidation';

export function CSVRequirements() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">CSV File Requirements</h2>
      <p className="text-gray-600 mb-4">
        The CSV file must contain the following headers:
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        {REQUIRED_HEADERS.map(header => (
          <li key={header}>{header}</li>
        ))}
      </ul>
    </div>
  );
}