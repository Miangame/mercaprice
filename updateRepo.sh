#!/bin/bash

git pull
yarn install
yarn prisma generate
yarn prisma migrate dev