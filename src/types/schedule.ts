import { z } from 'zod';

export const ItemSchema = z.object({
  id: z.string().uuid(),
  day: z.enum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']),
  start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
});

export const ScheduleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(20),
  description: z.string().max(50),
  items: z.array(ItemSchema).min(1),
  color: z
    .enum(['red', 'rose', 'orange', 'green', 'blue', 'yellow', 'purple'])
    .or(z.string().regex(/^#[0-9a-f]{6}$/)),
});

export const ScheduleCreationSchema = ScheduleSchema.omit({ id: true });
export interface Item extends z.infer<typeof ItemSchema> {}
export interface ItemCreation extends Omit<Item, 'id'> {}
export interface Schedule extends z.infer<typeof ScheduleSchema> {}
export interface ScheduleCreation extends Omit<Schedule, 'id'> {}
