'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface WishlistContextType {
  savedIds: number[];
  savedFoodIds: number[];
  isSaved: (id: number) => boolean;
  isFoodSaved: (id: number) => boolean;
  toggleWishlist: (id: number, placeName?: string) => void;
  toggleFoodWishlist: (id: number, foodName?: string) => void;
  clearWishlist: () => void;
  clearFoodWishlist: () => void;
  savedCount: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  activeWishlistTab: 'places' | 'foods';
  setActiveWishlistTab: (tab: 'places' | 'foods') => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'uncover_ceylon_wishlist';
const FOOD_STORAGE_KEY = 'uncover_ceylon_food_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [savedFoodIds, setSavedFoodIds] = useState<number[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeWishlistTab, setActiveWishlistTab] = useState<'places' | 'foods'>('places');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedPlaces = localStorage.getItem(STORAGE_KEY);
      if (storedPlaces) {
        const parsed = JSON.parse(storedPlaces);
        if (Array.isArray(parsed)) setSavedIds(parsed);
      }
      const storedFoods = localStorage.getItem(FOOD_STORAGE_KEY);
      if (storedFoods) {
        const parsed = JSON.parse(storedFoods);
        if (Array.isArray(parsed)) setSavedFoodIds(parsed);
      }
    } catch (e) {
      console.error('Failed to load wishlist from storage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save places to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
    } catch (e) {
      console.error('Failed to save places wishlist:', e);
    }
  }, [savedIds, isLoaded]);

  // Save foods to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(FOOD_STORAGE_KEY, JSON.stringify(savedFoodIds));
    } catch (e) {
      console.error('Failed to save food wishlist:', e);
    }
  }, [savedFoodIds, isLoaded]);

  const isSaved = (id: number) => savedIds.includes(id);
  const isFoodSaved = (id: number) => savedFoodIds.includes(id);

  const toggleWishlist = (id: number, placeName?: string) => {
    const exists = savedIds.includes(id);
    if (exists) {
      setSavedIds((prev) => prev.filter((item) => item !== id));
      toast(placeName ? `Removed "${placeName}" from Saved` : 'Removed from Saved Destinations', {
        icon: '🤍',
      });
    } else {
      setSavedIds((prev) => [...prev, id]);
      toast.success(placeName ? `Saved "${placeName}" to Wishlist!` : 'Saved to Wishlist! ❤️');
    }
  };

  const toggleFoodWishlist = (id: number, foodName?: string) => {
    const exists = savedFoodIds.includes(id);
    if (exists) {
      setSavedFoodIds((prev) => prev.filter((item) => item !== id));
      toast(foodName ? `Removed "${foodName}" from Saved Flavors` : 'Removed from Saved Flavors', {
        icon: '🤍',
      });
    } else {
      setSavedFoodIds((prev) => [...prev, id]);
      toast.success(foodName ? `Saved "${foodName}" to Saved Flavors! ❤️` : 'Saved to Flavors! ❤️');
    }
  };

  const clearWishlist = () => {
    setSavedIds([]);
    toast('Saved places cleared', { icon: '🗑️' });
  };

  const clearFoodWishlist = () => {
    setSavedFoodIds([]);
    toast('Saved flavors cleared', { icon: '🗑️' });
  };

  return (
    <WishlistContext.Provider
      value={{
        savedIds,
        savedFoodIds,
        isSaved,
        isFoodSaved,
        toggleWishlist,
        toggleFoodWishlist,
        clearWishlist,
        clearFoodWishlist,
        savedCount: savedIds.length + savedFoodIds.length,
        isDrawerOpen,
        setIsDrawerOpen,
        activeWishlistTab,
        setActiveWishlistTab,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
