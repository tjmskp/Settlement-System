'use client';

import { useState } from 'react';
import { DocumentIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Contract_Agreement.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadedAt: '2024-03-20',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Property_Title.pdf',
    type: 'PDF',
    size: '1.8 MB',
    uploadedAt: '2024-03-19',
    status: 'approved',
  },
];

export default function Documents() {
  const [documents] = useState<Document[]>(mockDocuments);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    
    try {
      // Simulating file upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Here you would normally upload the file to your backend
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">Documents</h1>
            <p className="mt-2 text-sm text-gray-700">
              Upload and manage your settlement documents
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <label
              htmlFor="file-upload"
              className={`relative cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className="flex items-center">
                <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileUpload}
                disabled={isUploading}
                accept=".pdf,.doc,.docx"
              />
            </label>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Type
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Size
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Uploaded
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {documents.map((document) => (
                      <tr key={document.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <div className="flex items-center">
                            <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
                            {document.name}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{document.type}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{document.size}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{document.uploadedAt}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              document.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : document.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 