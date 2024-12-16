import Papa from 'papaparse';

export type ParsedData = {
  data: any[];
  errors: Papa.ParseError[];
};

export const parseFile = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        resolve({
          data: results.data,
          errors: results.errors,
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};