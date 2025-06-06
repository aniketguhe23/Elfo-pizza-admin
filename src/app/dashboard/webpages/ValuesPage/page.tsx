import React from 'react';
import HeroCardComponent from './component/HeroCardComponent';
import AboutCardComponent from './component/AboutCardComponent';
import BestPizzaComponent from './component/BestPizzaComponent';
import PizzaDeliveryComponent from './component/PizzaDeliveryComponent';
import NearestOutletComponent from './component/NearestOutletComponent';
import NearmeComponent from './component/NearmeComponent';


function ValuesPage(): React.JSX.Element {
  return (
    <>
      <HeroCardComponent />
      <AboutCardComponent />
      <NearestOutletComponent />
      <BestPizzaComponent />
      <PizzaDeliveryComponent />
      <NearmeComponent />
    </>
  );
}

export default ValuesPage;
