export class SingleDataResponseDto<T> {
  data: T;
  message: string;
  code: number;
}

export class PaginatedResponse<T> {
  page: number;
  limit: number;
  total_items: number;
  total_page: number;
  items: T;
}

export function generateSingleDataResponse<T>(
  data: T,
  code = 200,
  message = 'success',
): SingleDataResponseDto<T> {
  return {
    code: code,
    message: message,
    data: data,
  };
}

export function generatePaginatedResponse<T>(
  data: T,
  totalData: number,
  page: number,
  pageSize: number,
): SingleDataResponseDto<PaginatedResponse<T>> {
  const totalPage = Math.ceil(totalData / pageSize);
  const paginatedResponse: PaginatedResponse<T> = {
    page: page,
    limit: pageSize,
    total_items: totalData,
    total_page: totalPage,
    items: data,
  };

  return {
    code: 200,
    message: 'success',
    data: paginatedResponse,
  };
}
