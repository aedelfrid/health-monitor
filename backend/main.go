package main

import (
	"log"
	"net/http"
	"time"
	"fmt"

	"github.com/gorilla/websocket"
	"github.com/shirou/gopsutil/cpu"
)

// WebSocket upgrader - allows us to upgrade HTTP connections to WebSocket connections
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for simplicity
	},
}


func reader(conn *websocket.Conn) {
	for {

		// Get CPU usage percentage
		percent, _ := cpu.Percent(time.Second, false)

		// Send the CPU usage percentage to the client
		//
		msg := fmt.Sprintf("%.2f", percent[0])

		if err := conn.WriteMessage(websocket.TextMessage, []byte(msg)); err != nil {
			log.Println("Disconnected", err)
			break
		}
	}
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("Client Connected")

	reader(ws)
}

func main() {
	http.HandleFunc("/ws", wsEndpoint)
	log.Println("Server started on :4000")
	log.Fatal(http.ListenAndServe(":4000", nil))
}