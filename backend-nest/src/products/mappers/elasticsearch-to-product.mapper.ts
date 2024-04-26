import { Injectable } from '@nestjs/common';
import { MapperInterface } from '../../core/interfaces/mapper.interface';
import { ProductDocument } from '../schemas/product.schema';
import { z } from 'zod';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { productIndexSchema } from '../validations/product-elasticsearch.validation';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ElasticsearchToProductMapper
  implements
    MapperInterface<
      SearchResponse<z.output<typeof productIndexSchema>>,
      ProductDocument[]
    >
{
  constructor(private readonly productRepository: ProductRepository) {}

  async transform(
    data: SearchResponse<z.output<typeof productIndexSchema>>,
  ): Promise<ProductDocument[]> {
    return this.productRepository.findAll({
      _id: {
        $in: data.hits.hits.map((hit) => hit._id),
      },
    });
  }
}
