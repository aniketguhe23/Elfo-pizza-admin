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
  };

  return apiList;
}
