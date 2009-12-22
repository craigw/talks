var sys  = require("sys"),
    http = require("http");
http.createServer(function(request, response) {
  setTimeout(function() {
    var headers = { "Content-Type": "text/plain" };
    response.sendHeader(200, headers);
    response.sendBody("Hello, World!\n");
    response.finish();
  }, 2000);
}).listen(8000);
sys.puts("> Running at http://127.0.0.1:8000/");