'use client';

import { useEffect, useRef, useState } from 'react';

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
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);

  // Load model-viewer only on client side
  useEffect(() => {
    import('@google/model-viewer').then(() => {
      setModelViewerLoaded(true);
    });
  }, []);

  // Update hotspot positions and labels based on model dimensions
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer || !dimensions) return;

    const handleLoad = () => {
      try {
        const center = modelViewer.getBoundingBoxCenter();
        const size = modelViewer.getDimensions();
        const x2 = size.x / 2;
        const y2 = size.y / 2;
        const z2 = size.z / 2;

        // Update all dot positions
        modelViewer.updateHotspot({
          name: 'hotspot-dot+X-Y+Z',
          position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`
        });
        modelViewer.updateHotspot({
          name: 'hotspot-dot+X-Y-Z',
          position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
        });
        modelViewer.updateHotspot({
          name: 'hotspot-dot+X+Y-Z',
          position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
        });
        modelViewer.updateHotspot({
          name: 'hotspot-dot-X+Y-Z',
          position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
        });
        modelViewer.updateHotspot({
          name: 'hotspot-dot-X-Y-Z',
          position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
        });
        modelViewer.updateHotspot({
          name: 'hotspot-dot-X-Y+Z',
          position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
        });

        // Update dimension labels with admin values
        if (dimensions.depth) {
          modelViewer.updateHotspot({
            name: 'hotspot-dim+X-Y',
            position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
          });
          const dimButton = modelViewer.querySelector('button[slot="hotspot-dim+X-Y"]');
          if (dimButton) {
            dimButton.textContent = `${dimensions.depth} cm`;
          }
        }

        if (dimensions.height) {
          modelViewer.updateHotspot({
            name: 'hotspot-dim+X-Z',
            position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
          });
          const dimButton = modelViewer.querySelector('button[slot="hotspot-dim+X-Z"]');
          if (dimButton) {
            dimButton.textContent = `${dimensions.height} cm`;
          }
        }

        if (dimensions.width) {
          modelViewer.updateHotspot({
            name: 'hotspot-dim+Y-Z',
            position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`
          });
          const dimButton = modelViewer.querySelector('button[slot="hotspot-dim+Y-Z"]');
          if (dimButton) {
            dimButton.textContent = `${dimensions.width} cm`;
          }
        }

        // Remove left side duplicate dimensions - they're not needed
        // Only show dimensions on right and top sides for cleaner look

        // Render dimension lines
        renderSVG();
        modelViewer.addEventListener('camera-change', renderSVG);
      } catch (error) {
        console.error('Error updating model dimensions:', error);
      }
    };

    const renderSVG = () => {
      const dimLines = modelViewer.querySelectorAll('line');
      if (dimLines.length === 0) return;

      const drawLine = (svgLine: any, dotHotspot1: any, dotHotspot2: any, dimensionHotspot?: any) => {
        if (dotHotspot1 && dotHotspot2) {
          svgLine.setAttribute('x1', dotHotspot1.canvasPosition.x);
          svgLine.setAttribute('y1', dotHotspot1.canvasPosition.y);
          svgLine.setAttribute('x2', dotHotspot2.canvasPosition.x);
          svgLine.setAttribute('y2', dotHotspot2.canvasPosition.y);

          // Hide line if dimension hotspot is not facing camera
          if (dimensionHotspot && !dimensionHotspot.facingCamera) {
            svgLine.classList.add('hide');
          } else {
            svgLine.classList.remove('hide');
          }
        }
      };

      // Draw dimension lines
      if (dimensions?.depth) {
        drawLine(
          dimLines[0],
          modelViewer.queryHotspot('hotspot-dot+X-Y+Z'),
          modelViewer.queryHotspot('hotspot-dot+X-Y-Z'),
          modelViewer.queryHotspot('hotspot-dim+X-Y')
        );
      }
      if (dimensions?.height) {
        drawLine(
          dimLines[1],
          modelViewer.queryHotspot('hotspot-dot+X-Y-Z'),
          modelViewer.queryHotspot('hotspot-dot+X+Y-Z'),
          modelViewer.queryHotspot('hotspot-dim+X-Z')
        );
      }
      if (dimensions?.width) {
        drawLine(
          dimLines[2],
          modelViewer.queryHotspot('hotspot-dot+X+Y-Z'),
          modelViewer.queryHotspot('hotspot-dot-X+Y-Z')
        ); // Always visible (top line)
      }
    };

    modelViewer.addEventListener('load', handleLoad);
    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('camera-change', renderSVG);
    };
  }, [dimensions, modelViewerLoaded]);

  const fullModelUrl = modelUrl.startsWith('http') 
    ? modelUrl 
    : `${process.env.NEXT_PUBLIC_API_URL}${modelUrl}`;

  if (!modelViewerLoaded) {
    return (
      <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">3D model yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[500px]">
      {/* @ts-expect-error - model-viewer is a custom element from @google/model-viewer */}
      <model-viewer
        ref={modelViewerRef}
        src={fullModelUrl}
        alt={`3D model of ${productName}`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
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
        {/* Dot Hotspots (invisible markers for line endpoints) */}
        <button
          slot="hotspot-dot+X-Y+Z"
          className="dot"
          data-position="1 -1 1"
          data-normal="1 0 0"
        />
        <button
          slot="hotspot-dot+X-Y-Z"
          className="dot"
          data-position="1 -1 -1"
          data-normal="1 0 0"
        />
        <button
          slot="hotspot-dot+X+Y-Z"
          className="dot"
          data-position="1 1 -1"
          data-normal="0 1 0"
        />
        <button
          slot="hotspot-dot-X+Y-Z"
          className="dot"
          data-position="-1 1 -1"
          data-normal="0 1 0"
        />
        <button
          slot="hotspot-dot-X-Y-Z"
          className="dot"
          data-position="-1 -1 -1"
          data-normal="-1 0 0"
        />
        <button
          slot="hotspot-dot-X-Y+Z"
          className="dot"
          data-position="-1 -1 1"
          data-normal="-1 0 0"
        />

        {/* Dimension Label Hotspots */}
        {dimensions?.depth && (
          <button
            slot="hotspot-dim+X-Y"
            className="dim"
            data-position="1 -1 0"
            data-normal="1 0 0"
          >
            {dimensions.depth} cm
          </button>
        )}

        {dimensions?.height && (
          <button
            slot="hotspot-dim+X-Z"
            className="dim"
            data-position="1 0 -1"
            data-normal="1 0 0"
          >
            {dimensions.height} cm
          </button>
        )}

        {dimensions?.width && (
          <button
            slot="hotspot-dim+Y-Z"
            className="dim"
            data-position="0 1 -1"
            data-normal="0 1 0"
          >
            {dimensions.width} cm
          </button>
        )}

        {/* SVG Dimension Lines */}
        <svg
          id="dimLines"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="dimensionLineContainer"
        >
          {dimensions?.depth && <line className="dimensionLine" />}
          {dimensions?.height && <line className="dimensionLine" />}
          {dimensions?.width && <line className="dimensionLine" />}
        </svg>
      {/* @ts-expect-error - model-viewer is a custom element from @google/model-viewer */}
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
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          --min-hotspot-opacity: 0;
        }

        @media only screen and (max-width: 800px) {
          .dim {
            font-size: 3vw;
          }
        }

        .dimensionLineContainer {
          pointer-events: none;
          display: block;
        }

        .dimensionLine {
          stroke: #16a5e6;
          stroke-width: 2;
          stroke-dasharray: 2;
        }

        .hide {
          display: none;
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
