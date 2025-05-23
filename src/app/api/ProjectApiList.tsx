import BackendUrl from './BackendUrl';

export default function ProjectApiList() {
  let baseUrl = BackendUrl;
  let apiList = {
    api_getHedroData: `${baseUrl}/api/home/get-hero`,
    api_updateHeroData: `${baseUrl}/api/home/update-hero`,
    
    api_getBannerData: `${baseUrl}/api/home/get-hero2`,
    api_updateBannerData: `${baseUrl}/api/home/update-hero2`,

    api_getSpecialityData: `${baseUrl}/api/home/get-speciality`,
    api_updateSpecialityData: `${baseUrl}/api/home/update-speciality`,

    api_getWhyElfoData: `${baseUrl}/api/home/get-why-elfo`,
    api_updateWhyElfoData: `${baseUrl}/api/home/update-why-elfo`,

    api_getEleCardData: `${baseUrl}/api/home/get-elecardcomp`,
    api_updateleCardData: `${baseUrl}/api/home/update-elecardcomp`,

    api_getNavigationContent: `${baseUrl}/api/home/get-navigation`,
    api_updateNavigationContent: `${baseUrl}/api/home/update-navigation`,
    
    api_getMenuItemsData: `${baseUrl}/api/home/get-menu-items`,
    api_addMenuItemsData: `${baseUrl}/api/home/add-menu-item`,
    api_updateMenuItemsData: `${baseUrl}/api/home/update-menu-item`,
    
    api_logIn: `${baseUrl}/api/auth/login`,
    api_signUp: `${baseUrl}/api/auth/signup`,

    api_getCategories: `${baseUrl}/api/menu/categories/get`,
    api_createCategories: `${baseUrl}/api/menu/categories/create`,
    api_updateCategories: `${baseUrl}/api/menu/categories/update`,

    api_getSubCategories: `${baseUrl}/api/menu/subcategories/get`,
    api_createSubCategories: `${baseUrl}/api/menu/subcategories/create`,
    api_updateSubCategories: `${baseUrl}/api/menu/subcategories/update`,

    api_getItems: `${baseUrl}/api/menu/items/get`,
    api_createItem: `${baseUrl}/api/menu/items/create`,
    api_updateItem: `${baseUrl}/api/menu/items/update`,

    api_getItemVariants: `${baseUrl}/api/menu/item-variants/get`,
    api_createItemVariant: `${baseUrl}/api/menu/item-variants/create`,
    api_updateItemVariant: `${baseUrl}/api/menu/item-variants/update`,
    
    api_getAllmenu: `${baseUrl}/api/allMenu/getAllmenu`,
    api_updateHomeMenu: `${baseUrl}/api/allMenu/updateHomeSceenItems`,
  };

  return apiList;
}
