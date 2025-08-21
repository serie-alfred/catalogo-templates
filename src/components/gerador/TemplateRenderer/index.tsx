import React from 'react';
import { LayoutItem, LayoutKey } from '@/data/layoutData';
import { TEMPLATE_REGISTRY } from '@/utils/templateRegistry';

interface TemplateRendererProps {
  layoutKey: LayoutKey;
  data: LayoutItem;
  isMobile: boolean;
}

export default function TemplateRenderer({
  layoutKey,
  data,
  isMobile,
}: TemplateRendererProps) {
  const Template = TEMPLATE_REGISTRY[layoutKey]?.[data.id];

  if (!Template) {
    return (
      <div style={{ border: '1px dashed red', padding: '10px' }}>
        ⚠️ Template {layoutKey}/{data.id} não encontrado
      </div>
    );
  }
  return <Template isMobile={isMobile} />;
}
