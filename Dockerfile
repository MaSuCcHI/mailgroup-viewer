FROM node:19-alpine3.15
WORKDIR /workspaces
COPY . .
WORKDIR app
RUN npm install
ENTRYPOINT []
ENV CI=true
#EXPOSE 3000
