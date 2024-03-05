'use client';

import { cn } from '@/lib/utils';
import { useSchedules } from '@/stores/schedule';
import { useSettings } from '@/stores/settings';
import { UUID } from 'crypto';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';

import AddScheduleDialog from '@/components/AddScheduleDialog';

interface CalendarGridProps {
  children?: React.ReactNode;
  settings: ReturnType<typeof useSettings>['settings'];
  colCount: number;
  days: string[];
}

const CalendarGrid = ({
  children,
  settings,
  colCount,
  days,
}: CalendarGridProps): JSX.Element => {
  const calculateTimeByCol = (col: number) => {
    const [startHour, startMinute] = settings.startTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const totalMinutes = startTotalMinutes + settings.stepTime * col;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl">
      <AspectRatio
        className="relative size-full justify-between"
        ratio={16 / 9}
      >
        <div className="absolute left-0 top-0 size-full">
          {Array.from({ length: colCount + 2 }).map((_, index) => (
            <Separator
              orientation="vertical"
              key={index}
              className="absolute top-0 h-full"
              style={{
                left: `${index * (100 / (colCount + 1))}%`,
              }}
            />
          ))}
        </div>
        <div className="absolute left-0 top-0 size-full">
          {Array.from({ length: days.length + 2 }).map((_, index) => (
            <Separator
              orientation="horizontal"
              key={index}
              className="absolute left-0 w-full"
              style={{
                top: `${index * (100 / (days.length + 1))}%`,
              }}
            />
          ))}
        </div>
        {days.map((day, index) => (
          <div
            key={index}
            className="absolute left-0 flex items-center justify-center text-center"
            style={{
              top: `${(index + 1) * (100 / (days.length + 1))}%`,
              width: `${100 / (colCount + 1)}%`,
              height: `${100 / (days.length + 1)}%`,
            }}
          >
            {day}
          </div>
        ))}
        {Array.from({ length: colCount }).map((_, index) => (
          <div
            key={index}
            className="absolute top-0 flex items-end justify-start text-center"
            style={{
              left: `${(index + 1) * (100 / (colCount + 1))}%`,
              width: `${100 / (colCount + 1)}%`,
              height: `${100 / (days.length + 1)}%`,
            }}
          >
            {calculateTimeByCol(index)}
          </div>
        ))}
        {children}
      </AspectRatio>
    </div>
  );
};

const Schedule = () => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [colCount, setColCount] = useState<number>(0);
  const [days, setDays] = useState<string[]>([
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
    'SUN',
  ]);
  const { settings } = useSettings();

  const calculateColCount = (start: string, end: string, step: number) => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const totalMinutes = endTotalMinutes - startTotalMinutes;
    return totalMinutes / step;
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setColCount(
      calculateColCount(settings.startTime, settings.endTime, settings.stepTime)
    );
  }, [settings.endTime, settings.startTime, settings.stepTime]);

  useEffect(() => {
    setDays(
      settings.withWeekend
        ? ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
        : ['MON', 'TUE', 'WED', 'THU', 'FRI']
    );
  }, [settings.withWeekend]);

  const {
    schedules,
    action: { clearSchedule, removeSchedule },
  } = useSchedules();

  return (
    <section className="flex w-full flex-col gap-8">
      {isClient && (
        <CalendarGrid settings={settings} colCount={colCount} days={days}>
          {schedules.map((schedule) => {
            return schedule.items.map((item) => {
              const start = item.start.split(':').map(Number);
              const end = item.end.split(':').map(Number);
              const startTotalMinutes = start[0] * 60 + start[1];
              const endTotalMinutes = end[0] * 60 + end[1];
              const totalMinutes = endTotalMinutes - startTotalMinutes;
              const colSpan = totalMinutes / settings.stepTime;
              const rowStart = 1 + days.indexOf(item.day);
              const colStart =
                1 +
                calculateColCount(
                  settings.startTime,
                  item.start,
                  settings.stepTime
                );

              return (
                <div
                  key={item.id}
                  className={cn(
                    'absolute flex flex-col items-center justify-center rounded-lg border bg-card p-2 text-card-foreground shadow-sm',
                    {
                      red: [
                        'border-custom-red bg-custom-red/20 text-custom-red',
                      ],
                      rose: [
                        'border-custom-rose bg-custom-rose/20 text-custom-rose',
                      ],
                      orange: [
                        'border-custom-orange bg-custom-orange/20 text-custom-orange',
                      ],
                      green: [
                        'border-custom-green bg-custom-green/20 text-custom-green',
                      ],
                      blue: [
                        'border-custom-blue bg-custom-blue/20 text-custom-blue',
                      ],
                      yellow: [
                        'border-custom-yellow bg-custom-yellow/20 text-custom-yellow',
                      ],
                      purple: [
                        'border-custom-purple bg-custom-purple/20 text-custom-purple',
                      ],
                    }[schedule.color]
                  )}
                  style={{
                    top: `${rowStart * (100 / (days.length + 1))}%`,
                    left: `${colStart * (100 / (colCount + 1))}%`,
                    width: `${colSpan * (100 / (colCount + 1))}%`,
                    height: `${100 / (days.length + 1)}%`,
                  }}
                >
                  <h3 className="line-clamp-1 text-center text-xl font-semibold tracking-tight">
                    {schedule.title}
                  </h3>
                  <p
                    className={cn(
                      'line-clamp-1 text-center',
                      {
                        red: ['text-custom-red/80'],
                        rose: ['text-custom-rose/80'],
                        orange: ['text-custom-orange/80'],
                        green: ['text-custom-green/80'],
                        blue: ['text-custom-blue/80'],
                        yellow: ['text-custom-yellow/80'],
                        purple: ['text-custom-purple/80'],
                      }[schedule.color]
                    )}
                  >
                    {schedule.description}
                  </p>
                </div>
              );
            });
          })}
        </CalendarGrid>
      )}
      <div className="col-span-2 mt-8 flex w-full items-center justify-center gap-4">
        <Button onClick={clearSchedule} variant="outline">
          Clear Schedules
        </Button>
        <AddScheduleDialog />
      </div>
      <div className="grid grid-cols-3 place-items-center gap-4">
        {isClient &&
          schedules.map((schedule) => {
            return (
              <Card
                key={schedule.id}
                className="group relative size-full min-w-[380px]"
              >
                <CardHeader>
                  <CardTitle>{schedule.title}</CardTitle>
                  <CardDescription>{schedule.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between px-4">
                    <p>Day</p>
                    <p>Start</p>
                    <p>End</p>
                  </div>
                  {schedule.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative flex items-center justify-between rounded-md border p-4"
                    >
                      <p>{item.day}</p>
                      <Separator orientation="vertical" />
                      <p>{item.start}</p>
                      <Separator orientation="vertical" />
                      <p>{item.end}</p>
                    </div>
                  ))}
                </CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="absolute right-0 top-0 hidden -translate-y-1/2 translate-x-1/2 group-hover:block"
                    >
                      <Trash />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone.
                        <br />
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        onClick={() => removeSchedule(schedule.id as UUID)}
                        variant="destructive"
                      >
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Card>
            );
          })}
      </div>
    </section>
  );
};

export default Schedule;
