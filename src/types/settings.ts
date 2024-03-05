import { z } from 'zod';

export const SettingsSchema = z.object({
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  stepTime: z.number().min(1),
  withWeekend: z.boolean(),
});

export interface Settings extends z.infer<typeof SettingsSchema> {}
export interface SettingsUpdate extends Partial<Settings> {}
