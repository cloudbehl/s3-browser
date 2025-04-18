import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class S3Service {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getFilesInBucket(bucketName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/bucket/${bucketName}`);
  }
  getBuckets(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/buckets`);
  }

  createBucket(bucket: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/buckets`, { bucket });
  }

  deleteBucket(bucket: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/buckets/${bucket}`);
  }

  getObjects(bucket: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/bucket/${bucket}/objects`);
  }

  uploadObject(bucket: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/bucket/${bucket}/upload`, formData);
  }

  downloadObject(bucket: string, key: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/bucket/${bucket}/object/${key}`, { responseType: 'blob' });
  }

  deleteObject(bucket: string, key: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bucket/${bucket}/object/${key}`);
  }

  getPresignedUrl(bucket: string, key: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/bucket/${bucket}/object/${key}/presigned-url`);
  }

  getMetadata(bucket: string, key: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/bucket/${bucket}/object/${key}/metadata`);
  }

}
