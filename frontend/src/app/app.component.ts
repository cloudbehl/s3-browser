import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { S3Service } from './s3.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit {
  buckets: string[] = [];
  selectedBucket: string | null = null;
  objects: string[] = [];
  newBucket: string = '';
  presignedUrl: string = '';

  accessKey: string = '';
  secretKey: string = '';
  endpoint: string = '';
  connected: boolean = false;

  constructor(private s3Service: S3Service) {}

  ngOnInit(): void {
    this.loadBuckets();
  }

  connect(): void {
    if (this.accessKey && this.secretKey && this.endpoint) {
      this.s3Service.setCredentials(this.accessKey, this.secretKey, this.endpoint);
      this.connected = true;
      this.loadBuckets();
    }
  }

  loadBuckets(): void {
    this.s3Service.getBuckets().subscribe(buckets => {
      this.buckets = buckets;
    });
  }

  createBucket(): void {
    this.s3Service.createBucket(this.newBucket).subscribe({
      next: () => {
        this.newBucket = '';
        this.loadBuckets();
      },
      error: (err) => {
        this.loadBuckets();
        this.newBucket = '';
        console.error('Error creating bucket:', err);
      }
    });
  }

  deleteBucket(bucket: string): void {
    this.s3Service.deleteBucket(bucket).subscribe(() => {
      if (this.selectedBucket === bucket) this.selectedBucket = null;
      this.loadBuckets();
    });
  }

  selectBucket(bucket: string): void {
    this.selectedBucket = bucket;
    this.s3Service.getObjects(bucket).subscribe(objects => {
      this.objects = objects;
    });
  }

  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (file && this.selectedBucket) {
      this.s3Service.uploadObject(this.selectedBucket, file).subscribe(() => {
        this.selectBucket(this.selectedBucket!);
      });
    }
  }

  downloadFile(key: string): void {
    if (this.selectedBucket) {
      this.s3Service.downloadObject(this.selectedBucket, key).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = key;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }
  }

  deleteObject(key: string): void {
    if (this.selectedBucket) {
      this.s3Service.deleteObject(this.selectedBucket, key).subscribe(() => {
        this.selectBucket(this.selectedBucket!);
      });
    }
  }

  getPresignedUrl(key: string): void {
    if (this.selectedBucket) {
      this.s3Service.getPresignedUrl(this.selectedBucket, key).subscribe(data => {
        this.presignedUrl = data.url;
      });
    }
  }
}
