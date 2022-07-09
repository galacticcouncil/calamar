import { Order } from "../model/order";
import { fetchGraphql } from "../utils/fetchGraphql";
import { filterToWhere } from "../utils/filterToWhere";

export type ExtrinsicsFilter = any; /*Filter<{
  id: string;
  blockId: string;
  hash: string;
  isSigned: boolean;
  signer: string;
  name: string;
  section: string;
  method: string;
  substrate_events: Filter<{
    name: string;
  }>;
}>;*/

export async function getExtrinsic(filter?: ExtrinsicsFilter) {
  const extrinsics = await getExtrinsics(1, 0, filter);
  return extrinsics?.[0];
}

export async function getExtrinsics(
  limit: Number,
  offset: Number,
  filter?: ExtrinsicsFilter,
  order?: Order
) {
  const where = filterToWhere(filter);
  const orderBy = Object.entries(order || {})
    .map((e) => `${e[0]}: ${e[1]}`)
    .join(", ");

  const response = await fetchGraphql(
    `query ($limit: Int!, $offset: Int!, $filter: ExtrinsicWhereInput) {
      extrinsics(limit: $limit, offset: $offset, where: $filter) {
        id
        hash
        call {
          name
          args
        }
        block {
          id
          hash
          timestamp
        }
        signature
      }
    }`,
    {
      limit,
      offset,
      filter,
    }
  );

  return response?.extrinsics;
}