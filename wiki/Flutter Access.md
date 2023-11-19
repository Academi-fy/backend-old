Connect zum Server:

```

final channel = WebSocketChannel.connect(
  Uri.parse('wss://echo.websocket.events'),
);

```

Message Listen:

```

StreamBuilder(
  stream: channel.stream,
  builder: (context, snapshot) {
    return Text(snapshot.hasData ? '${snapshot.data}' : '');
  },
)

```

Senden von Nachrichten:

```
channel.sink.add({});
```

Wie eine Request aussieht:

```javascript

const request = {
    event: "SEND_MESSAGE",
    payload: {
        sender: "",  //sender id
        data: { /*message Objekt*/ }
    }
}

```