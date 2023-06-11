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

## Setting up NTP
It’s HIGHLY recommended to set up NTP daemon (e.g. chrony, ntpd etc.) on the node to have accurate current timestamp and accurate working of Fluentd.

1. Update and Install the chrony package.
```
        sudo apt update

        sudo apt install chrony
```
2. Open the “/etc/chrony/chrony.conf” file using a text editor (such as vim or nano).
```
        sudo vim /etc/chrony/chrony.conf
```
> And add the following line **after any other server or pool statements** that are already present in the file, and save the changes.
```
        server 169.254.169.123 prefer iburst
```
3. Restart the `chrony` service.
```
        sudo /etc/init.d/chrony restart
```
> **Output:**
```
        [ ok ] Restarting chrony (via systemctl): chrony.service.
```
4. Verify that `chrony` is using the 169.254.169.123 IP address to synchronize the time.
```
        chronyc sources -v
```
>**Note:** The "Number of sources" may vary depending on the number of sources available at that point of time.   
> **Output:**
```
        210 Number of sources = 10
        
          .-- Source mode  '^' = server, '=' = peer, '#' = local clock.
         / .- Source state '*' = current synced, '+' = combined , '-' = not combined,
        | /   '?' = unreachable, 'x' = time may be in error, '~' = time too variable.
        ||                                                 .- xxxx [ yyyy ] +/- zzzz
        ||      Reachability register (octal) -.           |  xxxx = adjusted offset,
        ||      Log2(Polling interval) --.      |          |  yyyy = measured offset,
        ||                                \     |          |  zzzz = estimated error.
        ||                                 |    |           \
        MS Name/IP address         Stratum Poll Reach LastRx Last sample
        ===============================================================================
        ^* 169.254.169.123               3   6     7     1  -4082ns[-2775ns] +/- 1277us
        ^- golem.canonical.com           2   6     7     0  +1335us[+1336us] +/-  100ms
        ^- alphyn.canonical.com          2   6     7     0  +5888us[+5889us] +/-  148ms
        ^- pugot.canonical.com           2   6     7     2  +1639us[+1641us] +/-   92ms
        ^- chilipepper.canonical.com     2   6    17     1  +1732us[+1732us] +/-   84ms
        ^- fwdns2.vbctv.in               2   6    17     1  +3131us[+3131us] +/-  101ms
        ^? t2.time.tw1.yahoo.com         0   6     0     -     +0ns[   +0ns] +/-    0ns
        ^? ntp2.v6.mfeed.ad.jp           0   6     0     -     +0ns[   +0ns] +/-    0ns
        ^? 2402:f000:1:416:101:6:6:>     0   6     0     -     +0ns[   +0ns] +/-    0ns
        ^? t1.time.sg3.yahoo.com         0   6     0     -     +0ns[   +0ns] +/-    0ns
```
5. Verify the time synchronization metrics that are reported by `chrony`.
```
        chronyc tracking
```
> **Output:**
```
        Reference ID    : A9FEA97B (169.254.169.123)
        Stratum         : 4
        Ref time (UTC)  : Wed Jan 16 09:00:12 2019
        System time     : 0.000000119 seconds fast of NTP time
        Last offset     : +0.000000194 seconds
        RMS offset      : 0.000000194 seconds
        Frequency       : 11.285 ppm fast
        Residual freq   : +0.673 ppm
        Skew            : 0.071 ppm
        Root delay      : 0.000426313 seconds
        Root dispersion : 0.001080259 seconds
        Update interval : 1.3 seconds
        Leap status     : Normal
```
6. Check current settings for maximum number of file descriptors.  
**Note**: Do not Copy/Paste. Instead type below command on console.
```
        ulimit –n
        //Shows current limit e.g. 1024
```
7. Increase Max # of file descriptors in `/etc/security/limits.conf` file.
```
        sudo vim /etc/security/limits.conf
```
> And add following lines:
```
        root soft nofile 65536
        root hard nofile 65536
        * soft nofile 65536
        * hard nofile 65536
```
8. **Reboot the machine**

9. Optimize Network kernel parameters.  
For high load environments consisting of many Fluentd instances, please add these parameters to “/etc/sysctl.conf” file.  
```
        sudo vim /etc/sysctl.conf
```
> And add below parameters to it:
```
        net.core.somaxconn = 1024
        net.core.netdev_max_backlog = 5000
        net.core.rmem_max = 16777216
        net.core.wmem_max = 16777216
        net.ipv4.tcp_wmem = 4096 12582912 16777216
        net.ipv4.tcp_rmem = 4096 12582912 16777216
        net.ipv4.tcp_max_syn_backlog = 8096
        net.ipv4.tcp_slow_start_after_idle = 0
        net.ipv4.tcp_tw_reuse = 1
        net.ipv4.ip_local_port_range = 10240 65535
```
> Execute below command to have the changes take effect.
```
        sudo sysctl -p
```

## Install jq
1. The `jq` is needed for customization of network and JSON data parsing. It can be installed as follows:
```
        sudo apt-get install jq
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

# Setup ui, service, blockListener in existing network.

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
