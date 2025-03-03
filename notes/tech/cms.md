---
layout: notes
permalink: /notes/tech/cms/
title: Pentesting CMS
---

# Pentesting CMS

## Django
```bash
#Admin panel endpoint
/admin/login/?next=/admin/

#Default credentials
admin:admin
```

## Kentico
```bash
#Default credentials
administrator:<blank>

#Kentico version disclosure
/CMSPages/GetDocLink.ashx
/CMSHelp/ 

#Kentico exploit 11-12
[Kentico-RCE](https://github.com/Kr0ff/Kentico-12-RCE-via-SyncServer)

#Kentico user information disclosure
/CMSModules/Messaging/CMSPages/PublicMessageUserSelector.aspx
```

## Magento
Magento CMS scanner\
[magescan](https://github.com/steverobbins/magescan)
```bash
Usage:
php magescan.phar scan:all www.example.com
```
Other references:\
[Magento Security Resources](https://github.com/gwillem/magento-security-resources)


## Typo3

Typo3 CMS scanner\
[Typo3Scan](https://github.com/whoot/Typo3Scan)
```bash
Usage:
python3 typo3scan.py -d http://dev01.vm-typo3.loc/ --vuln
```

## WordPress

WPScan tool:\
[WPScan](https://github.com/wpscanteam/wpscan)
```bash
#Password BruteForce
wpscan --url https://site.com/wp-login.php -e u -U admin --passwords ~/SecList/Passwords/2020-200_most_used_passwords.txt

#Brute force found users and search for vulnerabilities using a free API token (up 50 searchs)
wpscan --rua -e ap,at,tt,cb,dbe,u,m --url http://www.domain.com [--plugins-detection aggressive] --api-token zO9kMVezPe57YcCK8a1kDIsKjEhKzORz2wbhUSQYXcU --passwords ~/Tools/SecLists/Passwords/probable-v2-top1575.txt 

#SecLists:
- /Passwords/2020-200_most_used_passwords.txt
- /Passwords/Honeypot-Captures/Sucuri-Top-Wordpress-Passwords.txt
- /Passwords/Common-Credentials/500-worst-passwords.txt
```

Wordpress Cheat-Sheet Wiki:\
[hacktricks](https://book.hacktricks.xyz/pentesting/pentesting-web/wordpress)\
[hackertarget.com](https://hackertarget.com/attacking-wordpress/)

WordPress SSRF tool:\
[quickpress](https://github.com/0xrodt/quickpress)
```bash
#Usage
./quickpress -target https://target.com -server http://burpcollaborator.net
```

Collection of Exploits, CVES(Unauthenticated) and Wordpress Scanners\
[Wordpress-Exploits](https://github.com/prok3z/Wordpress-Exploits)