'use client';

import { useSettings } from '@/stores/settings';
import { Settings as SettingsIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const { settings, action } = useSettings();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon className="size-[1.6rem]" />
          <span className="sr-only">Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Settings</h4>
            <p className="text-sm text-muted-foreground">
              Customize the schedule view
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="startTime">Start time</Label>
              <Input
                id="startTime"
                type="time"
                defaultValue="09:00"
                className="col-span-2 h-8"
                value={settings.startTime}
                onChange={(e) => action.updateStartTime(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="endTime">End time</Label>
              <Input
                id="endTime"
                type="time"
                defaultValue="17:00"
                className="col-span-2 h-8"
                value={settings.endTime}
                onChange={(e) => action.updateEndTime(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="stepTime">Step</Label>
              <Input
                id="stepTime"
                type="number"
                defaultValue="30"
                step={15}
                className="col-span-2 h-8"
                value={settings.stepTime}
                onChange={(e) => action.updateStepTime(Number(e.target.value))}
              />
            </div>
            <div className="grid h-8 grid-cols-3 items-center gap-4">
              <Label htmlFor="withWeekend">With weekend</Label>
              <Switch
                id="withWeekend"
                checked={settings.withWeekend}
                onCheckedChange={(e) => action.updateWithWeekend(e)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Settings;
