export class ResponseDeviceDto {
  id: number;
  trap_id: string;

  constructor(partial: Partial<ResponseDeviceDto>) {
    Object.assign(this, partial);
  }
}
