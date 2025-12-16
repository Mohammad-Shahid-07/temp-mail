import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  // We expect calls like /api/mailsac/addresses/bob@mailsac.com/messages
  // So we need to strip /api/mailsac from the path to get the upstream path
  
  // This is a bit hacky. Let's assume the client passes the full path segment they want.
  // Actually, let's just use query params to define the endpoint for simplicity in the proxy.
  // ?endpoint=addresses/bob@mailsac.com/messages
  
  const endpoint = searchParams.get('endpoint');
  if (!endpoint) {
     return NextResponse.json({ error: 'Missing endpoint param' }, { status: 400 });
  }

  const apiUrl = `https://mailsac.com/api/${endpoint}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: response.status }
      );
    }

    // Mailsac returns JSON usually, but sometimes text for body
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return NextResponse.json(data);
    } else {
        const text = await response.text();
        return new NextResponse(text);
    }

  } catch (error) {
    console.error('Mailsac Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
