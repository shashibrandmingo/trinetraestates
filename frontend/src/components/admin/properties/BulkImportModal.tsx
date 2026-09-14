'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { propertyService } from '@/services/propertyService';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const headers = [
      'Property Name',
      'Sector',
      'Area (Sq.Ft.)',
      'Monthly Rent',
      'Property Type',
      'Furnishing',
      'Building Name',
      'Owner Name',
      'Owner Phone',
      'Status'
    ];

    const sampleRows = [
      [
        'Corenthum Tower Suite 501',
        'Sector 62',
        '3500',
        '245000',
        'Office',
        'Full',
        'The Corenthum',
        'Rajesh Sharma',
        '+91 98112 34567',
        'Active'
      ],
      [
        'Advant Navis Grade A Space',
        'Sector 142',
        '8000',
        '640000',
        'Office',
        'Full',
        'Advant Navis Business Park',
        'Sunil Mittal',
        '+91 99990 12345',
        'Active'
      ],
      [
        'Express Trade Tower Ground Unit',
        'Sector 132',
        '2200',
        '176000',
        'Retail Space',
        'Semi',
        'Express Trade Tower',
        'Vikas Gupta',
        '+91 98765 43210',
        'Active'
      ]
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...sampleRows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Commercial_Properties_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Robust Native CSV Parser (zero dependency)
  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]).map((h) => h.trim());
    const rows: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === 0 || (values.length === 1 && !values[0])) continue;

      const rowObj: any = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] !== undefined ? values[idx].trim() : '';
      });
      rows.push(rowObj);
    }
    return rows;
  };

  const parseCSVLine = (line: string) => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result.map((s) => s.replace(/^"|"$/g, '').trim());
  };

  // Load SheetJS dynamically on demand if file is .xlsx or .xls
  const loadSheetJS = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).XLSX) {
        return resolve((window as any).XLSX);
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
      script.onload = () => resolve((window as any).XLSX);
      script.onerror = () => reject(new Error('Could not load Excel parser script.'));
      document.body.appendChild(script);
    });
  };

  // Handle File Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setErrorMessage(null);
    setIsParsing(true);

    try {
      const fileName = selected.name.toLowerCase();

      if (fileName.endsWith('.csv')) {
        const text = await selected.text();
        const rows = parseCSV(text);
        if (rows.length === 0) {
          throw new Error('No valid data rows found in CSV file.');
        }
        setParsedRows(rows);
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const XLSX = await loadSheetJS();
        const data = await selected.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonRows || jsonRows.length === 0) {
          throw new Error('No data found in the first sheet of Excel file.');
        }
        setParsedRows(jsonRows);
      } else {
        throw new Error('Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to parse file.');
      setParsedRows([]);
    } finally {
      setIsParsing(false);
    }
  };

  // Start Bulk Import Process in 500-item chunks
  const handleStartImport = async () => {
    if (parsedRows.length === 0) return;

    setIsUploading(true);
    setProgress(0);
    setErrorMessage(null);
    setImportStatus(`Starting import of ${parsedRows.length.toLocaleString()} properties...`);

    const BATCH_SIZE = 500;
    let totalImported = 0;

    try {
      for (let i = 0; i < parsedRows.length; i += BATCH_SIZE) {
        const batch = parsedRows.slice(i, i + BATCH_SIZE);
        const currentBatchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(parsedRows.length / BATCH_SIZE);

        setImportStatus(`Importing batch ${currentBatchNum} of ${totalBatches} (${batch.length} properties)...`);

        const res = await propertyService.bulkImportProperties(batch);
        totalImported += res.insertedCount || batch.length;

        const currentPct = Math.min(100, Math.round(((i + batch.length) / parsedRows.length) * 100));
        setProgress(currentPct);
      }

      setImportStatus(`✓ Success! Successfully imported ${totalImported.toLocaleString()} properties into database!`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1800);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error occurred during bulk import.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedRows([]);
    setErrorMessage(null);
    setImportStatus(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs"
    >
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-navy-950">
                Import Properties from Excel / CSV
              </h2>
              <p className="text-[11px] text-slate-500">
                Bulk upload up to 40,000 commercial spaces directly into MongoDB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="p-1 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-navy-900 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Download Sample Template Banner */}
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-900">
              <span className="text-sm">💡</span>
              <span className="font-medium text-[11.5px]">
                Not sure about columns format? Use our ready Excel/CSV template.
              </span>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-2.5 py-1 bg-white border border-amber-300 hover:bg-amber-100/50 rounded-lg text-amber-900 font-bold text-[11px] shrink-0 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Download Template</span>
              <span>↓</span>
            </button>
          </div>

          {/* Upload Area */}
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-700 flex items-center justify-center mx-auto mb-3 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="font-heading font-bold text-navy-950 text-sm">
                Click to browse or drag & drop your file
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports Excel (.xlsx, .xls) and CSV (.csv) up to 40,000 rows
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Selected File Info Card */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl">📊</span>
                  <div className="min-w-0">
                    <p className="font-bold text-navy-950 truncate text-[11.5px]">{file.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • {parsedRows.length.toLocaleString()} rows detected
                    </p>
                  </div>
                </div>
                {!isUploading && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-rose-500 hover:text-rose-700 font-semibold cursor-pointer px-2 py-1"
                  >
                    Change File
                  </button>
                )}
              </div>

              {/* Parsing Spinner */}
              {isParsing && (
                <div className="py-4 text-center text-slate-500 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                  <span>Parsing Excel data in browser...</span>
                </div>
              )}

              {/* Data Preview (First 4 rows) */}
              {parsedRows.length > 0 && !isUploading && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-navy-900 text-[11px]">
                      Data Preview (First {Math.min(4, parsedRows.length)} of {parsedRows.length.toLocaleString()} rows):
                    </span>
                    <span className="text-[10.5px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Ready to Import
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-48">
                    <table className="w-full text-left text-[10px] border-collapse bg-white">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 whitespace-nowrap font-bold">
                          <th className="py-1.5 px-2.5">Title</th>
                          <th className="py-1.5 px-2">Sector</th>
                          <th className="py-1.5 px-2">Area (Sq.Ft.)</th>
                          <th className="py-1.5 px-2">Rent (₹)</th>
                          <th className="py-1.5 px-2">Type</th>
                          <th className="py-1.5 px-2">Owner</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedRows.slice(0, 4).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="py-1.5 px-2.5 font-bold text-navy-950 truncate max-w-[140px]">
                              {row['Property Name'] || row.title || row.name || `Property ${idx + 1}`}
                            </td>
                            <td className="py-1.5 px-2 text-slate-600 whitespace-nowrap">
                              {row.Sector || row.sector || row.locality || 'Sector 62'}
                            </td>
                            <td className="py-1.5 px-2 text-slate-900 font-bold whitespace-nowrap">
                              {row['Area (Sq.Ft.)'] || row.areaSqFt || row.area || '1,000'}
                            </td>
                            <td className="py-1.5 px-2 text-slate-900 font-bold whitespace-nowrap">
                              ₹ {row['Monthly Rent'] || row.price || row.rent || '50,000'}
                            </td>
                            <td className="py-1.5 px-2 text-slate-600 capitalize whitespace-nowrap">
                              {row['Property Type'] || row.propertyType || 'Office'}
                            </td>
                            <td className="py-1.5 px-2 text-slate-600 truncate max-w-[100px]">
                              {row['Owner Name'] || row.ownerName || 'Direct Owner'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Progress Bar & Status */}
          {isUploading && (
            <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-navy-950">{importStatus}</span>
                <span className="text-gold-600">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Banner */}
          {importStatus && !isUploading && importStatus.startsWith('✓') && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-[11.5px] text-center animate-in fade-in">
              {importStatus}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium text-[11px]">
              ⚠️ {errorMessage}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100 text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartImport}
            disabled={parsedRows.length === 0 || isUploading}
            className="btn-gold px-4 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            {isUploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <span>Start Import ({parsedRows.length.toLocaleString()})</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
