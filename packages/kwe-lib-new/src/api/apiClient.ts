import { ProcedureResult } from '@';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// import http from 'http';
// import https from 'https';

export interface ExtendedAxiosInstance extends AxiosInstance {
    get<T = any, R = AxiosResponse<T>, D = any>(
        url: string,
        config?: AxiosRequestConfig<D>
      ): Promise<R>;
    post<T = any, R = AxiosResponse<T>, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>
      ): Promise<R>;
    executeProcedure<T>(url:string, data: any, config: AxiosRequestConfig): Promise<ProcedureResult>;
  }

// const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 100 });
// const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 100 });

/**
 * @description 인스턴스 생성 + 커스텀 메서드 부여
 */
export const createApiClient = (config?: AxiosRequestConfig): ExtendedAxiosInstance => {

    const instance = axios.create({
        // httpAgent,
        // httpsAgent,
        timeout: 30000,
        ...config
    }) as ExtendedAxiosInstance;

    instance.get = async function <T = any, R = AxiosResponse<T>, D = any>(
        url: string,
        config?: AxiosRequestConfig<D>
    ): Promise<R> {
        // console.log('[Overridden GET]', url, config);

        // 실제 요청은 부모 인스턴스의 get을 그대로 쓰거나,
        // axios 내부 함수를 직접 호출.
        // 1) 부모 인스턴스의 get을 사용
        const response = await axios.Axios.prototype.get.call(instance, url, config);
        // 2) 혹은 instance.request({...}) 등으로도 가능

        // 필요 시 응답 가공
        // ...

        return response as R; 
    };

    instance.post = async function <T = any, R = AxiosResponse<T>, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>
      ): Promise<R> {
        // console.log('[Overridden POST]', url, data, config);
        try {
          // 원본 post 호출
          const response = await axios.Axios.prototype.post.call(instance, url, data, config);

          return response as R;
        } catch (err) {
          return Promise.reject(err);
        }
      };

    instance.executeProcedure = async function <T>(url: string, data: any, config: AxiosRequestConfig): Promise<ProcedureResult> {
        // console.log('[custom executeProcedure]', url, data, config);
        const response = await this.post(url, data, config);
                        
        return response.data;
      };

    return instance;
}    