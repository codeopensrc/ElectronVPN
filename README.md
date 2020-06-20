# Heavily under construction

* Goal is a cross-platform, easy to use interface for VPN admins and VPN clients
to configure (and maybe connect) OpenVPN connections.



### To Run

Dev & Production system require:  
**[Docker](https://docs.docker.com/engine/installation/)** (Engine & Compose) (v2+)  

Inside root project directory with `docker-compose.yml` run:  
`docker-compose up [-d]`   

Check `HOST` under `HOST:CONTAINER` in `docker-compose.yml` for port  

### Development  
1) Edit `docker-compose.yml` to suit your needs   
2) Inside directory with `docker-compose.yml` run:  
`docker-compose up [-d]`  
3) To run webpack inside the container, in another tab/pane run:  
`docker exec CONTAINER_NAME npm run watch`  

### Consul

If using with consul, set `REGISTER_SERVICE` to `"true"`  
Modify `SERVICE_NAME` and `SERVICE_PORT`  
`IMAGE_VER` should be the version of the docker image being used  
