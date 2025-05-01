// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import Dither from "@/components/Dither/Dither";

// const HighQualityDitherRecorder = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [countdown, setCountdown] = useState(3);
//   const [progress, setProgress] = useState(0);
//   const [frames, setFrames] = useState<Blob[]>([]);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const containerRef = useRef<HTMLDivElement>(null);
//   const animationRef = useRef<number | null>(null);

//   // Configurable recording parameters
//   const TARGET_FPS = 30;
//   const WAVE_FREQUENCY = 0.025;

//   // Calculate loop duration based on wave frequency
//   const LOOP_DURATION = Math.round((1 / WAVE_FREQUENCY) * 1000);
//   const TOTAL_FRAMES = Math.round(TARGET_FPS * (LOOP_DURATION / 1000) * 1);

//   // Animation settings with dynamic loop duration
//   const animationSettings = {
//     waveSpeed: 0.05,
//     waveFrequency: 3,
//     waveAmplitude: 0.55,
//     waveColor: [0.5, 0.5, 0.5] as [number, number, number],
//     colorNum: 4,
//     disableAnimation: false,
//     enableMouseInteraction: false,
//     mouseRadius: 0.3,
//     targetFPS: TARGET_FPS,
//     loopDuration: LOOP_DURATION / 1000, // Convert to seconds
//   };

//   // Countdown and recording preparation
//   const startRecording = async () => {
//     setIsRecording(true);
//     setFrames([]);
//     setProgress(0);

//     // Countdown
//     for (let i = 3; i > 0; i--) {
//       setCountdown(i);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }
//     setCountdown(0);
//     captureFrames();
//   };

//   // Advanced frame capture with precise timing
//   const captureFrames = () => {
//     const capturedFrames: Blob[] = [];
//     const canvas = containerRef.current?.querySelector("canvas");

//     if (!canvas) {
//       console.error("Canvas not found");
//       setIsRecording(false);
//       return;
//     }

//     const startTime = performance.now();

//     const captureFrame = (currentTime: number) => {
//       const elapsedTime = currentTime - startTime;

//       // Stop capturing after exact loop duration
//       if (
//         elapsedTime >= LOOP_DURATION ||
//         capturedFrames.length >= TOTAL_FRAMES
//       ) {
//         setFrames(capturedFrames);
//         setIsRecording(false);
//         setIsProcessing(true);
//         return;
//       }

//       // Capture high-quality frame
//       (canvas as HTMLCanvasElement).toBlob(
//         (blob) => {
//           if (blob) {
//             capturedFrames.push(blob);
//             setProgress(
//               Math.round((capturedFrames.length / TOTAL_FRAMES) * 100),
//             );
//           }

//           // Schedule next frame capture
//           requestAnimationFrame(captureFrame);
//         },
//         "image/jpeg",
//         0.95, // High quality
//       );
//     };

//     requestAnimationFrame(captureFrame);
//   };

//   // Process frames into a downloadable format
//   const processFrames = async () => {
//     if (frames.length === 0) return;

//     const JSZip = (await import("jszip")).default;
//     const zip = new JSZip();

//     // Create numbered frames in zip
//     frames.forEach((frame, index) => {
//       const paddedIndex = String(index).padStart(6, "0");
//       zip.file(`frame_${paddedIndex}.jpg`, frame);
//     });

//     const zipBlob = await zip.generateAsync({ type: "blob" });
//     const zipUrl = URL.createObjectURL(zipBlob);

//     // Trigger download
//     const a = document.createElement("a");
//     a.href = zipUrl;
//     a.download = "dither-animation-frames.zip";
//     a.click();

//     setIsProcessing(false);

//     // Provide conversion instructions
//     alert(
//       `Frames downloaded as zip. To create MP4, use:\n\n` +
//         `ffmpeg -framerate ${TARGET_FPS} -i frame_%06d.jpg -c:v libx264 -pix_fmt yuv420p -t ${LOOP_DURATION / 1000} dither-animation.mp4`,
//     );
//   };

//   // Process frames when recording completes
//   useEffect(() => {
//     if (frames.length > 0 && isProcessing) {
//       processFrames();
//     }
//   }, [frames, isProcessing]);

//   // Cleanup animation frames
//   useEffect(() => {
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div className="flex flex-col items-center gap-6 w-full">
//       <div
//         ref={containerRef}
//         className="w-full h-screen relative rounded overflow-hidden"
//       >
//         <Dither {...animationSettings} />

//         {/* Countdown Overlay */}
//         {isRecording && countdown > 0 && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-6xl font-bold">
//             {countdown}
//           </div>
//         )}

//         {/* Recording Progress Overlay */}
//         {isRecording && countdown === 0 && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
//             <div className="bg-white p-4 rounded-lg shadow-lg text-center">
//               <div className="text-xl font-semibold">
//                 Recording: {progress}%
//               </div>
//               <div className="w-64 h-3 bg-gray-200 rounded-full mt-2">
//                 <div
//                   className="h-full bg-blue-600 rounded-full"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Processing Overlay */}
//         {isProcessing && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
//             <div className="bg-white p-4 rounded-lg shadow-lg">
//               <div className="text-xl font-semibold">Processing frames...</div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="flex gap-4 items-center">
//         <button
//           onClick={startRecording}
//           disabled={isRecording || isProcessing}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
//         >
//           {isRecording
//             ? "Recording..."
//             : isProcessing
//               ? "Processing..."
//               : "Record High-Quality Animation"}
//         </button>

//         <div className="text-sm text-gray-600 max-w-md">
//           Captures {Math.round(TOTAL_FRAMES)} frames at {TARGET_FPS} FPS for a
//           precise {LOOP_DURATION / 1000} second animation loop.
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default HighQualityDitherRecorder;
