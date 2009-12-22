var sys = require("sys"),
    tcp = require("tcp");

var server = tcp.createServer(function(connection) {
  connection.hasHelo = function() {
    return this.conversation[0] == "HELO";
  }

  connection.conversationOver = function() {
    sys.debug(this.conversation.join("\n"));
    return this.conversation[conversation.length - 1] == ".";
  }

  connection.log = function(data) {
    var stripped = data.replace(/(\r|\n)+$/, '');
    sys.debug(this.conversation.length.toString() + ": " + stripped);
    this.conversation[this.conversation.length] = stripped;
  }

  connection.addListener("connect", function(client) {
    // Could do DNSBL checking here.
    this.conversation = [];
  });

  connection.addListener("receive", function(data) {
    this.log(data);
    if(this.readyState == "closed" || this.readyState == "readOnly") { return; }

    if(!this.hasHelo()) {
      connection.send("503 Please introduce yourself first");
      connection.close();
      return;
    }

    if(data.replace(/\r|\n/, '').match(/^HELO$/)) {
      connection.send("250 " + server.host + " HELO " + this.remoteAddress);
    }

    if(this.conversationOver()) {
      connection.send("250 ABC1234567890 Message accepted for delivery");
      sys.debug("Conversation:\n" + this.conversation);
    }
  });

  connection.addListener("eof", function() {
    sys.puts("DISCONNECT FROM [" + connection.remoteAddress + "]");
    connection.close();
  });
});
server.listen(2525, "localhost");