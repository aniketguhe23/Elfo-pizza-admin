import BackendUrl from './BackendUrl';

export default function ProjectApiList(): Record<string, string> {
  const baseUrl = BackendUrl;
  const apiList = {
    apiGetHedroData: `${baseUrl}/api/home/get-hero`,
    apiUpdateHeroData: `${baseUrl}/api/home/update-hero`,
    
    apiGetBannerData: `${baseUrl}/api/home/get-hero2`,
    apiUpdateBannerData: `${baseUrl}/api/home/update-hero2`,

    apiGetSpecialityData: `${baseUrl}/api/home/get-speciality`,
    apiUpdateSpecialityData: `${baseUrl}/api/home/update-speciality`,

    apiGetWhyElfoData: `${baseUrl}/api/home/get-why-elfo`,
    apiUpdateWhyElfoData : `${baseUrl}/api/home/update-why-elfo`,

    apiGetEleCardData: `${baseUrl}/api/home/get-elecardcomp`,
    apiUpdateEleCardData: `${baseUrl}/api/home/update-elecardcomp`,

    apiGetNavigationContent: `${baseUrl}/api/home/get-navigation`,
    apiUpdateNavigationContent: `${baseUrl}/api/home/update-navigation`,
    
    apiGetMenuItemsData: `${baseUrl}/api/home/get-menu-items`,
    apiAddMenuItemsData: `${baseUrl}/api/home/add-menu-item`,
    apiUpdateMenuItemsData: `${baseUrl}/api/home/update-menu-item`,
    
    apiLogIn: `${baseUrl}/api/auth/login`,
    apiSignUp: `${baseUrl}/api/auth/signup`,

    apiGetCategories: `${baseUrl}/api/menu/categories/get`,
    apiCreateCategories: `${baseUrl}/api/menu/categories/create`,
    apiUpdateCategories: `${baseUrl}/api/menu/categories/update`,

    apiGetSubCategories: `${baseUrl}/api/menu/subcategories/get`,
    apiCreateSubCategories: `${baseUrl}/api/menu/subcategories/create`,
    apiUpdateSubCategories: `${baseUrl}/api/menu/subcategories/update`,

    apiGetItems: `${baseUrl}/api/menu/items/get`,
    apiCreateItem: `${baseUrl}/api/menu/items/create`,
    apiUpdateItem: `${baseUrl}/api/menu/items/update`,
    
    apiGetItemVariants: `${baseUrl}/api/menu/item-variants/get`,
    apiCreateItemVariant: `${baseUrl}/api/menu/item-variants/create`,
    apiUpdateItemVariant: `${baseUrl}/api/menu/item-variants/update`,
    
    apiGetAllMenu: `${baseUrl}/api/allMenu/getAllmenu`,
    apiUpdateHomeMenu: `${baseUrl}/api/allMenu/updateHomeSceenItems`,
    
    
    // build your own
    
    apiGetValueHeroContent: `${baseUrl}/api/values/get-hero`,
    apiUpdateValueHeroContent: `${baseUrl}/api/values/update-hero`,
    
    apiGetValueAboutContent: `${baseUrl}/api/values/get-about`,
    apiUpdateValueAboutContent: `${baseUrl}/api/values/update-about`,
    
    apiGetValueBestPizzaContent: `${baseUrl}/api/values/get-best-pizza`,
    apiUpdateValueBestPizzaContent: `${baseUrl}/api/values/update-best-pizza`,
    
    apiGetPizzaDeliveryContent: `${baseUrl}/api/values/get-delivery`,
    apiUpdatePizzaDeliveryContent: `${baseUrl}/api/values/update-delivery`,
    
    apiGetNearestOutletContent: `${baseUrl}/api/values/get-nearest`,
    apiUpdateNearestOutletContent: `${baseUrl}/api/values/update-nearest`,
    
    apiGetNeareMeContent: `${baseUrl}/api/values/get-near-me`,
    apiUpdateNeareMeContent: `${baseUrl}/api/values/update-near-me`,
    
    // build your own
    
    //bread
    apiCreateBreadSize: `${baseUrl}/api/bread-size/create`,
    apiGetBreadSize: `${baseUrl}/api/bread-size/get`,
    apiUpdateBreadSize: `${baseUrl}/api/bread-size/update-by-id`,
    
    //Dough
    apiGetDough: `${baseUrl}/api/dough-type/get`,
    apiCreateDough: `${baseUrl}/api/dough-type/create`,
    apiUpdateDough: `${baseUrl}/api/dough-type/update`,
    
    //Crust Types
    apiGetCrustTypes: `${baseUrl}/api/crust-type/get`,
    apiCreateCrustTypes: `${baseUrl}/api/crust-type/create`,
    apiUpdateCrustTypes: `${baseUrl}/api/crust-type/update`,
    
    //Sauces
    apiGetSauces: `${baseUrl}/api/sauce/get`,
    apiCreateSauces: `${baseUrl}/api/sauce/create`,
    apiUpdateSauces: `${baseUrl}/api/sauce/update`,

    //Cheesse Options
    apiGetCheeseOptions: `${baseUrl}/api/cheese-option/get`,
    apiCreateCheeseOptions: `${baseUrl}/api/cheese-option/create`,
    apiUpdateCheeseOptions: `${baseUrl}/api/cheese-option/update`,

    //Toppings
    apiGetToppings: `${baseUrl}/api/topping/get`,
    apiCreateToppings: `${baseUrl}/api/topping/create`,
    apiUpdateToppings: `${baseUrl}/api/topping/update`,
  
    //Extra Sauce
    apiGetExtraSauce: `${baseUrl}/api/extra-sauce/get`,
    apiCreateExtraSauce: `${baseUrl}/api/extra-sauce/create`,
    apiUpdateExtraSauce: `${baseUrl}/api/extra-sauce/update`,
    
  };

  return apiList;
}
