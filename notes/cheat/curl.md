---
layout: notes
permalink: /notes/cheat/curl/
title: cURL Cheat Sheet
---

# cURL Cheat Sheet

```bash
#cURL GET Request
curl http://inlanefreight.com

#cURL GET Request Verbose
curl http://inlanefreight.com -v

#cURL Basic Auth login
curl http://admin:password@inlanefreight.com/ -vvv

#cURL Alternate Basic Auth login
curl -u admin:password http://inlanefreight.com/ -vvv

#cURL Basic Auth Login, Follow Redirection
curl -u admin:password -L http://inlanefreight.com/

#cURL GET Request With Parameter
curl -u admin:password 'http://inlanefreight.com/search.php?port_code=us'

#cURL POST Request
curl -d 'username=admin&password=password' -L http://inlanefreight.com/login.php

#cURL With Debugging
curl -d 'username=admin&password=password' -L http://inlanefreight.com/login.php -v

#cURL With Cookie
curl -d 'username=admin&password=password' -L --cookie-jar /dev/null http://inlanefreight.com/login.php -v

#cURL With Content Type
curl -H 'Content-Type: application/json' -d '{ "username" : "admin","password" : "password" }'

#cURL OPTIONS Request
curl -X OPTIONS http://inlanefreight.com/ -vv

#cURL PUT Request
curl -X PUT -d @test.txt http://inlanefreight.com/test.txt -vv

#cURL DELETE Request
curl -X DELETE http://inlanefreight.com/test.txt -vv
```