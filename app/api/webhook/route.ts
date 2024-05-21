export const POST = async (req: Request) => {
  const body = await req.json();
  console.log("body", JSON.stringify(body));

  return new Response(JSON.stringify({ message: "Webhook received", body }));
};


// HMAC: D374028D90B0E74EB35663679DFFFC3B6F1C143FC3030B6839A42B675017CC85