import { CSSProperties } from "react";

type GrainientProps = {
  color1?: string;
  color2?: string;
  color3?: string;
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  centerX?: number;
  centerY?: number;
  zoom?: number;
};

export default function Grainient({
  color1 = "#060010",
  color2 = "#200e62",
  color3 = "#B19EEF",
  timeSpeed = 0.25,
  colorBalance = -0.11,
  warpStrength = 1,
  warpFrequency = 5,
  warpSpeed = 2,
  warpAmplitude = 50,
  blendAngle = 0,
  blendSoftness = 0.05,
  rotationAmount = 500,
  noiseScale = 2,
  grainAmount = 0.1,
  grainScale = 2,
  grainAnimated = false,
  contrast = 1.5,
  gamma = 1,
  saturation = 1,
  centerX = 0,
  centerY = 0,
  zoom = 0.9
}: GrainientProps) {
  const style = {
    "--grainient-color-1": color1,
    "--grainient-color-2": color2,
    "--grainient-color-3": color3,
    "--grainient-speed": `${Math.max(timeSpeed, 0.01) * 18}s`,
    "--grainient-balance": `${colorBalance * 100}%`,
    "--grainient-warp-strength": `${Math.max(warpStrength, 0.1)}`,
    "--grainient-warp-frequency": `${Math.max(warpFrequency, 0.5)}`,
    "--grainient-warp-speed": `${Math.max(warpSpeed, 0.1)}`,
    "--grainient-warp-amplitude": `${warpAmplitude}px`,
    "--grainient-angle": `${blendAngle}deg`,
    "--grainient-softness": `${Math.max(blendSoftness, 0.01) * 100}%`,
    "--grainient-rotation": `${rotationAmount}deg`,
    "--grainient-noise-scale": `${Math.max(noiseScale, 0.5) * 120}px`,
    "--grainient-grain-opacity": `${Math.max(grainAmount, 0.01)}`,
    "--grainient-grain-scale": `${Math.max(grainScale, 0.5)}`,
    "--grainient-contrast": `${contrast}`,
    "--grainient-gamma": `${gamma}`,
    "--grainient-saturation": `${saturation}`,
    "--grainient-center-x": `${50 + centerX * 18}%`,
    "--grainient-center-y": `${45 + centerY * 18}%`,
    "--grainient-zoom": `${zoom}`,
    "--grainient-grain-animation": grainAnimated ? "grainientNoiseShift 8s steps(6) infinite" : "none"
  } as CSSProperties;

  return (
    <div aria-hidden="true" className="grainient" style={style}>
      <div className="grainient-color-layer grainient-color-layer-base" />
      <div className="grainient-color-layer grainient-color-layer-glow" />
      <div className="grainient-noise" />
    </div>
  );
}
