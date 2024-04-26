import { ElasticsearchModel } from '../../elasticsearch/models/elasticsearch.model';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
class Autocomplete {
  title: string;
  description: string;
}

@ObjectType()
export class AutocompleteModel extends ElasticsearchModel(Autocomplete) {}
