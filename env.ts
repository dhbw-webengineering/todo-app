import 'dotenv/config';
import { z } from 'zod'

const envSchema = z.object({
    NEXT_PUBLIC_BACKEND_BASE_PATH: z.string().default("http://localhost:3001")
})

export const e = envSchema.parse(process.env)
