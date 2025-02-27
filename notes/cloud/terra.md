---
layout: notes
permalink: /notes/cloud/terra/
title: Terraform Cheat Sheet
---

# Terraform Cheat Sheet

### Terraform Enterprise: Attack the Medatada Servie
[https://hackingthe.cloud](https://hackingthe.cloud/terraform/terraform_enterprise_metadata_service/)

## Commands
```bash
# Initialize Terraform working directory
terraform init

# Create execution plan
terraform plan

# Apply changes
terraform apply

# Destroy infrastructure
terraform destroy

# Format Terraform files
terraform fmt

# Validate configuration
terraform validate

# Show current state
terraform show

# Update state file
terraform refresh

# Lock state file
terraform force-unlock <lock_id>

# Import existing resource
terraform import aws_instance.example i-abcd1234

# List providers
terraform providers

# Output values
terraform output

# Graph dependencies
terraform graph

# Test module
terraform test

# Check state for drift
terraform plan -detailed-exitcode
```

## Terraform Configuration (Examples)
### Basic AWS EC2 Instance
```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  tags = {
    Name = "web-server"
  }
  security_groups = [aws_security_group.web_sg.name]
}

resource "aws_security_group" "web_sg" {
  name        = "web-sg"
  description = "Allow HTTP and SSH"
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### Security-Focused Terraform Configuration
```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "secure_instance" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  tags = {
    Name = "secure-server"
  }
  iam_instance_profile = aws_iam_instance_profile.web_profile.name
  security_groups      = [aws_security_group.secure_sg.name]
  user_data = <<-EOF
              #!/bin/bash
              echo "Restricting permissions"
              chown root:root /etc
              chmod 755 /etc
              EOF
  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }
}

resource "aws_security_group" "secure_sg" {
  name        = "secure-sg"
  description = "Allow restricted SSH only"
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_iam_instance_profile" "web_profile" {
  name = "web-profile"
  role = aws_iam_role.web_role.name
}

resource "aws_iam_role" "web_role" {
  name = "web-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}
```

## Security Testing (Red Team Focus)
```bash
# Enumerate Terraform state for sensitive data 
terraform show | grep -i password 

# Check state file for exposed secrets 
cat terraform.tfstate | jq '.resources[].values' 

# Scan Terraform files for hardcoded secrets 
trufflehog --json terraform/*.tf 

# Test for over-privileged IAM roles 
terraform plan | grep -i "aws_iam_role_policy" 

# Check for open security groups 
terraform show | grep -i "0.0.0.0/0" 

# Validate network exposure 
terraform validate && terraform plan | grep -i "port 22" 

# Test for misconfigured S3 buckets 
terraform show | grep -i "aws_s3_bucket" | grep -i "public" 

# Check for unencrypted EBS volumes 
terraform show | grep -i "encrypted=false" 

# Audit provider configurations 
terraform providers -v 

# Test for default passwords in variables 
cat variables.tf | grep -i "default.*password" 

# Inspect module dependencies 
terraform graph | grep -i module 

# Check for host access via user data 
terraform show | grep -i "user_data.*chmod" 

# Test for container privileges in ECS 
terraform show | grep -i "privileged=true" 

# Scan for misconfigured Kubernetes resources 
terraform show | grep -i "k8s_" 

# Use tfsec for static analysis 
tfsec . 

# Check for drift in infrastructure 
terraform plan -detailed-exitcode 

# Test for exposed RDS instances 
terraform show | grep -i "aws_db_instance" | grep -i "publicly_accessible=true"
```

## Automated Security Tools
tfsec: ```tfsec .```

TruffleHog: ```trufflehog --json terraform/*.tf```

Checkov: ```checkov -d .```

Terrascan: ```terrascan scan -i terraform```

Kics: ```kics scan -p terraform/```

Open Policy Agent (OPA): ```opa eval -i terraform.rego -d terraform/```

HashiCorp Sentinel: ```sentinel apply -plan terraform.plan```

Driftctl: ```driftctl scan```

TFLint: ```tflint --init && tflint```