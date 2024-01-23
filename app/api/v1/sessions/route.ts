const hostURL = process.env.MOONSHOT_API_URL || 'http://localhost:5000';
const basePath = '/v1/sessions';

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(`${hostURL}${basePath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response;
}

export async function GET() {
  const response = await fetch(`${hostURL}${basePath}`);
  return response;
}
