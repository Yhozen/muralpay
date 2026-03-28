import z from 'zod';

const configurationSchema = z.object({
  PORT: z.number().default(3000),
  DATABASE_URL: z.url(),
  MURALPAY_API_KEY: z.string(),
  MURAL_TRANSFER_API_KEY: z.string(),
});

export type ConfigurationSchema = z.infer<typeof configurationSchema>;

export const loadConfiguration = () => configurationSchema.parse(process.env);
