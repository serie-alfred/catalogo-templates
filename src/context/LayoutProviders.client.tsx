'use client';
import React from 'react';
import { LayoutProvider } from './LayoutContext';

export default function LayoutProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutProvider>{children}</LayoutProvider>;
}
