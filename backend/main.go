package main

import (
	"log"
	"net/http"
	"time"
	"fmt"

	"github.com/gorilla/websocket"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/mem"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/net"
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
		cpuPercent, _ := cpu.Percent(time.Second, false)
		cpuFormatted := fmt.Sprintf("%.2f", cpuPercent[0])
		msg := fmt.Sprintf("CPU Usage: %s%%", cpuFormatted)

		// Get memory usage
		vmStat, _ := mem.VirtualMemory()
		memFormatted := fmt.Sprintf("%.2f", vmStat.UsedPercent)
		msg += fmt.Sprintf(", Memory Usage: %s%%", memFormatted)

		// Get disk usage
		diskStats, _ := disk.Usage("/")
		diskFormatted := fmt.Sprintf("%.2f", diskStats.UsedPercent)
		msg += fmt.Sprintf(", Disk Usage: %s%%", diskFormatted)

		// Get network statistics
		netStats, _ := net.IOCounters(true)
		if len(netStats) > 0 {
			netFormatted := fmt.Sprintf("%.2f", float64(netStats[0].BytesSent))
			msg += fmt.Sprintf(", Network Sent: %s B", netFormatted)
		}

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