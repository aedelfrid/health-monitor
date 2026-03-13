"use client";

import React, { useEffect, useState } from "react";

export default function SystemMonitor() {
    const [cpuUsage, setCpuUsage] = useState(0);
    const [memoryUsage, setMemoryUsage] = useState(0);
    const [diskUsage, setDiskUsage] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);
    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:4000/ws");
        socket.onopen = () => {
            setIsConnected(true);
        };
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setCpuUsage(data.cpu);
            setMemoryUsage(data.memory);
            setDiskUsage(data.disk);
            setUploadSpeed(data.networkSent);
            setDownloadSpeed(data.networkRecv);
        };
        socket.onclose = () => {
            setIsConnected(false);
        };
        return () => {
            socket.close();
        }
    }, []);

    return (
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-400 font-mono text-xs uppercase tracking-widest">System Metrics</h3>
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                        {isConnected ? 'Live' : 'Offline'}
                    </span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <span className="text-5xl font-black text-white tracking-tighter">
                        {cpuUsage.toFixed(1)}%
                    </span>
                    <span className="text-slate-500 text-sm font-medium pb-1">CPU Load</span>
                </div>

                {/* The Animated Progress Bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000 ease-out"
                        style={{ width: `${cpuUsage}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-2 mt-4">
                <div className="flex justify-between items-end">
                    <span className="text-5xl font-black text-white tracking-tighter">
                        {memoryUsage.toFixed(1)}%
                    </span>
                    <span className="text-slate-500 text-sm font-medium pb-1">Memory Usage</span>
                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all duration-1000 ease-out"
                        style={{ width: `${memoryUsage}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-2 mt-4">
                <div className="flex justify-between items-end">
                    <span className="text-5xl font-black text-white tracking-tighter">
                        {diskUsage.toFixed(1)}%
                    </span>
                    <span className="text-slate-500 text-sm font-medium pb-1">Disk Usage</span>
                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000 ease-out"
                        style={{ width: `${diskUsage}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-2 mt-4">
                <div className="flex justify-between items-end">
                    <span className="text-5xl font-black text-white tracking-tighter">
                        {uploadSpeed.toFixed(1)} Mbps
                    </span>
                    <span className="text-slate-500 text-sm font-medium pb-1">Upload Speed</span>
                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(uploadSpeed / 100, 100)}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-2 mt-4">
                <div className="flex justify-between items-end">
                    <span className="text-5xl font-black text-white tracking-tighter">
                        {downloadSpeed.toFixed(1)} Mbps
                    </span>
                    <span className="text-slate-500 text-sm font-medium pb-1">Download Speed</span>
                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(downloadSpeed / 100, 100)}%` }}
                    ></div>
                </div>
            </div>


            <p className="mt-4 text-[10px] text-slate-600 font-mono italic">
                Real-time feed from Golang binary via WebSockets
            </p>
        </div>
    );
}