'use client';

import { useEffect, useRef } from 'react';
import '@google/model-viewer';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface Model3DViewerProps {
  modelUrl: string;
  productName: string;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
}

export function Model3DViewer({ modelUrl, productName, dimensions }: Model3DViewerProps) {
  const modelViewerRef = useRef<any>(null);

  // No auto-calculation - we use admin-provided dimensions directly
  // Dimensions are already in the hotspot labels below

  const fullModelUrl = modelUrl.startsWith('http') 
    ? modelUrl 
    : `${process.env.NEXT_PUBLIC_API_URL}${modelUrl}`;

  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[500px]">
      <model-viewer
        ref={modelViewerRef}
        src={fullModelUrl}
        alt={`3D model of ${productName}`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        touch-action="pan-y"
        shadow-intensity="1"
        camera-orbit="-30deg auto auto"
        max-camera-orbit="auto 100deg auto"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
        }}
      >
        {/* Dimension Hotspots */}
        {dimensions?.width && (
          <>
            <button
              slot="hotspot-dot+X+Y-Z"
              className="dot"
              data-position="1 1 -1"
              data-normal="0 1 0"
            />
            <button
              slot="hotspot-dim+Y-Z"
              className="dim"
              data-position="0 1.1 -1.1"
              data-normal="0 1 0"
            >
              {dimensions.width} cm
            </button>
            <button
              slot="hotspot-dot-X+Y-Z"
              className="dot"
              data-position="-1 1 -1"
              data-normal="0 1 0"
            />
          </>
        )}

        {dimensions?.height && (
          <>
            <button
              slot="hotspot-dot+X-Y-Z"
              className="dot"
              data-position="1 -1 -1"
              data-normal="1 0 0"
            />
            <button
              slot="hotspot-dim+X-Z"
              className="dim"
              data-position="1.2 0 -1.2"
              data-normal="1 0 0"
            >
              {dimensions.height} cm
            </button>
          </>
        )}

        {dimensions?.depth && (
          <>
            <button
              slot="hotspot-dot+X-Y+Z"
              className="dot"
              data-position="1 -1 1"
              data-normal="1 0 0"
            />
            <button
              slot="hotspot-dim+X-Y"
              className="dim"
              data-position="1.2 -1.1 0"
              data-normal="1 0 0"
            >
              {dimensions.depth} cm
            </button>
          </>
        )}

        {/* SVG Dimension Lines */}
        <svg
          id="dimLines"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="dimensionLineContainer"
        >
          {dimensions?.width && <line className="dimensionLine" />}
          {dimensions?.height && <line className="dimensionLine" />}
          {dimensions?.depth && <line className="dimensionLine" />}
        </svg>
      </model-viewer>

      <style jsx>{`
        .dot {
          display: none;
        }

        .dim {
          border-radius: 4px;
          border: none;
          box-sizing: border-box;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
          color: rgba(0, 0, 0, 0.8);
          display: block;
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 700;
          max-width: 128px;
          overflow-wrap: break-word;
          padding: 0.5em 1em;
          position: absolute;
          width: max-content;
          height: max-content;
          transform: translate3d(-50%, -50%, 0);
          pointer-events: none;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
        }

        @media only screen and (max-width: 800px) {
          .dim {
            font-size: 3vw;
          }
        }

        .dimensionLineContainer {
          pointer-events: none;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
        }

        .dimensionLine {
          stroke: hsl(var(--primary));
          stroke-width: 2;
          stroke-dasharray: 2;
        }

        model-viewer {
          --poster-color: transparent;
        }

        :not(:defined) > * {
          display: none;
        }
      `}</style>
    </div>
  );
}
