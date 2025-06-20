import React from 'react';
import PizzaCard from './component/PizzaCard';
// import Banner from './component/Banner';
import SpecialityCard from './component/SpecialityCard';
import WhyElfoPage from './component/WhyElfoPage';
import EleCardComponent from './component/EleCardComponent';
import NavCardComponent from './component/NavCardComponent';

function HomeTab(): React.JSX.Element {
  return (
    <>
      <NavCardComponent />
      <PizzaCard />
      {/* <Banner /> */}
      <SpecialityCard />
      {/* <ExploreFeature /> */}
      <WhyElfoPage />
      <EleCardComponent />
      {/* <MenuItemsComponent /> */}
    </>
  );
}

export default HomeTab;
