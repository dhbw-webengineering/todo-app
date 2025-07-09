import 'dotenv/config';
import { z } from 'zod'

const envSchema = z.object({
    NEXT_PUBLIC_BACKEND_BASE_PATH: z.string()
})

export const e = envSchema.parse({
  NEXT_PUBLIC_BACKEND_BASE_PATH: process.env.NEXT_PUBLIC_BACKEND_BASE_PATH
});