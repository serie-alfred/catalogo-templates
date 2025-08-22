import Newsletter01 from '@/components/templates/common/template_1/Newsletter';
import Ruler01 from '@/components/templates/home/template_1/Ruler';
import Spot01 from '@/components/templates/common/template_1/Spot';
import Showcase01 from '@/components/templates/home/template_1/Showcase';
import Header01 from '@/components/templates/common/template_1/Header';
import Footer01 from '@/components/templates/common/template_1/Footer';
import BannerMain01 from '@/components/templates/home/template_1/BannerMain';
import BannerDuplo01 from '@/components/templates/home/template_1/BannerDuplo';


export const TemplateRegistry: Record<string, React.FC<{ [key: string]: unknown }>> = {
  Newsletter01,
  Ruler01,
  Spot01,
  Showcase01,
  Header01,
  Footer01,
  BannerMain01,
  BannerDuplo01
};
