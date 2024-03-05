import { ModeToggle } from '@/components/ModeToggle';
import Schedule from '@/components/Schedule';
import Settings from '@/components/Settings';

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-16">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-semibold">Schedule Customize</h1>
        <div className="flex items-center justify-between gap-4">
          <ModeToggle />
          <Settings />
        </div>
      </div>
      <Schedule />
    </main>
  );
}
