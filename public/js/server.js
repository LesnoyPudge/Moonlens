// const http = require('http');
// const path = require('path');
// const fs = require('fs');
// const mysql = require('mysql');
// const url = require('url');
// const chat = require('./chat');

// const hostname = '127.0.0.1';
// const port = process.env.PORT || 4000;


// // const connection = mysql.createConnection({
// //     host     : '127.0.0.1',
// //     user     : 'root',
// //     database : 'moonlens',
// //     password : ''
// // });

// //   connection.connect(function(err) {
// //     if (err) {
// //         console.error('error connecting: ' + err.stack);
// //         return;
// //     }
   
// //     console.log('connected as id ' + connection.threadId);
// // });

// // connection.query('SELECT * FROM `country`', function (error, results, fields) {
// //     if (error) throw error;
// //     // connected!
// //     console.log(results[0]['country_name']);
// // });

// // connection.end(function(err) {
// //     if (err) {
// //         console.error('error connecting: ' + err.stack);
// //         return;
// //     }
// //     console.log('database is closed');
// // });




// const server = http.createServer((req, res) => {

//     let filePath = path.normalize(path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url));
//     const ext = path.extname(filePath);
//     let contentType = 'text/html';

//     switch (ext) {
//         case '.css':
//             contentType = 'text/css';
//             break;
//         case '.js':
//             contentType = 'text/javascript';
//             break;
//         default:
//             contentType = 'text/html';
//             break;
//     }

//     if (!ext) {
//         filePath += '.html';
//     }

//     // fs.readFile(filePath, (err, content) => {
//     //     if (err) {
//     //         fs.readFile(path.normalize(path.join(__dirname, '..', 'error.html')), (err, data) => {
//     //             // console.log(`err: ${path.normalize(path.join(__dirname, '..', 'error.html'))}`)
//     //             if (err) {
//     //                 res.writeHead(500);
//     //                 res.end('error');
//     //             } else {
//     //                 res.writeHead(200, {
//     //                     'Content-Type': contentType
//     //                 });
//     //                 res.end(data);
//     //             }
//     //         });         
//     //     } else {
//     //         res.writeHead(200, {
//     //             'Content-Type': contentType
//     //         });
//     //         res.end(content);
//     //     }
//     // })

//     // console.log(req.method, req.url);
//     // let urlParsed = url.parse(req.url, true);
//     // if (urlParsed.pathname === '/echo' && urlParsed.query.message) {
//     //     res.setHeader('Cache-control', 'no-cache');
//     //     res.end(urlParsed.query.message);
//     // } else {
//     //     res.statusCode = 404;
//     //     res.end('Page not found');
//     // }
//     // console.log(req.headers);
//     console.log('req.url: ', req.url);

//     switch (req.url) {
//         case '/subscribe':
//             chat.subscribe(req, res);
//             break;

//         case '/publish':
//             let body = '';
//             console.log('body: до readable ', body);
//             req.on('readable', () => {
//                 let msg = req.read();
//                 console.log('msg: ', msg);
//                 if (msg != null) {
//                     body += msg;
//                     console.log('body += req.read(): ', body); 
//                 }
//                 if (body.length > 1e4) {
//                     res.statusCode = 413;
//                     res.end('big message');
//                 }
//             });
//             req.on('end', () => {
//                 try {
//                     console.log('body: ', body);
//                     console.log('parsed body: ', JSON.parse(body))
//                     body = JSON.parse(body);
//                 } catch (e){
//                     console.log(e);
//                     console.log('bad request');
//                     res.statusCode = 400;
//                     res.end('bad request');
//                     return;
//                 }
                
//                 chat.publish(body);
//                 res.end('ok');
//             });
//             break;

//         default:
//             let file = new fs.ReadStream(filePath);
//             console.log('default');
//             sendFile(file, res);
//             break;
//     }

//     // console.log(filePath);
//     // let file = new fs.ReadStream(filePath);
//     // sendFile(file, res);

// });

// // server.listen(port, hostname, () => {
// //     console.log(`Server running at http://${hostname}:${port}/`);
// // });

// function sendFile(file, res) {

//     file.pipe(res);

//     file.on('error', function(err) {
//         res.statusCode = 500;
//         res.end("Server Error");
//         console.error(err);
//     });

//     file
//         .on('open',function() {
//         console.log("open");
//         })
//         .on('close', function() {
//         console.log("close");
//         });

//     res.on('close', function() {
//         file.destroy();
//     });

// }

// let serv = server;
// module.exports = serv;