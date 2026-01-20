'use client';

import { useState, useRef } from 'react';
import { parseFile, ParsedData } from '@/lib/file-parser';

interface FileUploadProps {
  onFileParsed: (data: ParsedData) => void;
  onError: (error: string) => void;
}

export default function FileUpload({ onFileParsed, onError }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const validTypes = ['csv', 'json', 'xlsx', 'xls'];
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (!fileType || !validTypes.includes(fileType)) {
      onError('Unsupported file type. Please upload a CSV, JSON, or XLSX file. These formats are optimized for product data migration.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      onError('File size exceeds 4MB limit. For larger catalogs, we recommend splitting your data into product families (e.g., by category or product type) for better AI accuracy and faster processing.');
      return;
    }

    setIsProcessing(true);
    try {
      const parsedData = await parseFile(file);

      // Track file upload success with correct extension
      const fileExtension = `.${fileType}`;
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'file_upload_success', {
          file_extension: fileExtension,
          row_count: parsedData.totalRows,
          header_count: parsedData.headers.length,
        });
      }

      onFileParsed(parsedData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse file';
      onError(
        errorMessage.includes('parse') || errorMessage.includes('format')
          ? `Unable to read your file. Please ensure it's a valid ${fileType.toUpperCase()} file with product data. If the issue persists, try exporting your data again from the source system.`
          : errorMessage
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${isDragging
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 hover:border-primary-400 bg-gray-50'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json,.xlsx,.xls"
        onChange={handleFileInput}
        className="hidden"
        disabled={isProcessing}
      />

      {isProcessing ? (
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600">Processing file...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4h4m-4-4v4m0 4v4m0-4h4m-4-4h4"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              Drop your file here, or click to browse
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Supports CSV, JSON, and XLSX files (max 4MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

