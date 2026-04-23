export type StationStatus = 'construction' | 'active';

export interface Station {
  id: string;
  name: string;
  owner: string;
  contractType: string;
  lat: string;
  lng: string;
  status: StationStatus;
  progress: number;
  license: string;
  updatedAt: string;
}

export type Language = 'en' | 'ar';
