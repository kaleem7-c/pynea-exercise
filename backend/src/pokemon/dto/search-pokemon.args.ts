import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from './pagination.args';

@ArgsType()
export class SearchPokemonArgs extends PaginationArgs {
  @Field({ description: 'Partial match against a Pokemon name (case insensitive)' })
  query: string;
}
