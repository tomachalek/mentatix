all : client-devel
production :  client-production
.PHONY: all client-devel client-production devel-server production
client-production :
	nodejs node_modules/webpack/bin/webpack.js --mode production --config webpack.prod.js
client-devel :
	nodejs node_modules/webpack/bin/webpack.js --mode development --config webpack.dev.js
devel-server :
	nodejs node_modules/webpack-dev-server/bin/webpack-dev-server.js --mode development --config webpack.dev.js
