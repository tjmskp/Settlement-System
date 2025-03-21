import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Mock documents database
let documents = [
  {
    id: '1',
    name: 'Settlement Agreement.pdf',
    type: 'PDF',
    size: '2.5 MB',
    uploadedAt: '2024-03-20T10:30:00Z',
    status: 'completed',
    userId: '1'
  },
  {
    id: '2',
    name: 'Property Inspection Report.docx',
    type: 'DOCX',
    size: '1.8 MB',
    uploadedAt: '2024-03-19T15:45:00Z',
    status: 'pending',
    userId: '1'
  }
];

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(documents);
}

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newDocument = {
      id: String(documents.length + 1),
      name: data.name,
      type: data.type,
      size: data.size,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      userId: '1' // In a real app, this would come from the session
    };

    documents.push(newDocument);
    return NextResponse.json(newDocument, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}

// DELETE endpoint
export async function DELETE(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    const documentIndex = documents.findIndex(doc => doc.id === id);
    if (documentIndex === -1) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    documents = documents.filter(doc => doc.id !== id);
    return NextResponse.json({ message: 'Document deleted' });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
} 