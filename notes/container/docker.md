---
layout: notes
permalink: /notes/container/docker/
title: Docker Cheat Sheet
---

# Docker Cheat Sheet

## Commands
```bash
#Obtain Docker client, API, Engine, containerd, runc, docker-init versions.
docker version

#Get more information about Docker configurations:
docker info

#Download the specified image from the registry:
docker pull registry:5000/alpine

#Retrieve detailed information about a container:
docker inspect <containerID>

#List information about Docker networks:
docker network ls

#Get an interactive shell inside a running container:
docker exec -it <containerID> /bin/sh

#Create a new image from changes to a container and push it to a registry:
docker commit <containerID> registry:5000/nome-do-container

#Export a container’s filesystem as a tar archive:
docker export -o alpine.tar <containerid>

#Save a Docker image to a tar archive:
docker save -o ubuntu.tar <image>

#List all running and stopped containers:
docker ps -a

#Stop a running container:
docker stop <containerID>

#Remove a container by its ID:
docker rm <containerID>

#List Docker images:
docker image ls

#Remove a Docker image by its ID:
docker rmi <imageID>

#Remove all stopped containers, unused networks, dangling images, and build cache:
docker system prune -a

#To execute a container:
docker run --name ubuntu_test -dt ubuntu:bionic

#Push the custom built image <dockerid>/modified_ubuntu:<tag> to a Docker registry:
docker push <dockerid>/modified_ubuntu:<tag>
```

### Docker Compose
1. Create and manage containers defined in YAML file(s).
2. Use .env file for environment variables configuration.

docker-compose.yml Example:
```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
    volumes:
      - ./webapp:/usr/share/nginx/html
    environment:
      - NGINX_PORT=80
    networks:
      - my-network
    depends_on:
      - db

  db:
    image: mysql:5.7
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=myapp_db
      - MYSQL_USER=myapp_user
      - MYSQL_PASSWORD=myapp_password
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - my-network

networks:
  my-network:

volumes:
  db-data:
```

Start:
```bash
docker-compose -f docker-compose.yml up -d
```

## Security Testing (Red Team Focus)
```bash 
# Enumerate all containers for sensitive data 
docker ps -a docker inspect <containerID> | grep -i password 

# Check for privileged containers 
docker inspect <containerID> | grep -i privileged 

# List exposed ports 
docker ps --format "{{.Names}}\t{{.Ports}}" 

# Find container capabilities 
docker inspect <containerID> | jq '.[] | .HostConfig.Capabilities' 

# Check volume mounts for host access 
docker inspect <containerID> | jq '.[] | .Mounts' 

# Test for root in container 
docker exec -it <containerID> whoami 

# Scan images for vulnerabilities 
trivy image <image-name> 

# Check for running processes in container 
docker top <containerID> 

# Inspect networks for misconfigurations 
docker network ls docker network inspect <network-name> 

# Extract secrets from environment 
docker inspect <containerID> | grep -i env 

# Test container breakout (if privileged) 
docker run -it --rm --privileged <image> /bin/sh 

# Check Docker daemon API exposure 
curl http://localhost:2375/_ping 

# List Docker volumes for sensitive data 
docker volume ls docker volume inspect <volume-name> 

# Test privilege escalation via mounted files 
docker exec -it <containerID> cat /host/etc/passwd 

# Scan for misconfigured permissions 
docker inspect <containerID> | jq '.[] | .User' 

# Check for host PID namespace 
docker inspect <containerID> | jq '.[] | .HostConfig.PidMode' 

# Test network namespace sharing 
docker exec -it <containerID> ip addr 

# Use sysdig for runtime monitoring 
sysdig -p "%evt.time %proc.name %container.name" container.name=<container>
```

### Automated Security Tools
Trivy: ```trivy image <image-name>```

Sysdig Falco: ```falco --pid <pid>```

Docker Bench for Security: ```docker run -it --rm -v /var/run/docker.sock:/var/run/docker.sock docker/docker-bench-security```

Clair: ```clairctl analyze <image>```

Aqua Security: ```aqua scan <container>```

Dagda: ```dagda scan <image>```