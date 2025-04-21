# Vidify Platform - Core Infrastructure

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC and Networking
resource "aws_vpc" "vidify_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "vidify-vpc"
  }
}

# Public Subnets
resource "aws_subnet" "public_subnet_1" {
  vpc_id                  = aws_vpc.vidify_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "vidify-public-subnet-1"
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.vidify_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "vidify-public-subnet-2"
  }
}

# Private Subnets
resource "aws_subnet" "private_subnet_1" {
  vpc_id            = aws_vpc.vidify_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "vidify-private-subnet-1"
  }
}

resource "aws_subnet" "private_subnet_2" {
  vpc_id            = aws_vpc.vidify_vpc.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "vidify-private-subnet-2"
  }
}

# S3 Buckets for Video Storage
resource "aws_s3_bucket" "raw_videos" {
  bucket_prefix = "vidify-raw-videos-"

  tags = {
    Name        = "Vidify Raw Videos"
    Environment = "Production"
  }
}

resource "aws_s3_bucket" "processed_videos" {
  bucket_prefix = "vidify-processed-videos-"

  tags = {
    Name        = "Vidify Processed Videos"
    Environment = "Production"
  }
}

resource "aws_s3_bucket" "thumbnails" {
  bucket_prefix = "vidify-thumbnails-"

  tags = {
    Name        = "Vidify Thumbnails"
    Environment = "Production"
  }
}

# RDS Database for User and Channel Data
resource "aws_db_instance" "vidify_db" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "13.7"
  instance_class       = "db.t3.small"
  db_name              = "vidify"
  username             = "vidify_admin"
  password             = "placeholder_password"  # Replace with secure method in production
  parameter_group_name = "default.postgres13"
  skip_final_snapshot  = true
  multi_az             = true
  
  tags = {
    Name = "vidify-database"
  }
}

# DynamoDB Table for Video Metadata
resource "aws_dynamodb_table" "video_metadata" {
  name           = "VideoMetadata"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "videoId"

  attribute {
    name = "videoId"
    type = "S"
  }

  attribute {
    name = "channelId"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  global_secondary_index {
    name               = "ChannelIndex"
    hash_key           = "channelId"
    range_key          = "createdAt"
    write_capacity     = 5
    read_capacity      = 5
    projection_type    = "ALL"
  }

  tags = {
    Name = "vidify-video-metadata"
  }
}

# CloudFront Distribution for Content Delivery
resource "aws_cloudfront_distribution" "video_distribution" {
  origin {
    domain_name = aws_s3_bucket.processed_videos.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.processed_videos.bucket}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.processed_videos.bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "vidify-content-distribution"
  }
}

# Outputs
output "vpc_id" {
  value = aws_vpc.vidify_vpc.id
}

output "raw_videos_bucket" {
  value = aws_s3_bucket.raw_videos.bucket
}

output "processed_videos_bucket" {
  value = aws_s3_bucket.processed_videos.bucket
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.video_distribution.domain_name
}
