import { create } from 'zustand';
import { Design, DesignLayer, TextLayer, ImageLayer } from '../constants/types';

interface DesignStore {
  design: Design;
  selectedLayerId: string | null;
  setBackgroundColor: (color: string) => void;
  addTextLayer: () => void;
  addImageLayer: (uri: string) => void;
  updateLayer: (id: string, updates: Partial<DesignLayer>) => void;
  removeLayer: (id: string) => void;
  selectLayer: (id: string | null) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  resetDesign: () => void;
}

const defaultDesign: Design = {
  backgroundColor: '#FFFFFF',
  layers: [],
};

export const useDesignStore = create<DesignStore>((set, get) => ({
  design: defaultDesign,
  selectedLayerId: null,

  setBackgroundColor: (color) =>
    set((state) => ({ design: { ...state.design, backgroundColor: color } })),

  addTextLayer: () => {
    const newLayer: TextLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'Szöveg',
      fontSize: 24,
      color: '#000000',
      fontFamily: 'System',
      x: 50,
      y: 50,
      rotation: 0,
    };
    set((state) => ({
      design: { ...state.design, layers: [...state.design.layers, newLayer] },
      selectedLayerId: newLayer.id,
    }));
  },

  addImageLayer: (uri) => {
    const newLayer: ImageLayer = {
      id: `image-${Date.now()}`,
      type: 'image',
      uri,
      x: 20,
      y: 20,
      width: 200,
      height: 200,
      rotation: 0,
    };
    set((state) => ({
      design: { ...state.design, layers: [...state.design.layers, newLayer] },
      selectedLayerId: newLayer.id,
    }));
  },

  updateLayer: (id, updates) => {
    set((state) => ({
      design: {
        ...state.design,
        layers: state.design.layers.map((l) =>
          l.id === id ? ({ ...l, ...updates } as DesignLayer) : l
        ),
      },
    }));
  },

  removeLayer: (id) => {
    set((state) => ({
      design: {
        ...state.design,
        layers: state.design.layers.filter((l) => l.id !== id),
      },
      selectedLayerId:
        state.selectedLayerId === id ? null : state.selectedLayerId,
    }));
  },

  selectLayer: (id) => set({ selectedLayerId: id }),

  moveLayerUp: (id) => {
    set((state) => {
      const layers = [...state.design.layers];
      const idx = layers.findIndex((l) => l.id === id);
      if (idx < layers.length - 1) {
        [layers[idx], layers[idx + 1]] = [layers[idx + 1], layers[idx]];
      }
      return { design: { ...state.design, layers } };
    });
  },

  moveLayerDown: (id) => {
    set((state) => {
      const layers = [...state.design.layers];
      const idx = layers.findIndex((l) => l.id === id);
      if (idx > 0) {
        [layers[idx], layers[idx - 1]] = [layers[idx - 1], layers[idx]];
      }
      return { design: { ...state.design, layers } };
    });
  },

  resetDesign: () => set({ design: defaultDesign, selectedLayerId: null }),
}));
