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

// ************
// Template 03
// ************

// ******
// Common

import Spot03 from '@/components/templates/common/template_3/Spot';


// ******
// Home
import BannerDuplo03 from '@/components/templates/home/template_3/BannerDuplo';
import BannerFull03 from '@/components/templates/home/template_3/BannerFull';
import BannerSide03 from '@/components/templates/home/template_3/BannerSide';
import Ruler03 from '@/components/templates/home/template_3/Ruler';
import Showcase03 from '@/components/templates/home/template_3/Showcase';

// ************
// Template 04
// ************

// ******
// Common

// ******
// Home
import SpecialOffers04 from '@/components/templates/home/template_4/SpecialOffers';
import BannerSolo04 from '@/components/templates/home/template_4/BannerSolo';
import HomeCombined04 from '@/components/templates/home/template_4/HomeCombined';
import MultiCategories04 from '@/components/templates/home/template_4/MultiCategories';
import Ruler04 from '@/components/templates/home/template_4/Ruler';

// ************
// Template 05
// ************

// ******
// Common

// ******
// Home
import BannerFull05 from '@/components/templates/home/template_5/BannerFull';
import BannerSoloLeft05 from '@/components/templates/home/template_5/BannerSoloLeft';
import BannerTriple05 from '@/components/templates/home/template_5/BannerTriple';
import Ruler05 from '@/components/templates/home/template_5/Ruler';
import BannerTripleSwiper05 from '@/components/templates/home/template_5/BannerTripleSwiper';
import Showcase05 from '@/components/templates/home/template_5/Showcase';

// ************
// Template 06
// ************

// ******
// Common
import Spot06 from '@/components/templates/common/template_6/Spot';

// ******
// Home
import Showcase06 from '@/components/templates/home/template_6/Showcase';
import BannerMain06 from '@/components/templates/home/template_6/BannerMain';
import BannerTriple06 from '@/components/templates/home/template_6/BannerTriple';
import CategoryTriple06 from '@/components/templates/home/template_6/CategoryTriple';

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
  Spot02,

  BannerDuplo03,
  BannerFull03,
  BannerSide03,
  Ruler03,
  Spot03,
  Showcase03,

  SpecialOffers04,
  BannerSolo04,
  HomeCombined04,
  MultiCategories04,
  Ruler04,

  BannerFull05,
  BannerSoloLeft05,
  BannerTriple05,
  Ruler05,
  BannerTripleSwiper05,
  Showcase05,

  Spot06,
  Showcase06,
  BannerMain06,
  BannerTriple06,
  CategoryTriple06
};
