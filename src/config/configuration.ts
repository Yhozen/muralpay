import z from "zod";

const configurationSchema = z.object({
    PORT: z.number().default(3000),
    DATABASE_URL: z.url(),
    HARDCODED_API_KEY: z.string().min(10)
});

export type ConfigurationSchema = z.infer<typeof configurationSchema>;

export const loadConfiguration = () => configurationSchema.parse(process.env);
