import { NextResponse } from 'next/server';

const OLLAMA_API_URL = 'http://127.0.0.1:11434/api/chat';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Ollama responded with status " + response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Server Route Ollama Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to local Ollama instance." },
      { status: 500 }
    );
  }
}
