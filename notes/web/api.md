---
layout: notes
permalink: /notes/web/api/
title: Web Application API Testing
---

# Web Application API Testing

## API Enumeration
```bash
# Discover endpoints
curl -X GET http://example.com/api/

# Brute-force with ffuf
ffuf -u http://example.com/api/FUZZ -w wordlist.txt

# Check OpenAPI spec
curl http://example.com/api/swagger.json

# Use dirb for API paths
dirb http://example.com/api/ -r

# Enumerate with Arjun
arjun -u http://example.com/api -m GET
```

## Authentication Testing
```bash
# Test API auth
curl -H "Authorization: Bearer <token>" http://example.com/api

# Brute-force API key
hydra -l apiuser -P apikeys.txt http://example.com/api -t 4

# Check token expiration
jwt_tool <token> -exp

# Test OAuth flow
curl -X POST -d "grant_type=password" http://example.com/oauth/token
```

## Injection Testing
```bash
# Test SQL injection
curl "http://example.com/api/search?q=' OR 1=1 --"

# Test NoSQL injection
curl "http://example.com/api/search?q[]=[{'$gt':''}]"

# Test command injection
curl "http://example.com/api/exec?cmd=whoami"
# Use sqlmap for API
sqlmap -u http://example.com/api/search --data="q=test"

# Test XSS in JSON
curl -H "Content-Type: application/json" -d '{"input":"<script>alert(1)</script>"}' http://example.com/api
```

## Business Logic Testing
```bash
# Test rate limits
for i in {1..100}; do curl http://example.com/api; sleep 1; done

# Check privilege escalation
curl -H "role:admin" http://example.com/api/admin

# Test idempotency
curl -X POST -d "action=delete" http://example.com/api

# Validate input bounds
curl -d "amount=1000000" http://example.com/api/transaction
```

## Security Headers and Misconfigurations
```bash
# Check headers
curl -I http://example.com/api

# Test CORS
curl -H "Origin: http://attacker.com" -I http://example.com/api

# Check for exposed endpoints
nikto -h http://example.com/api

# Test HSTS bypass
curl -k https://example.com/api
```

## Tools
- curl: ```curl -X GET http://example.com/api```
- ffuf: ```ffuf -u http://example.com/api/FUZZ -w wordlist.txt```
- sqlmap: ```sqlmap -u http://example.com/api```
- Postman: manual API testing
- OWASP ZAP: manual API testing
- Arjun: ```arjun -u http://example.com/api```
- jwt_tool: ```jwt_tool <token>```