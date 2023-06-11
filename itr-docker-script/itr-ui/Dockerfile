# Build arguments
ARG NGINX_VERSION

# Build angular project
FROM node:18.15.0-alpine3.17 AS ui-builder

# Build arguments
ARG NGINX_VERSION

# Build external nginx module to hide server information in headers
FROM nginx:${NGINX_VERSION} AS nginx-builder

# Build angular project
# Build arguments
ARG NGINX_VERSION
ARG HEADER_MODULE_VERSION

RUN apt-get update && apt-get install -y wget

RUN wget "http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz" -O nginx.tar.gz && \
    wget "https://github.com/openresty/headers-more-nginx-module/archive/v${HEADER_MODULE_VERSION}.tar.gz" -O headers-more.tar.gz

RUN apt-get update && apt-get install -y \
  git \
  gcc \
  libc-dev \
  libpcre3-dev \
  zlib1g-dev \
  make \
  curl \
  gnupg \
  libxslt-dev \
  libgeoip-dev \
  libgd-dev

RUN mkdir -p /usr/src

RUN CONFARGS=$(nginx -V 2>&1 | sed -n -e 's/^.*arguments: //p') \
        tar -zxC /usr/src -f "nginx.tar.gz"

RUN tar -zxvC /usr/src -f "headers-more.tar.gz"

RUN HEADERSMOREDIR="/usr/src/headers-more-nginx-module-${HEADER_MODULE_VERSION}" && \
  cd /usr/src/nginx-${NGINX_VERSION} && \
  ./configure --without-http_autoindex_module --with-compat $CONFARGS --add-dynamic-module=$HEADERSMOREDIR && \
  make && make install

# Copy Angular build and the external nginx module from previous stages
FROM nginx:${NGINX_VERSION} as prod

COPY dist/ /usr/share/nginx/html

COPY --from=nginx-builder /usr/local/nginx/modules/ngx_http_headers_more_filter_module.so /usr/lib/nginx/modules/ngx_http_headers_more_filter_module.so

#COPY /nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080