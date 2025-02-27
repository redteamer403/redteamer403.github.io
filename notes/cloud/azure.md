---
layout: notes
permalink: /notes/cloud/azure/
title: Azure Pentesting Notes
---

# Azure Pentesting Notes
Azure portal URL:
```
https://portal.azure.com/
```
Office365 Admin Portal:
```
https://admin.microsoft.com/
```
Office365 User Portal:
```
https://office.com/
```

### SSRF
```
curl -H "Metadata:true" "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/"

http://169.254.169.254/metadata/instance/network/interface/0
```

## Authentication

Using username + password:
```
az login
```
Using Service Principal (App ID + Password):
```
az login —service-principal -u ApplicationID -p Password —tenant TenantID
```
AZ Powershell (Username + Password)
```
Connect-AzAccount
```
AZ Powershell Service Principal (App ID + Secret)
```
$cred = Get-Credential [ Where, Username = Application ID & Password = Client Secret ]

Connect-AzAccount -ServicePrincipal -Tenant TenantID -Credential $cred
```
AZ Powershell Authentication Access Token (AccountID + Access Token)
```
az account get-access-token —resource=https://management.azure.com

Connect-AzAccount -AccessToken AADAccessToken
```
MgGraph Powershell (Username + Password)
```
Connect-MgGraph -Scopes “Directory.Read.All”

Get-MgContext
```

## Enumeration

Check if target organization is using Entra ID (Azure ID) as a IDP [Identiy Provider]
```
https://login.microsoftonline.com/getuserrealm.srf?login=Username@DomainName&xml=1
```
> ⚠️ If NameSpaceType is Managed - that means it is using Azure ID (Entra ID) as a Identity Provider, we can perform password spraying/bruteforce attack

> ⚠️ If Federated - that means it is using other authentication (OneLogin, OKKTA, ActiveDirectory etc.)

Connect with credentials using MgGraph
```
pwsh

Connect-MgGraph -Scopes “Directory.Read.All”
```
Get currently logged-in session information
```
Get-MgContect
```

### Entra ID Directory Role
Get a List of all directory roles
```
Get-MgDirectoryRole | ConvertTo-Json
```
Get a list of members of a directory roles
```
Get-MgDirectoryRoleMember -DirectoryRoleId [Directory RoleID] -All | ConvertTo-Json
```

### Entra ID Users
Get a lists of users in Entra ID
```
Get-MgUser
```
Get a list of group, specified member part of
```
Get-MgUserMemberOf -UserId [UserID]
```

### Entra ID Groups

Get a lists of all groups in Entra ID
```
Get-MgGroup
```
Get a List of members of a group
```
Get-MgGroupMember -GroupId [GroupID] | ConvertTo-Json
```

### Entra ID Application / Service Principal 

Get the list of all applications.
```
Get-MgApplication
```
Get the details about a specific applications.
```
Get-MgApplication -ApplicationId [ApplicationObjectID] | ConvertTo-Json
```
Get the detail about owner of the specified applications.
```
Get-MgApplicationOwner -ApplicationId [ApplicationObjectID] | ConvertTo-Json
```
Get the details about application permission for an application.
```
$app= Get-MgApplication -ApplicationId [ApplicationObjectID]

$app.RequiredResourceAccess
```
Get the details of App Role for Microsoft Graph API.
```
$res=Get-MgServicePrincipal -Filter "DisplayName eq 'Microsoft Graph'"

$res.AppRoles | Where-Object {$_.ID -eq 'AppRoleID’} | ConvertTo-Json
```
Get the details about delegation permission for an application.
```
$app= Get-MgApplication -ApplicationId [ApplicationObjectID]

$app.Oauth2RequirePostResponse | ConvertTo-Json
```

## Enumeration: Azure Resource Manager

### Az Cli Configuration 

Get details about currently logged in session
```
az account show
```
Get the list of all available subscriptions
```
az account list --all
```
Get the details of a subscription
```
az account show -s Subscription-ID/Name
```

### Resource Group

Get the list of available resource group in current subscription
```
az group list -s Subscription-ID/Name
```
Get the list of available resource group in a specified subscription
```
az group list -s Subscription-ID/Name
```

### Azure Resources

Get the list of available resources in a current subscription
```
az resource list
```
Get the list of available resources in a specified resource group
```
az resource list --resource-group ResourceGroupName
```

### Role Assignment

Lists of roles assigned in specified subscription.
```
az role assignment list --subscription Subscription-ID/Name 
```
Lists of roles assigned in current subscription and inherited
```
az role assignment list -all
```
List of all roles assigned to an identity [user, service principal, identity]
```
az role assignment list --assignee ObjectID/Sign-InEmail/ServicePrincipal --all
```

### Role Definition

Lists of roles with assigned permission [Role Definition - For Inbuilt and Custom Role]
```
az role definition list
```
Get the full information about a specified role
```
az role definition list -n RoleName
```
Lists of custom role with assigned permissions
```
az role definition list --custom-role-only
```

## References and more techniques
[Hacking the Cloud](https://hackingthe.cloud/)

## Automated Enumeration Tools

### Enumeration

- [o365creeper](https://github.com/LMGsec/o365creeper) - Enumerate valid email addresses
- [CloudBrute](https://github.com/0xsha/CloudBrute) - Tool to find a cloud infrastructure of a company on top Cloud providers
- [cloud_enum](https://github.com/initstring/cloud_enum) - Multi-cloud OSINT tool. Enumerate public resources in AWS, Azure, and Google Cloud
- [Azucar](https://github.com/nccgroup/azucar) - Security auditing tool for Azure environments
- [CrowdStrike Reporting Tool for Azure (CRT)](https://github.com/CrowdStrike/CRT) - Query Azure AD/O365 tenants for hard to find permissions and configuration settings
- [ScoutSuite](https://github.com/nccgroup/ScoutSuite) - Multi-cloud security auditing tool. Security posture assessment of different cloud environments.
- [BlobHunter](https://github.com/cyberark/blobhunter) - A tool for scanning Azure blob storage accounts for publicly opened blobs
- [Grayhat Warfare](https://buckets.grayhatwarfare.com/) - Open Azure blobs and AWS bucket search
- [Office 365 User Enumeration](https://github.com/gremwell/o365enum) - Enumerate valid usernames from Office 365 using ActiveSync, Autodiscover v1 or office.com login page
- [CloudFox](https://github.com/BishopFox/cloudfox) - Automating situational awareness for cloud penetration tests
- [Monkey365](https://github.com/silverhack/monkey365) - Conduct Microsoft 365, Azure subscriptions and Azure Active Directory security configuration reviews
- [Azure-AccessPermissions](https://github.com/csandker/Azure-AccessPermissions) - PowerShell script to enumerate access permissions in an Azure AD environment
- [Prowler](https://github.com/prowler-cloud/prowler) - Perform AWS and Azure security best practices assessments, audits, incident response, continuous monitoring, hardening and forensics readiness

### Information Gathering

- [o365recon](https://github.com/nyxgeek/o365recon) - Information gathering with valid credentials to Azure
- [Get-MsolRolesAndMembers.ps1](https://gist.github.com/ciphertxt/2036e614edf4bf920796059017fbbc3d) - Retrieve list of roles and associated role members
- [ROADtools](https://github.com/dirkjanm/ROADtools) - Framework to interact with Azure AD
- [PowerZure](https://github.com/hausec/PowerZure) - PowerShell framework to assess Azure security
- [Azurite](https://github.com/FSecureLABS/Azurite) - Enumeration and reconnaissance activities in the Microsoft Azure Cloud
- [Sparrow.ps1](https://github.com/cisagov/Sparrow) - Helps to detect possible compromised accounts and applications in the Azure/M365 environment
- [Hawk](https://github.com/T0pCyber/hawk) - Powershell based tool for gathering information related to O365 intrusions and potential breaches
- [Microsoft Azure AD Assessment](https://github.com/AzureAD/AzureADAssessment) - Tooling for assessing an Azure AD tenant state and configuration
- [Cloud Katana](https://github.com/Azure/Cloud-Katana) - Unlocking Serverless Computing to Assess Security Controls
- [SCuBA M365 Security Baseline Assessment Tool](https://github.com/cisagov/ScubaGear) - Automation to assess the state of your M365 tenant against CISA's baselines

### Lateral Movement

- [Stormspotter](https://github.com/Azure/Stormspotter) - Azure Red Team tool for graphing Azure and Azure Active Directory objects
- [AzureADLateralMovement](https://github.com/talmaor/AzureADLateralMovement) - Lateral Movement graph for Azure Active Directory
- [SkyArk](https://github.com/cyberark/SkyArk) - Discover, assess and secure the most privileged entities in Azure and AWS
- [omigood (OM I GOOD?)](https://github.com/marcosimioni/omigood) - Scanner to detect VMs vulnerable to one of the "OMIGOD" vulnerabilities

### Exploitation

- [MicroBurst](https://github.com/NetSPI/MicroBurst) - A collection of scripts for assessing Microsoft Azure security
- [azuread_decrypt_msol_v2.ps1](https://gist.github.com/xpn/f12b145dba16c2eebdd1c6829267b90c) - Decrypt Azure AD MSOL service account
- [Microsoft-Teams-GIFShell](https://github.com/bobbyrsec/Microsoft-Teams-GIFShell) - Microsoft Teams can be leveraged by an attacker, to execute a reverse shell between an attacker and victim piped through malicious GIFs sent in Teams messages