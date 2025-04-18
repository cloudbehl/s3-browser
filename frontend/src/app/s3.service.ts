import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class S3Service {
  private apiUrl = 'http://localhost:5000/api';
  private accessKey: string = '';
  private secretKey: string = '';
  private endpoint: string = '';

  constructor(private http: HttpClient) {}

  setCredentials(accessKey: string, secretKey: string, endpoint: string): void {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.endpoint = endpoint;
  }

  private getAuthHeaders() {
    return {
      headers: {
        'x-access-key': this.accessKey,
        'x-secret-key': this.secretKey,
        'x-endpoint': this.endpoint
      }
    };
  }

  getFilesInBucket(bucketName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/bucket/${bucketName}`);
  }
  getBuckets(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/buckets`, this.getAuthHeaders());
  }

  createBucket(bucket: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/buckets`, { bucket }, this.getAuthHeaders());
  }

  deleteBucket(bucket: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/buckets/${bucket}`, this.getAuthHeaders());
  }

  getObjects(bucket: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/bucket/${bucket}/objects`, this.getAuthHeaders());
  }

  uploadObject(bucket: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/bucket/${bucket}/upload`, formData, this.getAuthHeaders());
  }

  downloadObject(bucket: string, key: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/bucket/${bucket}/object/${key}`, {
      ...this.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  deleteObject(bucket: string, key: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bucket/${bucket}/object/${key}`, this.getAuthHeaders());
  }

  getPresignedUrl(bucket: string, key: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/bucket/${bucket}/object/${key}/presigned-url`, this.getAuthHeaders());
  }

  getMetadata(bucket: string, key: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/bucket/${bucket}/object/${key}/metadata`, this.getAuthHeaders());
  }
}
