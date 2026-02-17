FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    g++ \
    librdkafka-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
