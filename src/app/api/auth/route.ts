import { handlers } from "@/auth";

//destructure GET and POST because Next.js App Router specifically looks for these named exports
export const { GET, POST } = handlers;
