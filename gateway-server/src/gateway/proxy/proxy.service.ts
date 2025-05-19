import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProxyService {
  async forwardRequest(method: string, url: string, data: any, headers: any) {
    console.log('Proxying request:', method, url);
    console.log('Incoming headers:', headers);

    // Content-Length 관련 문제 방지: content-type만 남기고 재정의
    const filteredHeaders = {
      'Content-Type': headers['content-type'] || 'application/json',
      Authorization: headers['authorization'], // 전달해야 할 토큰
    };

    try {
      const config: any = {
        method,
        url,
        headers: filteredHeaders,
      };

      // GET/HEAD 요청에는 data를 포함시키지 않음
      if (!['GET', 'HEAD'].includes(method.toUpperCase())) {
        config.data = data;
      }

      const response = await axios(config);

      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      console.error('Proxy error:', error.message);
      if (error.response) {
        console.error('Proxy response error:', error.response.data);
        return {
          status: error.response.status,
          data: error.response.data,
        };
      }
      return {
        status: 500,
        data: { message: 'Internal Server Error' },
      };
    }
  }
}
