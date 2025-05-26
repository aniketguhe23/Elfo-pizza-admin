'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import axios from 'axios';
import { toast } from 'react-toastify';

import PizzaCardEdit from '../formComponent/PizzaCardEdit';

interface HeroData {
  hero_title_1: string;
  hero_title_2: string;
  hero_title_3: string;
  hero_img: string;
}

interface FormDataProps {
  title: string;
  subtitle: string;
  description: string;
  image?: File | null;
  imageUrl?: string;
}

function PizzaCard(): JSX.Element {
  const [data, setData] = useState<HeroData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { apiGetHedroData, apiUpdateHeroData } = ProjectApiList();

  const fetchPizzaData = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<HeroData>(apiGetHedroData);
      setData(response.data);
    } catch (error) {
      toast.error('Error fetching hero data');
    }
  }, [apiGetHedroData]);

  useEffect(() => {
    void fetchPizzaData();
  }, [fetchPizzaData]);

  const updateHeroContent = async (formData: FormDataProps): Promise<void> => {
    try {
      const payload = new FormData();
      payload.append('hero_title_1', formData.title);
      payload.append('hero_title_2', formData.subtitle);
      payload.append('hero_title_3', formData.description);

      if (formData.image) {
        payload.append('hero_img', formData.image);
      }

      const response = await axios.put(apiUpdateHeroData, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if ((response.data as { status: string }).status === 'success') {
        setIsEditing(false);
        await fetchPizzaData();
      }
    } catch (error) {
      toast.error('Error updating hero content');
    }
  };

  if (!data) return <div />;

  return (
    <div>
      {!isEditing ? (
        <div>
          <h1>{data.hero_title_1}</h1>
          <h2>{data.hero_title_2}</h2>
          <p>{data.hero_title_3}</p>
          <img src={data.hero_img} alt="Hero" style={{ width: '300px' }} />
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit
          </button>
        </div>
      ) : (
        <PizzaCardEdit
          open={isEditing}
          onCancel={() => {
            setIsEditing(false);
          }}
          defaultValues={{
            title: data.hero_title_1,
            subtitle: data.hero_title_2,
            description: data.hero_title_3,
            image: null,
            imageUrl: data.hero_img,
          }}
          onSubmit={updateHeroContent}
        />
      )}
    </div>
  );
}

export default PizzaCard;
