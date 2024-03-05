import { uuidv7 } from '@kripod/uuidv7';
import { useStore } from '@nanostores/react';
import { UUID } from 'crypto';
import { atom, onMount } from 'nanostores';

import type {
  Item,
  ItemCreation,
  Schedule,
  ScheduleCreation,
} from '@/types/schedule';

const SCHEDULES_KEY = 'schedules';

const $schedules = atom<Schedule[]>([]);
const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const sortItems = (items: Item[]) => {
  return items.sort((a, b) => {
    const dayOrderA = dayOrder.indexOf(a.day);
    const dayOrderB = dayOrder.indexOf(b.day);
    const startA = a.start.split(':').map(Number);
    const startB = b.start.split(':').map(Number);
    const endA = a.end.split(':').map(Number);
    const endB = b.end.split(':').map(Number);
    const startTotalMinutesA = startA[0] * 60 + startA[1];
    const startTotalMinutesB = startB[0] * 60 + startB[1];
    const endTotalMinutesA = endA[0] * 60 + endA[1];
    const endTotalMinutesB = endB[0] * 60 + endB[1];
    return (
      dayOrderA - dayOrderB ||
      startTotalMinutesA - startTotalMinutesB ||
      endTotalMinutesA - endTotalMinutesB
    );
  });
};

const addSchedule = (schedule: ScheduleCreation) => {
  $schedules.set([...$schedules.get(), { ...schedule, id: uuidv7() }]);
  window.localStorage.setItem(SCHEDULES_KEY, JSON.stringify($schedules.get()));
};

const removeSchedule = (id: UUID) => {
  $schedules.set($schedules.get().filter((item) => item.id !== id));
  window.localStorage.setItem(SCHEDULES_KEY, JSON.stringify($schedules.get()));
};

const clearSchedule = () => {
  $schedules.set([]);
  window.localStorage.removeItem(SCHEDULES_KEY);
};

const updateSchedule = (id: UUID, schedule: Schedule) => {
  $schedules.set(
    $schedules.get().map((item) => (item.id === id ? schedule : item))
  );
  window.localStorage.setItem(SCHEDULES_KEY, JSON.stringify($schedules.get()));
};

const addScheduleItem = (scheduleId: UUID, item: ItemCreation) => {
  $schedules.set(
    $schedules.get().map((schedule) => {
      if (schedule.id === scheduleId) {
        schedule.items.push({ ...item, id: uuidv7() });
        schedule.items = sortItems(schedule.items);
      }
      return schedule;
    })
  );
  window.localStorage.setItem(SCHEDULES_KEY, JSON.stringify($schedules.get()));
};

const removeScheduleItem = (scheduleId: UUID, itemId: UUID) => {
  $schedules.set(
    $schedules.get().map((schedule) => {
      if (schedule.id === scheduleId) {
        schedule.items = schedule.items.filter((item) => item.id !== itemId);
      }
      return schedule;
    })
  );
  window.localStorage.setItem(SCHEDULES_KEY, JSON.stringify($schedules.get()));
};

const clearScheduleItem = (scheduleId: UUID) => {
  $schedules.set(
    $schedules.get().map((schedule) => {
      if (schedule.id === scheduleId) {
        schedule.items = [];
      }
      return schedule;
    })
  );
  window.localStorage.setItem(SCHEDULES_KEY, JSON.stringify($schedules.get()));
};

export const useSchedules = () => {
  const schedules = useStore($schedules);

  onMount($schedules, () => {
    if (typeof window === 'undefined') return;
    const schedules = window.localStorage.getItem(SCHEDULES_KEY);
    if (schedules) {
      $schedules.set(JSON.parse(schedules));
    }
  });

  return {
    schedules,
    action: {
      addSchedule,
      removeSchedule,
      clearSchedule,
      updateSchedule,
      addScheduleItem,
      removeScheduleItem,
      clearScheduleItem,
    },
  };
};
