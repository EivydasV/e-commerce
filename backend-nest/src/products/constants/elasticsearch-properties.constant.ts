import { MappingProperty } from '@elastic/elasticsearch/lib/api/types';

export const elasticsearchPropertiesConstant: Record<string, MappingProperty> =
  {
    id: { type: 'keyword' },
    title: { type: 'search_as_you_type' },
    description: { type: 'search_as_you_type' },
    categories: {
      type: 'nested',
      properties: {
        name: { type: 'text' },
      },
    },
    manufacturer: { type: 'text' },
    isPublished: { type: 'boolean' },
    variants: {
      type: 'nested',
      properties: {
        pricing: {
          type: 'nested',
          properties: {
            cost: { type: 'float' },
            currency: { type: 'text' },
            salePrice: { type: 'float' },
          },
        },
        quantity: { type: 'integer' },
        color: { type: 'text' },
      },
    },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
  };
