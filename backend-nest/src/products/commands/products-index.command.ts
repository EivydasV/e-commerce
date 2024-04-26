import { Command, CommandRunner } from 'nest-commander';
import { ProductRepository } from '../repositories/product.repository';
import cliProgress from 'cli-progress';
import {
  Category,
  CategoryDocument,
} from '../../categories/schemas/category.schema';
import { Logger } from '@nestjs/common';
import { ProductElasticsearchRepository } from '../repositories/product-elasticsearch.repository';

@Command({
  name: 'products:index',
  description:
    'it will drop all the products index and reindex all the products',
})
export class ProductsIndexCommand extends CommandRunner {
  private readonly logger = new Logger(ProductsIndexCommand.name);
  private readonly batchSize = 100;
  constructor(
    private readonly productsRepository: ProductRepository,
    private readonly productsElasticsearch: ProductElasticsearchRepository,
  ) {
    super();
  }
  async run() {
    const progressBar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic,
    );

    const productsCount = await this.productsRepository.estimateCount();

    await this.prepareIndexing();

    progressBar.start(productsCount, 0);

    const productsQuery = this.createQuery();

    await this.indexProducts(productsQuery, progressBar);
    progressBar.stop();
  }

  private async prepareIndexing() {
    await this.productsElasticsearch.dropIndex();
    await this.productsElasticsearch.onModuleInit();
  }

  private createQuery() {
    return this.productsRepository
      .findAll()
      .populate<{ categories: CategoryDocument[] }>({
        path: 'categories',
        model: Category.name,
      })
      .cursor({ lean: true });
  }

  private async indexProducts(
    productsQuery: ReturnType<typeof this.createQuery>,
    progressBar: cliProgress.SingleBar,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    await productsQuery.eachAsync(
      async function (products) {
        const res = await self.productsElasticsearch.bulkIndex(products);
        if (res.errors) {
          self.logger.error(res.items);
        }

        progressBar.increment(products.length);
      },
      { batchSize: this.batchSize },
    );
  }
}
