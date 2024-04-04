import { Command, CommandRunner } from 'nest-commander';
import { ProductRepository } from '../repositories/product.repository';

@Command({
  name: 'products:index',
})
export class ProductsIndexCommand extends CommandRunner {
  constructor(private readonly productsRepository: ProductRepository) {
    super();
  }
  async run() {
    console.log('Indexing products...');
  }
}
