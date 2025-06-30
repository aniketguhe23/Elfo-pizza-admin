import React from 'react';

import FooterContactComponent from './component/FooterContactComponent';
import QuickLinksComponent from './component/QuickLinksComponent';
import LegalLinksComponent from './component/LegalLinksComponent';
import SocialLinksComponent from './component/SocialLinksComponent';

function FooterTab(): React.JSX.Element {
  return (
    <>
      <FooterContactComponent />
      <QuickLinksComponent />
      <LegalLinksComponent />
      <SocialLinksComponent />
    </>
  );
}

export default FooterTab;
