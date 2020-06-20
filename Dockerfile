FROM node:6

RUN apt-get update

#Essentials
RUN apt-get install -y build-essential
RUN apt-get install -y apt-utils
RUN apt-get install -y openjdk-7-jdk
RUN apt-get install -y vim
RUN apt-get install -y git

#Electron
RUN apt-get install -y libnotify4
RUN apt-get install -y libxss1
RUN apt-get install -y libgtkextra-dev
RUN apt-get install -y libgconf2-dev
RUN apt-get install -y libnss3
RUN apt-get install -y libasound2
RUN apt-get install -y libxtst-dev
RUN apt-get install -y x11-apps
RUN apt-get install -y libx11-xcb-dev   #Unsure if this last one was necessary

#App
RUN apt-get install -y openvpn

WORKDIR /home/app

#Because I'm tired of re-downloading electron on re-builds
#ADD /usr/local/bin/electron /usr/local/bin/electron
RUN npm i electron -g

#App
RUN apt-get install -y sshpass
RUN apt-get install -y nmap
#RUN apt-get install -y iptables

ADD package.json /home/app/package.json
RUN npm install

ADD pub /home/app/pub

ADD src /home/app/src
RUN npm run release

ADD server /home/app/server

ADD run.sh /home/app/run.sh

CMD xeyes
