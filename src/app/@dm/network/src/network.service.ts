import { Injectable, Inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import * as parse from 'date-fns/parse';
import { Md5 } from 'ts-md5/dist/md5';

/**
 * 封装HttpClient，主要解决：
 * + 优化HttpClient在参数上便利性
 * + 统一实现 loading
 * + 统一处理时间格式问题
 */
@Injectable()
// tslint:disable-next-line:class-name
export class DmHttpClient {
  constructor(private http: HttpClient) {}

  private _loading = false;
  private _allLoadingRequest: any;

  /** 是否正在加载中 */
  get loading(): boolean {
    return this._loading;
  }

  /**
   * 将参数对象转换为HttpParams
   * @param params
   */
  parseParams(params: any): HttpParams {
    let ret = new HttpParams();
    // tslint:disable-next-line:forin
    for (const key in params) {
      let _data = params[key];
      // 将时间转化为：时间戳 (秒)
      if (_data instanceof Date) {
        _data = _data.valueOf();
      }
      ret = ret.set(key, _data);
    }
    return ret;
  }

  /**
   *
   * @param url 将参数对象转换为get请求的URL
   * @param params
   */
  appliedUrl(url: string, params?: any) {
    if (!params) return url;
    url += ~url.indexOf('?') ? '' : '?';
    const arr: string[] = [];
    // tslint:disable-next-line:forin
    for (const key in params) {
      arr.push(`${key}=${params[key]}`);
    }
    return url + arr.join('&');
  }

  begin() {
    // console.time('http');
    this._loadingTime = new Date().getTime();
    setTimeout(() => (this._loading = true));
  }

  end() {
    // console.timeEnd('http');
    setTimeout(() => (this._loading = false));
  }

  // region: get
  /**
   * GET：返回一个 `T` 类型
   */
  get<T>(
    url: string,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T>;

  /**
   * GET：返回一个 `string` 类型
   */
  get(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * GET：返回一个 `JSON` 类型
   */
  get(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<Object>>;

  /**
   * GET：返回一个 `JSON` 类型
   */
  get<T>(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<T>>;

  /**
   * GET：返回一个 `any` 类型
   */
  get(
    url: string,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * GET 请求
   */
  get(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'GET',
      url,
      Object.assign(
        {
          params,
        },
        options,
      ),
    );
  }

  // endregion
  // region: post
  /**
   * POST：返回一个 `string` 类型
   */
  post(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * POST：返回一个 `JSON` 类型
   */
  post(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<Object>>;

  /**
   * POST：返回一个 `JSON` 类型
   */
  post<T>(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T>;

  /**
   * POST：返回一个 `any` 类型
   */
  post(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * POST 请求
   */
  post(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'POST',
      url,
      Object.assign(
        {
          body,
          params,
        },
        options,
      ),
    );
  }

  // endregion
  // region: delete
  /**
   * DELETE：返回一个 `string` 类型
   */
  delete(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * POST：返回一个 `JSON` 类型
   */
  delete(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<Object>>;

  /**
   * POST：返回一个 `any` 类型
   */
  delete(
    url: string,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * POST 请求
   */
  delete(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'DELETE',
      url,
      Object.assign(
        {
          params,
        },
        options,
      ),
    );
  }

  // endregion
  /**
   * `jsonp` 请求
   *
   * @param url URL地址
   * @param params 请求参数
   * @param callbackParam CALLBACK值，默认：JSONP_CALLBACK
   */
  jsonp(
    url: string,
    params?: any,
    callbackParam: string = 'JSONP_CALLBACK',
  ): Observable<any> {
    return this.http.jsonp(this.appliedUrl(url, params), callbackParam).pipe(
      tap(() => {
        this.end();
      }),
      catchError(res => {
        this.end();
        return Observable.throw(res);
      }),
    );
  }

  /**
   * `patch` 请求
   *
   * @param url URL地址
   * @param body 请求参数
   */
  patch(url: string, body?: any, params?: any): Observable<any> {
    return this.request(
      'PATCH',
      url,
      Object.assign({
        params,
        body: body || null,
      }),
    );
  }

  /**
   * `put` 请求
   *
   * @param url URL地址
   * @param body 请求参数
   */
  put(url: string, body?: any, params?: any): Observable<any> {
    return this.request(
      'PUT',
      url,
      Object.assign({
        params,
        body: body || null,
      }),
    );
  }

  /**
   * `request` 请求
   *
   * @param method 请求方法类型
   * @param url URL地址
   * @param options 参数
   */
  request<R>(
    method: string,
    url: string,
    options?: {
      body?: any;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body' | 'events' | 'response';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      reportProgress?: boolean;
      withCredentials?: boolean;
    },
  ): Observable<R>;
  /**
   * `request` 请求
   *
   * @param method 请求方法类型
   * @param url URL地址
   * @param options 参数
   */
  request(
    method: string,
    url: string,
    options?: {
      body?: any;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body' | 'events' | 'response';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      reportProgress?: boolean;
      withCredentials?: boolean;
    },
  ): Observable<any> {
    this.begin();

    const startTime = new Date().getTime();
    const requestObject: any = {
      method: method,
      url: url,
      options: options,
    };

    this._allLoadingRequest[
      '' + Md5.hashStr(JSON.stringify(requestObject).toString())
    ] = requestObject;
    if (options) {
      if (options.params) options.params = this.parseParams(options.params);
    }
    return this.http.request(method, url, options).pipe(
      tap(() => {
        this.end();
        const endTime = new Date().getTime();
        requestObject.requestTime = endTime - startTime;
      }),
      catchError(res => {
        this.end();
        const endTime = new Date().getTime();
        requestObject.requestTime = endTime - startTime;
        delete this._allLoadingRequest[
          '' + Md5.hashStr(JSON.stringify(requestObject).toString())
        ];
        return Observable.throw(res);
      }),
    );
  }
}
