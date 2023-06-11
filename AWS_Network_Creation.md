itr Environment setup HLF V2.2.0
======================================================

# BCOSE scripts and configuration modification

## Base AWS Instance
1. Create base AWS instance with following configuration  
* OS : Ubuntu 18.04 64bit
* Instance Type : m4.large
* Storage : 50GiB  
2. SSH the instance through Bastion server. [Note: Replace << pem file >> with actual .pem file name.]
```
        [user@<bastion-ip> ~]$ ssh -i << pem file>> ubuntu@<base-aws-ip>
```
> **Note**:  All following commands are executed on newly created instance, unless mentioned otherwise.  

3. Update the packages for Ubuntu OS.  
Below installation steps may ask to confirm whether to upgrade already existing packages or not.  
Please keep the local packages as it is and proceed.
```
        sudo apt update
        
        sudo apt upgrade
```
4. To update host IP, create “.update-my-host” file in `/opt` directory.
```
        cd /opt/
        
       sudo  vi .update-my-host
```
> and paste below content in file:
```
        #!/bin/bash
        found=$(grep $(hostname) /etc/hosts|wc -l)
        
        if [ $found -eq 0 ]; then
          sudo cp /etc/hosts /etc/hosts_$(date +"%d%m%Y")_backup
          sudo sed -i 's/127.0.0.1/#127.0.0.1/g' /etc/hosts
          echo "127.0.0.1 $(hostname) localhost"|sudo tee -a /etc/hosts > /dev/null
        fi
```
5. Change permission of “.update-my-host” file and execute script to update IP address in hosts file.
```
        chmod 777 .update-my-host

        ./.update-my-host
```

## Install Docker  
1. Add Docker’s official GPG key.
```
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```
2. Verify that the key fingerprint is 9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88.
```
        sudo apt-key fingerprint 0EBFCD88
```
3. Add docker repository.
```
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
        
        sudo apt update
```
4. Install docker community edition (v 20.10.8-ce).
```
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update

sudo apt install docker-ce docker-ce-cli containerd.io


```
5. Check if docker is properly installed.
```
        sudo docker run hello-world
```
> **Output:** should contain following lines-
```
        Hello from Docker!  
        This message shows that your installation appears to be working correctly.
```  
6. Enable docker usage for general users.
```
        sudo usermod -aG docker $USER
```
7. Logout and login to the AWS instance. Then clean up the `hello-world` containers and images.
```
        docker run hello-world
        
        docker ps -a
        
        docker rm $(docker ps -aq)
        
        docker ps -a
        
        docker images
        
        // Replace <image_ID> with actual docker image ID from output of above command.
        docker rmi $(docker images -aq) --force
        
        docker images
```
8. Automatically start the Docker process at instance startup.
```
        sudo systemctl enable docker
```

## Install docker-compose
1. Docker-compose (v 1.23.2) can be installed as follows:
```
        sudo curl -L --fail "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        
        sudo chmod +x /usr/local/bin/docker-compose
```

## HLF Node SDK Client Setup
1. Install Node JS.
```
        curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

        sudo apt install nodejs

        sudo apt install build-essential
		
        sudo apt install npm@5.6.0 -g
```

## Copy BCOSE deployment scripts
1. Git clone the `SGA-ITR-Portal` repository

2. Copy the below files from location `SGA-ITR-Portal\bcose` to VM `bcose` folder.Replace the files from VM location
```
        cp -r /opt/SGA-ITR-Portal/bcose /opt/
```
3. Enable SQS config and queueUrl for Tecopesca ORG 
```
   /opt/SGA-ITR-Portal/itr-service/config/env/development.js

   property
   awsSQSConfig_tecopesca.enableSQSConsumer = true  
   awsSQSConfig_tecopesca.queueUrl = "https://sqs.us-east-2.amazonaws.com/055254863768/demo-gs1event-queue.fifo"
```
4. Enable KMS for JWT 
```
   /opt/SGA-ITR-Portal/itr-service/config/env/development.js

   property
    useKmsForJwt: true
```

## Installing Fluentd for logging
1. A shell script is provided to automate the installation process for each version.  
The shell script registers a new apt repository at `/etc/apt/sources.list.d/treasure-data.list` and installs the `td-agent deb` package.
```
        curl -L https://toolbelt.treasuredata.com/sh/install-ubuntu-trusty-td-agent2.sh | sh
```
2. Install plug-ins.
```
        sudo td-agent-gem install fluent-plugin-forest

        sudo td-agent-gem install fluent-plugin-record-reformer
```
3. Copy "td-agent.conf" file to its target location.
```
        sudo cp /opt/bcose/fluentd/td-agent.conf  /etc/td-agent/td-agent.conf
        
        rm -f /opt/bcose/td-agent.conf
```
4. Launch td-agent daemon.
```
        sudo service td-agent start
```
5. Check status of `td-agent`.
```
        sudo service td-agent status
```
1. All container logs are to be stored at `/opt/logs/` directory. Set `td-agent` as owner of this folder so that fluentd can manage logs.
```
        mkdir -p /opt/logs/application
        cd /opt
        chmod 777 -R logs

        cd /opt/logs
        sudo chown td-agent:td-agent application
```

# Setup Nginx, ui, service, blockListener in existing network.
# Nginx setup.

```
sudo apt-get install nginx
```
cd /etc/nginx

copy following code to nginx.conf

```
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
	include /etc/nginx/conf.d/*.conf;
    proxy_request_buffering off;
    client_max_body_size 100m;
    proxy_max_temp_file_size 0;

    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }

    server {
        listen 80;
        server_name 3.111.190.164;
        add_header Access-Control-Allow-Origin *;

        root /opt/SGA-ITR-Portal/itr-docker-script/itr-ui/dist/itr-ui;
        index index.html;

        location / {
        try_files $uri $uri/ /index.html;
        }

        # Backend
        location /api {
            rewrite /api/(.*) /$1  break;
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Scheme $scheme;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://172.18.0.3:1337/;
            proxy_redirect off;
            proxy_request_buffering off;
            client_max_body_size 100m;
            proxy_max_temp_file_size 0;
        }

    }
}

```
nginx -t

sudo service nginx restart


## Setup UI, Service BlockListener

### Create Docker images for UI, Service BlockListener
```
 cd /opt/SGA-ITR-Portal/itr-docker-script/itr-db

        sed -i -e 's/\r$//' init-db stop-db

        chmod 777 init-db stop-db

        ./stop-db
        
        sudo rm -rf /opt/SGA-ITR-Portal/itr-docker-script/itr-db/data/*

        ./init-db
```
1. Execute the following commands to create docker image for ui
```	
        export SGA_REPO_HOME=/opt/SGA-ITR-Portal

        cd /opt/SGA-ITR-Portal/itr-docker-script/itr-ui

        chmod 777 ./image-build

       ./image-build
        
```
2. Execute the following commands to create docker image for service
```
        cd /opt/SGA-ITR-Portal/itr-docker-script/itr-service

        chmod 777 image-build

        ./image-build
```


```

### Create Docker containers for UI, Service BlockListener
2. Execute the following commands to create docker container for service
```
        cd /opt/SGA-ITR-Portal/itr-docker-script/itr-service

        chmod 777 init-server stop-server

        ./init-server
```
3. Execute the following commands to create docker container for ui
```
        cd /opt/SGA-ITR-Portal/itr-docker-script/itr-ui

        chmod 777 init-ui

        ./init-ui
```
## Setting up cron job to restart application once in a week
1. Edit cron tab and set scheduler
```
        crontab -e
 
        45 23 * * 0 /opt/SGA-ITR-Portal/container-restart.sh >> /opt/logs/cron-log.txt 2>&1
```
