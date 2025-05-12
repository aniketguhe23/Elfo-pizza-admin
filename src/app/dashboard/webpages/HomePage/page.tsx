import React from 'react';
import PizzaCard from './component/PizzaCard';
import Banner from './component/Banner';
import SpecialityCard from './component/SpecialityCard';
import ExploreFeature from './component/ExploreFeature';
import WhyElfoPage from './component/WhyElfoPage';
import EleCardComponent from './component/EleCardComponent';
import NavCardComponent from './component/NavCardComponent';
import MenuItemsComponent from './component/MenuItemsComponent';

const HomeTab = () => {
  return (
    <>
      <NavCardComponent />
      <PizzaCard />
      <Banner />
      <SpecialityCard />
      {/* <ExploreFeature /> */}
      <WhyElfoPage />
      <EleCardComponent />
      <MenuItemsComponent />
    </>
  );
};

export default HomeTab;
