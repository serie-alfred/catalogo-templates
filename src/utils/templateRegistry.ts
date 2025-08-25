// ************
// Template 01
// ************

// ******
// Common

import Header01 from '@/components/templates/common/template_1/Header';
import Footer01 from '@/components/templates/common/template_1/Footer';
import Spot01 from '@/components/templates/common/template_1/Spot';
import Newsletter01 from '@/components/templates/common/template_1/Newsletter';
import Breadcrumb01 from '@/components/templates/common/template_1/Breadcrumb';

// ******
// Home

import Showcase01 from '@/components/templates/home/template_1/Showcase';
import Ruler01 from '@/components/templates/home/template_1/Ruler';
import BannerMain01 from '@/components/templates/home/template_1/BannerMain';
import BannerSide01 from '@/components/templates/home/template_1/BannerSide';
import BannerFull01 from '@/components/templates/home/template_1/BannerFull';
import BannerGrid01 from '@/components/templates/home/template_1/BannerGrid';
import Brand01 from '@/components/templates/home/template_1/Brand';
import Categories01 from '@/components/templates/home/template_1/Categories';

// ************
// Template 02
// ************

// ******
// Common
import Spot02 from '@/components/templates/common/template_2/Spot';

// ******
// Home
import BannerFull02 from '@/components/templates/home/template_2/BannerFull';
import BannerSide02 from '@/components/templates/home/template_2/BannerSide';
import Ruler02 from '@/components/templates/home/template_2/Ruler';
import Showcase02 from '@/components/templates/home/template_2/Showcase';




export const TemplateRegistry: Record<string, React.FC<{ [key: string]: unknown }>> = {
  Newsletter01,
  Ruler01,
  Spot01,
  Showcase01,
  Header01,
  Footer01,
  BannerMain01,
  BannerSide01,
  BannerFull01,
  BannerGrid01,
  Brand01,
  Categories01,
  Breadcrumb01,

  BannerFull02,
  BannerSide02,
  Ruler02,
  Showcase02,
  Spot02
};
