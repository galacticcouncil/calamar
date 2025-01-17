import { FetchOptions } from "../model/fetchOptions";
import { ExtrinsicsFilter, ExtrinsicsOrder, getExtrinsics } from "../services/extrinsicsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useExtrinsics(
	network: string,
	filter: ExtrinsicsFilter,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getExtrinsics, [network, filter, order, true], options);
}
