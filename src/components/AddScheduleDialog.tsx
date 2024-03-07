import { cn } from '@/lib/utils';
import { useSchedules } from '@/stores/schedule';
import { zodResolver } from '@hookform/resolvers/zod';
import { uuidv7 } from '@kripod/uuidv7';
import { UUID } from 'crypto';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';

import { ScheduleCreation, ScheduleCreationSchema } from '@/types/schedule';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const colors = {
  red: ['bg-custom-red', 'ring-custom-red'],
  rose: ['bg-custom-rose', 'ring-custom-rose'],
  orange: ['bg-custom-orange', 'ring-custom-orange'],
  green: ['bg-custom-green', 'ring-custom-green'],
  blue: ['bg-custom-blue', 'ring-custom-blue'],
  yellow: ['bg-custom-yellow', 'ring-custom-yellow'],
  purple: ['bg-custom-purple', 'ring-custom-purple'],
};

interface FieldProps {
  control: ReturnType<typeof useForm<ScheduleCreation>>['control'];
}
interface FieldPropsWithIndex extends FieldProps {
  index: number;
}

const TitleFormField = ({ control }: FieldProps): JSX.Element => (
  <FormField
    control={control}
    name="title"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Title</FormLabel>
        <FormControl>
          <Input placeholder="ABC Class" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const DescriptionFormField = ({ control }: FieldProps): JSX.Element => (
  <FormField
    control={control}
    name="description"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Input placeholder="Room 999 | XYZ Building" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const ColorFormField = ({ control }: FieldProps): JSX.Element => (
  <FormField
    control={control}
    name="color"
    render={({ field }) => (
      <FormItem className="space-y-3">
        <FormLabel>Color</FormLabel>
        <FormControl>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex w-full items-center gap-6"
          >
            {Object.entries(colors).map(([key, value]) => (
              <FormItem
                key={key}
                className="flex items-center justify-center text-center"
              >
                <FormControl>
                  <RadioGroupItem
                    id={key}
                    value={key}
                    className="peer hidden"
                  />
                </FormControl>
                <FormLabel
                  htmlFor={key}
                  className={cn(
                    'flex size-0 cursor-pointer rounded-full p-3 leading-none peer-aria-checked:ring-4',
                    value[0],
                    value[1]
                  )}
                ></FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const DayFormField = ({ control, index }: FieldPropsWithIndex): JSX.Element => (
  <FormField
    control={control}
    name={`items.${index}.day`}
    render={({ field }) => (
      <FormItem className="w-full pl-1">
        <FormLabel>Day</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="MON">Monday</SelectItem>
            <SelectItem value="TUE">Tuesday</SelectItem>
            <SelectItem value="WED">Wednesday</SelectItem>
            <SelectItem value="THU">Thursday</SelectItem>
            <SelectItem value="FRI">Friday</SelectItem>
            <SelectItem value="SAT">Saturday</SelectItem>
            <SelectItem value="SUN">Sunday</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>
    )}
  />
);

const StartFormField = ({
  control,
  index,
}: FieldPropsWithIndex): JSX.Element => (
  <FormField
    control={control}
    name={`items.${index}.start`}
    render={({ field }) => (
      <FormItem className="w-full">
        <FormLabel>Start</FormLabel>
        <FormControl>
          <Input placeholder="09:00" type="time" {...field} />
        </FormControl>
      </FormItem>
    )}
  />
);

const EndFormField = ({ control, index }: FieldPropsWithIndex): JSX.Element => (
  <FormField
    control={control}
    name={`items.${index}.end`}
    render={({ field }) => (
      <FormItem className="w-full pr-1">
        <FormLabel>End</FormLabel>
        <FormControl>
          <Input placeholder="10:00" type="time" {...field} />
        </FormControl>
      </FormItem>
    )}
  />
);

const AddItemButton = ({ onClick }: { onClick: () => void }): JSX.Element => (
  <Button
    type="button"
    onClick={onClick}
    className="ml-auto flex"
    variant="default"
  >
    Add Item
  </Button>
);

const AddForm = ({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}): JSX.Element => {
  const [itemCount, setItemCount] = useState<number>(1);
  const {
    schedules,
    action: { addSchedule },
  } = useSchedules();

  const resolver: Resolver<ScheduleCreation, any> = async (
    values,
    context,
    options
  ) => {
    const result = await zodResolver(ScheduleCreationSchema)(
      values,
      context,
      options
    );
    const items = values.items;
    for (let i = 0; i < items.length; i++) {
      const start = new Date(`1970-01-01T${items[i].start}`);
      const end = new Date(`1970-01-01T${items[i].end}`);
      if (start >= end) {
        result.errors = {
          ...result.errors,
          items: {
            type: 'custom',
            message: 'Start time must be before end time',
          },
        };
      }
      for (let j = i + 1; j < items.length; j++) {
        if (items[i].day !== items[j].day) continue;
        const start2 = new Date(`1970-01-01T${items[j].start}`);
        const end2 = new Date(`1970-01-01T${items[j].end}`);
        if (
          (start >= start2 && start < end2) ||
          (end > start2 && end <= end2) ||
          (start2 >= start && start2 < end) ||
          (end2 > start && end2 <= end)
        ) {
          result.errors = {
            ...result.errors,
            items: {
              type: 'custom',
              message: `Self overlapping: ${items[i].day}, ${items[i].start} - ${items[i].end} overlaps with ${items[j].start} - ${items[j].end}`,
            },
          };
        }
      }
    }
    for (let i = 0; i < schedules.length; i++) {
      for (let j = 0; j < schedules[i].items.length; j++) {
        for (let k = 0; k < items.length; k++) {
          if (schedules[i].items[j].day === items[k].day) {
            const start = new Date(`1970-01-01T${schedules[i].items[j].start}`);
            const end = new Date(`1970-01-01T${schedules[i].items[j].end}`);
            const start2 = new Date(`1970-01-01T${items[k].start}`);
            const end2 = new Date(`1970-01-01T${items[k].end}`);
            if (
              (start >= start2 && start < end2) ||
              (end > start2 && end <= end2) ||
              (start2 >= start && start2 < end) ||
              (end2 > start && end2 <= end)
            ) {
              result.errors = {
                ...result.errors,
                items: {
                  type: 'custom',
                  message: `Overlapping: ${items[k].day}, ${items[k].start} - ${items[k].end} overlaps with ${schedules[i].title}'s at ${schedules[i].items[j].start} - ${schedules[i].items[j].end}`,
                },
              };
            }
          }
        }
      }
    }
    return result;
  };

  const form = useForm<ScheduleCreation>({
    defaultValues: {
      title: '',
      description: '',
      color: 'red',
      items: [
        {
          id: uuidv7(),
          day: 'MON',
          start: '09:00',
          end: '10:00',
        },
      ],
    },
    resolver,
  });

  const onSubmit = (values: ScheduleCreation) => {
    addSchedule(values);
    onOpenChange(false);
    form.reset();
  };

  const addItem = () => {
    setItemCount(itemCount + 1);
    form.setValue('items', [
      ...form.watch('items'),
      {
        id: uuidv7(),
        day: 'MON',
        start: '09:00',
        end: '10:00',
      },
    ]);
  };

  const removeItem = (id: UUID) => {
    setItemCount(itemCount - 1);
    form.setValue(
      'items',
      form.watch('items').filter((item) => item.id !== id)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <TitleFormField control={form.control} />
        <DescriptionFormField control={form.control} />
        <ColorFormField control={form.control} />
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <FormLabel>Items</FormLabel>
              <FormMessage />
              <ScrollArea className="flex max-h-48 w-full flex-col pr-4">
                {form.watch('items').map(({ id }, index) => (
                  <FormField
                    key={id}
                    control={form.control}
                    name={`items.${index}`}
                    render={() => (
                      <FormItem className="relative grid w-full grid-cols-3 place-items-center items-center justify-between gap-2">
                        <DayFormField control={form.control} index={index} />
                        <StartFormField control={form.control} index={index} />
                        <EndFormField control={form.control} index={index} />
                        <FormMessage className="col-span-3 w-full" />
                        {form.watch('items').length > 1 && (
                          <Button
                            variant="ghost"
                            className="absolute right-0 top-0 size-fit"
                            type="button"
                            onClick={() => removeItem(id as UUID)}
                          >
                            <X size={16} />
                          </Button>
                        )}
                      </FormItem>
                    )}
                  />
                ))}
              </ScrollArea>
            </FormItem>
          )}
        />
        <AddItemButton onClick={addItem} />
        <DialogFooter className="flex w-full gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="w-full">
            Add Schedule
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

const AddScheduleDialog = (): JSX.Element => {
  const [open, onOpenChange] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex w-full items-center justify-center text-center">
          Add New Schedule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new schedule</DialogTitle>
          <DialogDescription>
            Add a new schedule to your list.
          </DialogDescription>
        </DialogHeader>
        <AddForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleDialog;
