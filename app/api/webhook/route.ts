export const POST = async (req: Request) => {
  const body = await req.json();
  console.log("body", JSON.stringify(body));

  return new Response(JSON.stringify({ message: "Webhook received", body }));
};
