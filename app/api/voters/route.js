import voters from "@/public/voters.json";

export async function GET(req) {
  return Response.json(voters);
}
