import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  IndicesCreateResponse,
  IndicesGetMappingResponse,
  MappingTypeMapping,
  WriteResponseBase,
} from '@elastic/elasticsearch/lib/api/types';
import { productIndexValidation } from '../../products/validations/product-elasticsearch.validation';

export class BaseRepository<T> {
  constructor(
    private readonly elasticSearch: ElasticsearchService,
    private readonly indexName: string,
  ) {}

  async index(data: T): Promise<WriteResponseBase> {
    const parsedProduct = productIndexValidation.parse(data);
    return this.elasticSearch.index({
      id: parsedProduct.id,
      index: this.indexName,
      document: parsedProduct,
    });
  }

  async bulkIndex(data: T[]) {
    const convertedProducts = data.map((data) =>
      this.convertObjectToIndex(data),
    );
    const operations = convertedProducts.flatMap((data) => [
      {
        index: {
          _index: this.indexName,
          _id: data.id,
        },
      },
      data.restProduct,
    ]);

    return this.elasticSearch.bulk({
      operations,
    });
  }

  protected convertObjectToIndex(data: T): {
    restProduct: Omit<T, '_id'>;
    id: string;
  } {
    const { _id, ...restProduct } = data;

    return {
      restProduct,
      id: _id.toString(),
    };
  }

  async createMapping(
    mappings: MappingTypeMapping,
  ): Promise<IndicesCreateResponse> {
    return this.elasticSearch.indices.create({
      index: this.indexName,
      mappings,
    });
  }

  async geCurrentMapping(): Promise<IndicesGetMappingResponse> {
    return this.elasticSearch.indices.getMapping({
      index: this.indexName,
    });
  }
}
