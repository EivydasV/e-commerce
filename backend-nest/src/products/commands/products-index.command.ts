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
})
export class ProductsIndexCommand extends CommandRunner {
  private readonly logger = new Logger(ProductsIndexCommand.name);
  constructor(
    private readonly productsRepository: ProductRepository,
    private readonly productsElasticsearch: ProductElasticsearchRepository,
  ) {
    super();
  }
  async run() {
    const self = this;
    const progressBar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic,
    );
    const productsCount = await this.productsRepository.estimateCunt();

    progressBar.start(productsCount, 0);

    const products = this.productsRepository
      .findAll()
      .populate<{ categories: CategoryDocument[] }>({
        path: 'categories',
        model: Category.name,
      })
      .cursor({ lean: true });

    await products.eachAsync(
      async function (products) {
        const res = await self.productsElasticsearch.bulkIndex(products);
        if (res.errors) {
          self.logger.error(res.items);
        }
        progressBar.increment(products.length);
      },
      { batchSize: 100 },
    );
    progressBar.stop();
  }
}
