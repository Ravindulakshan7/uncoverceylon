'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

export type WishlistTabType = 'places' | 'foods' | 'culture' | 'experiences';

interface WishlistContextType {
  savedIds: number[];
  savedFoodIds: number[];
  savedCultureIds: number[];
  savedExpIds: number[];
  isSaved: (id: number) => boolean;
  isFoodSaved: (id: number) => boolean;
  isCultureSaved: (id: number) => boolean;
  isExpSaved: (id: number) => boolean;
  toggleWishlist: (id: number, placeName?: string) => void;
  toggleFoodWishlist: (id: number, foodName?: string) => void;
  toggleCultureWishlist: (id: number, cultureName?: string) => void;
  toggleExpWishlist: (id: number, expName?: string) => void;
  clearWishlist: () => void;
  clearFoodWishlist: () => void;
  clearCultureWishlist: () => void;
  clearExpWishlist: () => void;
  savedCount: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  activeWishlistTab: WishlistTabType;
  setActiveWishlistTab: (tab: WishlistTabType) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'uncover_ceylon_wishlist';
const FOOD_STORAGE_KEY = 'uncover_ceylon_food_wishlist';
const CULTURE_STORAGE_KEY = 'uncover_ceylon_culture_wishlist';
const EXP_STORAGE_KEY = 'uncover_ceylon_exp_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [savedFoodIds, setSavedFoodIds] = useState<number[]>([]);
  const [savedCultureIds, setSavedCultureIds] = useState<number[]>([]);
  const [savedExpIds, setSavedExpIds] = useState<number[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeWishlistTab, setActiveWishlistTab] = useState<WishlistTabType>('places');
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
      const storedCulture = localStorage.getItem(CULTURE_STORAGE_KEY);
      if (storedCulture) {
        const parsed = JSON.parse(storedCulture);
        if (Array.isArray(parsed)) setSavedCultureIds(parsed);
      }
      const storedExp = localStorage.getItem(EXP_STORAGE_KEY);
      if (storedExp) {
        const parsed = JSON.parse(storedExp);
        if (Array.isArray(parsed)) setSavedExpIds(parsed);
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

  // Save culture to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CULTURE_STORAGE_KEY, JSON.stringify(savedCultureIds));
    } catch (e) {
      console.error('Failed to save culture wishlist:', e);
    }
  }, [savedCultureIds, isLoaded]);

  // Save experiences to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(EXP_STORAGE_KEY, JSON.stringify(savedExpIds));
    } catch (e) {
      console.error('Failed to save experiences wishlist:', e);
    }
  }, [savedExpIds, isLoaded]);

  const isSaved = (id: number) => savedIds.includes(id);
  const isFoodSaved = (id: number) => savedFoodIds.includes(id);
  const isCultureSaved = (id: number) => savedCultureIds.includes(id);
  const isExpSaved = (id: number) => savedExpIds.includes(id);

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

  const toggleCultureWishlist = (id: number, cultureName?: string) => {
    const exists = savedCultureIds.includes(id);
    if (exists) {
      setSavedCultureIds((prev) => prev.filter((item) => item !== id));
      toast(cultureName ? `Removed "${cultureName}" from Saved Heritage` : 'Removed from Saved Heritage', {
        icon: '🤍',
      });
    } else {
      setSavedCultureIds((prev) => [...prev, id]);
      toast.success(cultureName ? `Saved "${cultureName}" to Saved Heritage! ❤️` : 'Saved to Heritage! ❤️');
    }
  };

  const toggleExpWishlist = (id: number, expName?: string) => {
    const exists = savedExpIds.includes(id);
    if (exists) {
      setSavedExpIds((prev) => prev.filter((item) => item !== id));
      toast(expName ? `Removed "${expName}" from Saved Experiences` : 'Removed from Saved Experiences', {
        icon: '🤍',
      });
    } else {
      setSavedExpIds((prev) => [...prev, id]);
      toast.success(expName ? `Saved "${expName}" to Saved Experiences! ❤️` : 'Saved to Experiences! ❤️');
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

  const clearCultureWishlist = () => {
    setSavedCultureIds([]);
    toast('Saved heritage cleared', { icon: '🗑️' });
  };

  const clearExpWishlist = () => {
    setSavedExpIds([]);
    toast('Saved experiences cleared', { icon: '🗑️' });
  };

  const totalSavedCount = savedIds.length + savedFoodIds.length + savedCultureIds.length + savedExpIds.length;

  return (
    <WishlistContext.Provider
      value={{
        savedIds,
        savedFoodIds,
        savedCultureIds,
        savedExpIds,
        isSaved,
        isFoodSaved,
        isCultureSaved,
        isExpSaved,
        toggleWishlist,
        toggleFoodWishlist,
        toggleCultureWishlist,
        toggleExpWishlist,
        clearWishlist,
        clearFoodWishlist,
        clearCultureWishlist,
        clearExpWishlist,
        savedCount: totalSavedCount,
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
