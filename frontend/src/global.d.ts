import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          ref?: React.Ref<any>;
          src?: string;
          alt?: string;
          poster?: string;
          'auto-rotate'?: boolean;
          'camera-controls'?: boolean;
          'shadow-intensity'?: string;
          'shadow-softness'?: string;
          'exposure'?: string;
          'camera-orbit'?: string;
          'min-camera-orbit'?: string;
          'max-camera-orbit'?: string;
          'max-field-of-view'?: string;
          'field-of-view'?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'ios-src'?: string;
          'touch-action'?: string;
          loading?: 'auto' | 'lazy' | 'eager';
        },
        HTMLElement
      >;
    }
  }
}

export {};
