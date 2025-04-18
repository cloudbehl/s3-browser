from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import boto3
from botocore.exceptions import ClientError
from io import BytesIO

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization,x-access-key,x-secret-key,x-endpoint"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response

def get_s3_client():
    access_key = request.headers.get('x-access-key')
    secret_key = request.headers.get('x-secret-key')
    endpoint = request.headers.get('x-endpoint')
    return boto3.client(
        's3',
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        endpoint_url=endpoint
    )

@app.route('/api/buckets', methods=['GET'])
def list_buckets():
    s3 = get_s3_client()
    buckets = s3.list_buckets()
    return jsonify([bucket['Name'] for bucket in buckets['Buckets']])

@app.route('/api/buckets', methods=['POST'])
def create_bucket():
    s3 = get_s3_client()
    bucket = request.json['bucket'] 
    try:
        s3.create_bucket(
            Bucket=bucket
        )
        return jsonify({'message': 'Bucket created'})
    except ClientError as e:
        if e.response['Error']['Code'] == 'BucketAlreadyOwnedByYou':
            return jsonify({'message': 'Bucket already exists and is owned by you'}), 200
        return jsonify({'error': str(e)}), 400

@app.route('/api/buckets/<bucket>', methods=['DELETE'])
def delete_bucket(bucket):
    s3 = get_s3_client()
    s3.delete_bucket(Bucket=bucket)
    return jsonify({'message': 'Bucket deleted'})

@app.route('/api/bucket/<bucket>/objects', methods=['GET'])
def list_objects(bucket):
    s3 = get_s3_client()
    try:
        response = s3.list_objects_v2(Bucket=bucket)
        objects = [obj['Key'] for obj in response.get('Contents', [])]
        return jsonify(objects)
    except ClientError as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/bucket/<bucket>/upload', methods=['POST'])
def upload_object(bucket):
    s3 = get_s3_client()
    file = request.files['file']
    s3.upload_fileobj(file, bucket, file.filename)
    return jsonify({'message': 'File uploaded'})

@app.route('/api/bucket/<bucket>/object/<key>', methods=['GET'])
def download_object(bucket, key):
    s3 = get_s3_client()
    file_obj = BytesIO()
    s3.download_fileobj(bucket, key, file_obj)
    file_obj.seek(0)
    return send_file(file_obj, download_name=key, as_attachment=True)

@app.route('/api/bucket/<bucket>/object/<key>', methods=['DELETE'])
def delete_object(bucket, key):
    s3 = get_s3_client()
    s3.delete_object(Bucket=bucket, Key=key)
    return jsonify({'message': 'File deleted'})

@app.route('/api/bucket/<bucket>/object/<key>/presigned-url', methods=['GET'])
def get_presigned_url(bucket, key):
    s3 = get_s3_client()
    url = s3.generate_presigned_url('get_object', Params={'Bucket': bucket, 'Key': key}, ExpiresIn=3600)
    return jsonify({'url': url})

@app.route('/api/bucket/<bucket>/object/<key>/metadata', methods=['GET'])
def get_metadata(bucket, key):
    s3 = get_s3_client()
    metadata = s3.head_object(Bucket=bucket, Key=key)
    return jsonify(metadata)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
    app.run(debug=True)
