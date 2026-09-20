import { z } from "zod";
export declare const HealthCheckResponse: z.ZodObject<{
    status: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: string;
}, {
    status: string;
}>;
export type HealthCheckResponse = z.infer<typeof HealthCheckResponse>;
