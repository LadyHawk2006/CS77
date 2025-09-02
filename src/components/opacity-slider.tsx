'use client';

import { useBackgroundSettings } from '@/hooks/use-background-settings';

export function OpacitySlider() {
  const { opacity, setOpacity } = useBackgroundSettings();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="opacity-slider" className="text-sm font-medium text-white">
        Opacity
      </label>
      <input
        id="opacity-slider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={opacity}
        onChange={(e) => setOpacity(parseFloat(e.target.value))}
        className="w-32"
      />
    </div>
  );
}
