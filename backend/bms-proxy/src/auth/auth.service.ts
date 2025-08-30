import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as qs from 'querystring';
import { LoginCredentials, StoredCookies } from '../common/types';

@Injectable()
export class AuthService {
  private storedCookies: StoredCookies = {};

  async login(credentials: LoginCredentials): Promise<StoredCookies> {
    try {
      const loginBody = qs.stringify({
        requestType: 'Authentication',
        subRequestType: 'login',
        username: credentials.username,
        password: credentials.password
      });

      // Step 1: Initial login
      const loginResponse: AxiosResponse = await axios.post(
        'https://bmsdev.chakranetwork.com:8080/bms/login', 
        loginBody,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      // Extract initial cookies
      let cookies = this.extractCookiesFromResponse(loginResponse);
      
      // Step 2: If we have JSESSIONID, make a follow-up request to trigger DWR session
      if (cookies.JSESSIONID) {
        try {
          // Make a request to the DWR engine to trigger DWRSESSIONID generation
          const dwrResponse = await axios.get(
            'https://bmsdev.chakranetwork.com:8080/bms/dwr/engine.js',
            {
              headers: {
                'Cookie': `JSESSIONID=${cookies.JSESSIONID}`
              }
            }
          );
          
          // Check if we got any additional cookies from the DWR request
          const dwrCookies = this.extractCookiesFromResponse(dwrResponse);
          if (dwrCookies.DWRSESSIONID) {
            cookies.DWRSESSIONID = dwrCookies.DWRSESSIONID;
          }
          
          // Alternative: Try to make a DWR call to trigger session creation
          try {
            const dwrCallResponse = await axios.post(
              'https://bmsdev.chakranetwork.com:8080/bms/dwr/call/plaincall/DWRBroadcast.getStatus.dwr',
              'callCount=1\nscriptSessionId=\npage=1\nhttpSessionId=' + cookies.JSESSIONID + '\ns=0',
              {
                headers: {
                  'Content-Type': 'text/plain',
                  'Cookie': `JSESSIONID=${cookies.JSESSIONID}`
                }
              }
            );
            
            const dwrCallCookies = this.extractCookiesFromResponse(dwrCallResponse);
            if (dwrCallCookies.DWRSESSIONID) {
              cookies.DWRSESSIONID = dwrCallCookies.DWRSESSIONID;
            }
          } catch (dwrCallError) {
            console.log('DWR call failed, continuing with JSESSIONID only:', dwrCallError.message);
          }
          
        } catch (dwrError) {
          console.log('DWR request failed, continuing with JSESSIONID only:', dwrError.message);
        }
      }

      // Store the final cookies
      this.storedCookies = cookies;
      console.log('Final extracted cookies:', cookies);

      return this.storedCookies;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw new Error('Login failed');
    }
  }

  private extractCookiesFromResponse(response: AxiosResponse): StoredCookies {
    const cookies: StoredCookies = {};
    
    // Method 1: Try to extract from Set-Cookie headers (traditional way)
    const setCookieHeader = response.headers['set-cookie'] || [];
    setCookieHeader.forEach(cookieStr => {
      const [cookiePart] = cookieStr.split(';');
      const [name, value] = cookiePart.split('=');
      
      if (name === 'JSESSIONID' || name === 'DWRSESSIONID') {
        cookies[name] = value;
      }
    });

    // Method 2: Parse HTML response for JavaScript variables or meta tags
    if (response.data && typeof response.data === 'string') {
      const htmlContent = response.data;
      
      // Look for JSESSIONID in the HTML (might be in a script tag or meta tag)
      const jsessionMatch = htmlContent.match(/JSESSIONID\s*=\s*['"]([^'"]+)['"]/i);
      if (jsessionMatch && !cookies.JSESSIONID) {
        cookies.JSESSIONID = jsessionMatch[1];
      }

      // Look for DWRSESSIONID in the HTML
      const dwrsessionMatch = htmlContent.match(/DWRSESSIONID\s*=\s*['"]([^'"]+)['"]/i);
      if (dwrsessionMatch && !cookies.DWRSESSIONID) {
        cookies.DWRSESSIONID = dwrsessionMatch[1];
      }

      // Look for cookies in script variables
      const scriptCookieMatch = htmlContent.match(/document\.cookie\s*=\s*['"]([^'"]+)['"]/i);
      if (scriptCookieMatch) {
        const cookieString = scriptCookieMatch[1];
        const cookiePairs = cookieString.split(';');
        cookiePairs.forEach(pair => {
          const [name, value] = pair.trim().split('=');
          if (name === 'JSESSIONID' || name === 'DWRSESSIONID') {
            cookies[name] = value;
          }
        });
      }

      // Look for cookies in localStorage or sessionStorage patterns
      const storageMatch = htmlContent.match(/(?:localStorage|sessionStorage)\.setItem\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/gi);
      if (storageMatch) {
        storageMatch.forEach(match => {
          const itemMatch = match.match(/['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/);
          if (itemMatch) {
            const [key, value] = itemMatch.slice(1);
            if (key === 'JSESSIONID' || key === 'DWRSESSIONID') {
              cookies[key] = value;
            }
          }
        });
      }
    }

    // Method 3: If we still don't have JSESSIONID, try to extract from URL or other sources
    if (!cookies.JSESSIONID && response.headers['location']) {
      const locationMatch = response.headers['location'].match(/JSESSIONID=([^;&]+)/);
      if (locationMatch) {
        cookies.JSESSIONID = locationMatch[1];
      }
    }

    return cookies;
  }

  getCookies(): StoredCookies {
    return this.storedCookies;
  }

  clearCookies(): void {
    this.storedCookies = {};
  }
}
