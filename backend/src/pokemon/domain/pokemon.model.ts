import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Pokemon {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => [String])
  types: string[];

  @Field(() => [String])
  abilities: string[];

  @Field(() => Int, { nullable: true, description: 'Height in "decimetres"' })
  height?: number;

  @Field(() => Int, { nullable: true, description: 'Weight in "hectograms"' })
  weight?: number;
}
