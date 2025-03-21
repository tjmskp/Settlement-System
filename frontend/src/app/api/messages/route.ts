import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  conversationId: string;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  unread: number;
}

interface StreamData {
  conversations: Conversation[];
  messages: Message[];
}

// Mock messages database
const messages: Message[] = [
  {
    id: '1',
    content: "Hello, I've received your settlement documents.",
    sender: 'John Smith',
    timestamp: '2024-03-20T10:30:00Z',
    conversationId: '1'
  },
  {
    id: '2',
    content: 'Great, thank you for confirming.',
    sender: 'You',
    timestamp: '2024-03-20T10:35:00Z',
    conversationId: '1'
  }
];

// Mock conversations database
const conversations: Conversation[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Settlement Agent',
    lastMessage: "I've reviewed the documents you sent.",
    unread: 2
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Legal Advisor',
    lastMessage: 'The contract looks good to proceed.',
    unread: 0
  }
];

// GET conversations
export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const headersList = headers();
  const accept = headersList.get('accept');

  // Handle SSE connection for real-time updates
  if (accept === 'text/event-stream') {
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const sendMessage = (data: StreamData) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // Send initial data
        sendMessage({ conversations, messages });

        // In a real app, you would set up a proper event listener here
        // For demo purposes, we'll send updates every 30 seconds
        const interval = setInterval(() => {
          sendMessage({ conversations, messages });
        }, 30000);

        // Cleanup
        return () => {
          clearInterval(interval);
        };
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  }

  // Regular GET request
  return NextResponse.json({
    conversations,
    messages
  });
}

// POST new message
export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newMessage: Message = {
      id: String(messages.length + 1),
      content: data.content,
      sender: 'You',
      timestamp: new Date().toISOString(),
      conversationId: data.conversationId
    };

    messages.push(newMessage);

    // Update conversation's last message
    const conversation = conversations.find(c => c.id === data.conversationId);
    if (conversation) {
      conversation.lastMessage = data.content;
      conversation.unread = 0; // Reset unread count for sender
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// PUT update conversation (mark as read)
export async function PUT(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('id');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    conversation.unread = 0;
    return NextResponse.json(conversation);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
} 