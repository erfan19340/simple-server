exports.configs = {
    hostname: 'http://localhost:8080',
    root: __dirname,
    controllersDir: 'controllers',
    viewsDir: 'view',
    publicDir: './public',
    uploadDir: __dirname + '/public/uploads',
    templates: {
        notFound: 'errors/not_found.html'
    }
}