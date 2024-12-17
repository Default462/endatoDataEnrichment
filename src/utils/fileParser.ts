import Papa from 'papaparse';

export type ParsedData = {
  data: any[];
  errors: Papa.ParseError[];
};

export const parseFile = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true, // Ignore completely empty lines
      dynamicTyping: true,  // Parse numbers and null values correctly
      complete: (results) => {
        resolve({
          data: results.data,
          errors: results.errors,
        });
      },
      // error: (error) => {
      //   reject(error);
      // },
    });
  });
};
