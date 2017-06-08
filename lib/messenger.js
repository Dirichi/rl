class Messenger {
  constructor(socket) {
    this.socket = socket
  }

  send(title, data){
    this.socket.emit(title, data);
  }

  setSocket(socket){
    this.socket = socket
  }
}
