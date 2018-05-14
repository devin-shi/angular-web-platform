import { Injectable } from '@angular/core';

@Injectable()
export class NetworkConfig {
  /** HTTPClient 获取后端数据的baseDomain 可以没有 */
  baseDomain?: string;
  /** 是否需要返回数据的进度 */
  needReport? = false;
  /** 是否打印 HTTP 请求信息，弥补浏览器无Network信息 */
  log? = true;
  /** 是否需要校验返回的格式，如果需要，此处为返回格式的对象,如{} */
  repsonseRegex?: Object;
}
