import { useStore } from '@nanostores/react';
import { map, onMount } from 'nanostores';

import { Settings } from '@/types/settings';

const SETTINGS_KEY = 'settings';

const $settings = map<Settings>({
  startTime: '09:00',
  endTime: '17:00',
  stepTime: 30,
  withWeekend: false,
});

const updateStartTime = (startTime: string) => {
  $settings.setKey('startTime', startTime);
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify($settings.get()));
};

const updateEndTime = (endTime: string) => {
  $settings.setKey('endTime', endTime);
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify($settings.get()));
};

const updateStepTime = (stepTime: number) => {
  $settings.setKey('stepTime', stepTime);
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify($settings.get()));
};

const updateWithWeekend = (withWeekend: boolean) => {
  $settings.setKey('withWeekend', withWeekend);
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify($settings.get()));
};

export const useSettings = () => {
  const settings = useStore($settings);

  onMount($settings, () => {
    if (typeof window === 'undefined') return;

    const settings = window.localStorage.getItem(SETTINGS_KEY);
    if (settings) {
      $settings.set(JSON.parse(settings));
    }
  });

  return {
    settings,
    action: {
      updateStartTime,
      updateEndTime,
      updateStepTime,
      updateWithWeekend,
    },
  };
};
