import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Pokemon } from './pokemon.model';

@ObjectType()
export class PaginatedPokemon {
  @Field(() => [Pokemon])
  items: Pokemon[];

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  offset: number;
}
