import { useState, useCallback } from 'react';
import { getDocuments, uploadDocument, deleteDocument } from '@/lib/api';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: string;
}

interface DocumentsState {
  documents: Document[];
  loading: boolean;
  error: string | null;
}

export function useDocuments() {
  const [state, setState] = useState<DocumentsState>({
    documents: [],
    loading: true,
    error: null
  });

  const fetchDocuments = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    const response = await getDocuments();

    if (response.data) {
      setState({
        documents: response.data,
        loading: false,
        error: null
      });
    } else {
      setState({
        documents: [],
        loading: false,
        error: response.error
      });
    }
  }, []);

  const handleUpload = async (file: File) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await uploadDocument(file);

    if (response.data) {
      setState(prevState => ({
        documents: [...prevState.documents, response.data],
        loading: false,
        error: null
      }));
      return true;
    } else {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: response.error
      }));
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await deleteDocument(id);

    if (response.error === null) {
      setState(prevState => ({
        documents: prevState.documents.filter(doc => doc.id !== id),
        loading: false,
        error: null
      }));
      return true;
    } else {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: response.error
      }));
      return false;
    }
  };

  const getDocumentById = (id: string) => {
    return state.documents.find(doc => doc.id === id);
  };

  return {
    ...state,
    fetchDocuments,
    uploadDocument: handleUpload,
    deleteDocument: handleDelete,
    getDocumentById
  };
} 