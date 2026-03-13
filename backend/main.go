package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/mem"
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
		cpuUsage := 0.0
		if len(cpuPercent) > 0 {
			cpuUsage = cpuPercent[0]
		}

		// Get memory usage
		vmStat, _ := mem.VirtualMemory()
		memUsage := vmStat.UsedPercent

		// Get disk usage
		diskStats, _ := disk.Usage("/")
		diskUsage := diskStats.UsedPercent

		// Get network statistics
		netStats, _ := net.IOCounters(true)
		netSent := uint64(0)
		netRecv := uint64(0)
		if len(netStats) > 0 {
			for _, iface := range netStats {
				netSent += iface.BytesSent
				netRecv += iface.BytesRecv
			}
		}

		// Prepare JSON output to match frontend expectations
		msg := fmt.Sprintf(`{
			"cpu": %.2f,
			"memory": %.2f,
			"disk": %.2f,
			"networkSent": %d,
			"networkRecv": %d
		}`, cpuUsage, memUsage, diskUsage, netSent, netRecv)

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
