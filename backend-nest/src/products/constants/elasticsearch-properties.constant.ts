import { MappingProperty } from '@elastic/elasticsearch/lib/api/types';

export const elasticsearchPropertiesConstant: Record<string, MappingProperty> =
  {
    id: { type: 'keyword', ignore_above: 255 },
    title: { type: 'search_as_you_type' },
    description: { type: 'search_as_you_type' },
    categories: {
      type: 'nested',
      properties: {
        name: { type: 'keyword', ignore_above: 255 },
      },
    },
    manufacturer: {
      type: 'text',
      properties: { keyword: { type: 'keyword', ignore_above: 255 } },
    },
    isPublished: { type: 'boolean' },
    variants: {
      type: 'nested',
      properties: {
        pricing: {
          type: 'nested',
          properties: {
            cost: { type: 'float' },
            currency: { type: 'keyword', ignore_above: 255 },
            salePrice: { type: 'float' },
          },
        },
        quantity: { type: 'integer' },
        color: { type: 'keyword', ignore_above: 255 },
      },
    },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
  };
