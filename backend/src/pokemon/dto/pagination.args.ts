import { ArgsType, Field, Int } from '@nestjs/graphql';

export const DEFAULT_PAGE_LIMIT = 24;
export const MAX_PAGE_LIMIT = 100;

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true, defaultValue: DEFAULT_PAGE_LIMIT })
  limit: number = DEFAULT_PAGE_LIMIT;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset: number = 0;
}
