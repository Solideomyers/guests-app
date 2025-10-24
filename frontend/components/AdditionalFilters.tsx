import React from 'react';
import { useUIStore } from '../stores';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useGuests } from '../hooks';

/**
 * AdditionalFilters Component
 * Provides church, city, and pastor filter options
 * Extracts unique values from all guests for filter options
 */

const AdditionalFilters: React.FC = () => {
  const {
    isPastorFilter,
    setIsPastorFilter,
    churchFilter,
    setChurchFilter,
    cityFilter,
    setCityFilter,
  } = useUIStore();

  // Fetch all guests to extract unique churches and cities (no filters for dropdown data)
  const { data: allGuestsData } = useGuests({
    page: 1,
    limit: 1000, // Get all to extract unique values
  });

  // Extract unique churches from all guests
  const uniqueChurches = React.useMemo(() => {
    if (!allGuestsData?.data) return [];
    const churches = allGuestsData.data
      .map((guest) => guest.church)
      .filter((church): church is string => !!church && church.trim() !== '');
    return Array.from(new Set(churches)).sort();
  }, [allGuestsData]);

  // Extract unique cities from all guests
  const uniqueCities = React.useMemo(() => {
    if (!allGuestsData?.data) return [];
    const cities = allGuestsData.data
      .map((guest) => guest.city)
      .filter((city): city is string => !!city && city.trim() !== '');
    return Array.from(new Set(cities)).sort();
  }, [allGuestsData]);

  return (
    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4'>
      {/* Pastor Filter */}
      <div className='flex-1 min-w-[200px]'>
        <Label
          htmlFor='pastor-filter'
          className='text-sm font-medium mb-2 block'
        >
          Filtrar por Pastor
        </Label>
        <Select
          value={
            isPastorFilter === null ? 'all' : isPastorFilter ? 'yes' : 'no'
          }
          onValueChange={(value) => {
            if (value === 'all') setIsPastorFilter(null);
            else if (value === 'yes') setIsPastorFilter(true);
            else setIsPastorFilter(false);
          }}
        >
          <SelectTrigger id='pastor-filter' className='w-full'>
            <SelectValue placeholder='Todos' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            <SelectItem value='yes'>Solo Pastores</SelectItem>
            <SelectItem value='no'>No Pastores</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Church Filter */}
      <div className='flex-1 min-w-[200px]'>
        <Label
          htmlFor='church-filter'
          className='text-sm font-medium mb-2 block'
        >
          Filtrar por Iglesia
        </Label>
        <Select
          value={churchFilter || '__all__'}
          onValueChange={(value) =>
            setChurchFilter(value === '__all__' ? '' : value)
          }
        >
          <SelectTrigger id='church-filter' className='w-full'>
            <SelectValue placeholder='Todas las iglesias' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='__all__'>Todas las iglesias</SelectItem>
            {uniqueChurches.map((church) => (
              <SelectItem key={church} value={church}>
                {church}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Filter */}
      <div className='flex-1 min-w-[200px]'>
        <Label htmlFor='city-filter' className='text-sm font-medium mb-2 block'>
          Filtrar por Ciudad
        </Label>
        <Select
          value={cityFilter || '__all__'}
          onValueChange={(value) =>
            setCityFilter(value === '__all__' ? '' : value)
          }
        >
          <SelectTrigger id='city-filter' className='w-full'>
            <SelectValue placeholder='Todas las ciudades' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='__all__'>Todas las ciudades</SelectItem>
            {uniqueCities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AdditionalFilters;
