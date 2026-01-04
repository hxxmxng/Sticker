
import { Shape } from './types';

export const SHAPES: Shape[] = [
  // Basic
  { id: 'circle', name: 'Circle', category: 'basic', path: 'M 50,50 m -50,0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0' },
  { id: 'squircle', name: 'Squircle', category: 'basic', path: 'M 0,50 C 0,0 0,0 50,0 C 100,0 100,0 100,50 C 100,100 100,100 50,100 C 0,100 0,100 0,50' },
  { id: 'capsule', name: 'Capsule', category: 'basic', path: 'M 25,0 L 75,0 C 88.8,0 100,11.2 100,25 L 100,75 C 100,88.8 88.8,100 75,100 L 25,100 C 11.2,100 0,88.8 0,75 L 0,25 C 0,11.2 11.2,0 25,0' },
  { id: 'oval', name: 'Oval', category: 'basic', path: 'M 50,0 C 22.4,0 0,22.4 0,50 C 0,77.6 22.4,100 50,100 C 77.6,100 100,77.6 100,50 C 100,22.4 77.6,0 50,0' },
  
  // Organic Blobs
  { id: 'blob1', name: 'Soft Blob', category: 'organic', path: 'M 91.5,50 C 91.5,73 73,91.5 50,91.5 C 27,91.5 8.5,73 8.5,50 C 8.5,27 27,8.5 50,8.5 C 73,8.5 91.5,27 91.5,50' },
  { id: 'blob2', name: 'Wobbly', category: 'organic', path: 'M 84,27 C 95,45 88,78 68,89 C 48,100 16,87 7,65 C -2,43 12,12 37,4 C 62,-4 73,9 84,27' },
  { id: 'blob3', name: 'Jelly', category: 'organic', path: 'M 88,43 C 94,62 81,87 60,94 C 39,101 10,91 4,70 C -2,49 15,17 40,8 C 65,-1 82,24 88,43' },
  { id: 'blob4', name: 'Puddle', category: 'organic', path: 'M 79,21 C 92,34 98,59 87,77 C 76,95 48,106 28,97 C 8,88 -8,59 3,38 C 14,17 38,2 58,5 C 65,6 72,14 79,21' },
  { id: 'blob5', name: 'Smoothie', category: 'organic', path: 'M 86,22 C 99,39 98,69 83,86 C 68,103 38,107 20,95 C 2,83 -3,55 8,33 C 19,11 46,-5 67,2 C 75,5 82,14 86,22' },
  
  // Modern
  { id: 'cloud', name: 'Cloud', category: 'modern', path: 'M 25,30 A 15,15 0 0,1 40,15 A 25,25 0 0,1 75,25 A 15,15 0 0,1 90,40 A 20,20 0 0,1 70,85 L 30,85 A 20,20 0 0,1 10,65 A 15,15 0 0,1 25,30' },
  { id: 'flower', name: 'Daisy', category: 'modern', path: 'M 50,0 C 60,0 60,15 70,15 C 80,15 95,15 95,25 C 95,35 80,40 80,50 C 80,60 95,65 95,75 C 95,85 80,85 70,85 C 60,85 60,100 50,100 C 40,100 40,85 30,85 C 20,85 5,85 5,75 C 5,65 20,60 20,50 C 20,40 5,35 5,25 C 5,15 20,15 30,15 C 40,15 40,0 50,0' },
  { id: 'ticket', name: 'Ticket', category: 'modern', path: 'M 0,20 C 10,20 10,35 10,50 C 10,65 10,80 0,80 L 0,100 L 100,100 L 100,80 C 90,80 90,65 90,50 C 90,35 90,20 100,20 L 100,0 L 0,0 Z' },
  { id: 'arch', name: 'Arch', category: 'modern', path: 'M 0,100 L 0,50 C 0,22 22,0 50,0 C 78,0 100,22 100,50 L 100,100 Z' },
  { id: 'window', name: 'Window', category: 'modern', path: 'M 10,100 L 10,40 C 10,18 28,0 50,0 C 72,0 90,18 90,40 L 90,100 Z' },
  
  // Frames
  { id: 'heart', name: 'Soft Heart', category: 'frames', path: 'M 50,90 C 20,70 0,50 0,30 C 0,15 15,0 30,0 C 40,0 45,5 50,10 C 55,5 60,0 70,0 C 85,0 100,15 100,30 C 100,50 80,70 50,90' },
  { id: 'star', name: 'Star', category: 'frames', path: 'M 50,0 L 61,35 L 98,35 L 68,57 L 79,91 L 50,70 L 21,91 L 32,57 L 2,35 L 39,35 Z' },
  { id: 'scallop', name: 'Scallop', category: 'frames', path: 'M 50,5 C 55,5 58,10 63,10 C 68,10 73,5 78,8 C 83,11 82,18 87,22 C 92,26 99,25 100,31 C 101,37 95,41 95,47 C 95,53 101,57 100,63 C 99,69 92,68 87,72 C 82,76 83,83 78,86 C 73,89 68,84 63,84 C 58,84 55,89 50,89 C 45,89 42,84 37,84 C 32,84 27,89 22,86 C 17,83 18,76 13,72 C 8,68 1,69 0,63 C -1,57 5,53 5,47 C 5,41 -1,37 0,31 C 1,25 8,26 13,22 C 18,18 17,11 22,8 C 27,5 32,10 37,10 C 42,10 45,5 50,5 Z' },
  { id: 'diamond', name: 'Lozenge', category: 'frames', path: 'M 50,0 L 100,50 L 50,100 L 0,50 Z' },
  { id: 'hexagon', name: 'Hexagon', category: 'frames', path: 'M 25,5 L 75,5 L 100,50 L 75,95 L 25,95 L 0,50 Z' },
  { id: 'leaf', name: 'Petal', category: 'frames', path: 'M 50,0 C 75,0 100,25 100,50 C 100,75 75,100 50,100 C 25,100 0,75 0,50 C 0,25 25,0 50,0' }
];
