// ponytail: in-memory only. Add a DB/email handler when real messages matter.
export async function POST(request: Request) {
  const body = await request.json();
  console.log('[contact]', JSON.stringify(body, null, 2));
  return Response.json({ ok: true });
}