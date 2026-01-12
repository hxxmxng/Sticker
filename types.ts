
// Updated Shape interface to include new categories: 'tape' and 'animals'
export interface Shape {
  id: string;
  name: string;
  path: string;
  category: 'basic' | 'organic' | 'modern' | 'frames' | 'tape' | 'animals';
}

export interface Transform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export type EditorState = 'idle' | 'editing' | 'processing';