import React from 'react';
import { PromptVerse2EntryPass } from './PromptVerse2EntryPass';
import { CelestiusStandardEntryPass } from './CelestiusStandardEntryPass';

export interface TemplateDefinition {
  key: string;
  displayName: string;
  category: 'Entry Pass';
  description: string;
  componentName: string;
  component: React.ComponentType<any>;
}

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  'pv2-entry-pass': {
    key: 'pv2-entry-pass',
    displayName: 'PromptVerse 2.0 Entry Pass',
    category: 'Entry Pass',
    description: 'Official PromptVerse 2.0 event pass with barcode verification.',
    componentName: 'PromptVerse2EntryPass',
    component: PromptVerse2EntryPass
  },
  'celestius-standard-entry-pass': {
    key: 'celestius-standard-entry-pass',
    displayName: 'Celestius Standard Entry Pass',
    category: 'Entry Pass',
    description: 'Standard event entry pass for Club Celestius events.',
    componentName: 'CelestiusStandardEntryPass',
    component: CelestiusStandardEntryPass
  }
};

export function getTemplateComponent(templateKey: string): React.ComponentType<any> {
  const normalizedKey = templateKey ? templateKey.toLowerCase().trim() : 'pv2-entry-pass';
  return TEMPLATE_REGISTRY[normalizedKey]?.component || PromptVerse2EntryPass;
}
