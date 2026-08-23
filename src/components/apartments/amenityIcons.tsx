import {
  AirVent,
  ArrowUpDown,
  Bath,
  Car,
  ChefHat,
  Dog,
  Eye,
  Flame,
  Laptop,
  Sprout,
  Sun,
  Tv,
  WavesLadder,
  Wifi,
  WashingMachine,
  Utensils,
} from 'lucide-react';
import type { AmenityKey } from '@/types';
import type { ComponentType } from 'react';

export const amenityIcons: Record<AmenityKey, ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  parking: Car,
  seaView: Eye,
  balcony: Sun,
  terrace: Sun,
  garden: Sprout,
  kitchen: ChefHat,
  dishwasher: Utensils,
  washingMachine: WashingMachine,
  tv: Tv,
  airCon: AirVent,
  elevator: ArrowUpDown,
  workspace: Laptop,
  pool: WavesLadder,
  bbq: Flame,
  petFriendly: Dog,
};

export const bathIcon = Bath;
