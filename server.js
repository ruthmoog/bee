import StaticServer from 'static-server';

const port = process.env.PORT || 8080;

const server = new StaticServer({
    rootPath: './static',            // required, the root of the server file tree
    port,               // required, the port to listen
    name: 'bumblebees',   // optional, will set "X-Powered-by" HTTP header
    cors: '*',                // optional, defaults to undefined
    followSymlink: true,      // optional, defaults to a 404 error
    templates: {
        notFound: '404.html'    // optional, defaults to undefined
    }
});

server.start(function () {
    console.log('Server listening to', server.port);
});