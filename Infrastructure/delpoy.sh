bash
#!/bin/bash
# Vidify Platform Deployment Script
# This script automates the deployment of Vidify infrastructure

# Set default environment
ENVIRONMENT=${1:-dev}
REGION=${2:-us-east-1}
STACK_NAME="vidify-${ENVIRONMENT}"

echo "Starting Vidify deployment for environment: ${ENVIRONMENT} in region: ${REGION}"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
  echo "Error: Environment must be dev, staging, or prod"
  exit 1
fi

# Check for required tools
for cmd in aws terraform jq; do
  if ! command -v $cmd &> /dev/null; then
    echo "Error: Required command '$cmd' not found"
    exit 1
  fi
done

# Verify AWS credentials
echo "Verifying AWS credentials..."
aws sts get-caller-identity > /dev/null || { echo "Error: Invalid AWS credentials"; exit 1; }

# Initialize Terraform
echo "Initializing Terraform..."
cd "$(dirname "$0")"
terraform init || { echo "Error: Terraform initialization failed"; exit 1; }

# Select workspace based on environment
echo "Selecting Terraform workspace: ${ENVIRONMENT}"
terraform workspace select ${ENVIRONMENT} || terraform workspace new ${ENVIRONMENT}

# Create S3 bucket for Terraform state if it doesn't exist
BUCKET_NAME="vidify-terraform-state-${ENVIRONMENT}"
if ! aws s3api head-bucket --bucket "${BUCKET_NAME}" 2>/dev/null; then
  echo "Creating S3 bucket for Terraform state: ${BUCKET_NAME}"
  aws s3 mb s3://${BUCKET_NAME} --region ${REGION}
  aws s3api put-bucket-versioning --bucket ${BUCKET_NAME} --versioning-configuration Status=Enabled
  aws s3api put-bucket-encryption --bucket ${BUCKET_NAME} --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'
fi

# Configure backend
cat > backend.tf << EOF
terraform {
  backend "s3" {
    bucket         = "${BUCKET_NAME}"
    key            = "terraform.tfstate"
    region         = "${REGION}"
    encrypt        = true
    dynamodb_table = "vidify-terraform-locks"
  }
}
EOF

# Create DynamoDB table for Terraform state locking if it doesn't exist
if ! aws dynamodb describe-table --table-name vidify-terraform-locks &>/dev/null; then
  echo "Creating DynamoDB table for Terraform state locking"
  aws dynamodb create-table \
    --table-name vidify-terraform-locks \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region ${REGION}
fi

# Create variable files for environment
cat > ${ENVIRONMENT}.tfvars << EOF
environment = "${ENVIRONMENT}"
region      = "${REGION}"
EOF

# Add environment-specific variables
case ${ENVIRONMENT} in
  dev)
    cat >> ${ENVIRONMENT}.tfvars << EOF
instance_type = "t3.medium"
min_capacity  = 1
max_capacity  = 2
EOF
    ;;
  staging)
    cat >> ${ENVIRONMENT}.tfvars << EOF
instance_type = "t3.large"
min_capacity  = 2
max_capacity  = 4
EOF
    ;;
  prod)
    cat >> ${ENVIRONMENT}.tfvars << EOF
instance_type = "m5.xlarge"
min_capacity  = 3
max_capacity  = 10
EOF
    ;;
esac

# Plan deployment
echo "Planning deployment for ${ENVIRONMENT}..."
terraform plan -var-file="${ENVIRONMENT}.tfvars" -out="tfplan" || { echo "Error: Terraform plan failed"; exit 1; }

# Confirm deployment
read -p "Do you want to apply this plan? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Deployment canceled"
  exit 0
fi

# Apply deployment
echo "Applying deployment for ${ENVIRONMENT}..."
terraform apply "tfplan" || { echo "Error: Terraform apply failed"; exit 1; }

# Deploy Lambda functions
echo "Deploying Lambda functions..."
for function in coordinator validator transcoder analyzer thumbnail; do
  echo "Deploying ${function} Lambda function..."
  
  # Create deployment package
  cd "../src/processing/${function}"
  zip -r "../../../infrastructure/lambda/${function}.zip" .
  
  # Deploy or update Lambda function
  FUNCTION_NAME="vidify-${function}-${ENVIRONMENT}"
  
  if aws lambda get-function --function-name ${FUNCTION_NAME} &>/dev/null; then
    # Update existing function
    aws lambda update-function-code \
      --function-name ${FUNCTION_NAME} \
      --zip-file fileb://../../../infrastructure/lambda/${function}.zip \
      --region ${REGION}
  else
    # Create new function using role from Terraform output
    ROLE_ARN=$(terraform output -raw lambda_role_arn)
    
    aws lambda create-function \
      --function-name ${FUNCTION_NAME} \
      --runtime nodejs16.x \
      --handler index.handler \
      --role ${ROLE_ARN} \
      --zip-file fileb://../../../infrastructure/lambda/${function}.zip \
      --region ${REGION}
  fi
  
  cd "../../../infrastructure"
done

# Deploy frontend
echo "Deploying frontend..."
cd "../src/ui"
npm run build

# Upload to S3 bucket from Terraform output
S3_BUCKET=$(terraform -chdir=../../infrastructure output -raw frontend_bucket)
aws s3 sync build/ s3://${S3_BUCKET}/ --delete

# Create CloudFront invalidation if in production
if [[ "${ENVIRONMENT}" == "prod" ]]; then
  DISTRIBUTION_ID=$(terraform -chdir=../../infrastructure output -raw cloudfront_distribution_id)
  aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths "/*"
fi

echo "Deployment complete for environment: ${ENVIRONMENT}"
