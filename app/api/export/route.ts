import { getAllEntries, summarize } from "@/lib/store";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx"

export const runtime = "nodejs"

export async function GET() {
    try {
        
        const entries = await getAllEntries();
        const summary = await summarize();
    
        const logSheet = XLSX.utils.json_to_sheet(
            entries.map((e) => ({
                ID:e.id,
                "Device ID": e.deviceId,
                "Name": e.device?.name ?? "-",
                Project:e.device?.project ?? "-",
                Counter: e.counter,
                Date: new Date(e.timestamp).toLocaleDateString("id-ID"),
                Time: new Date(e.timestamp).toLocaleTimeString("id-ID")
            }))
        );
    
        logSheet["!cols"] = [
            { wch: 6 },
            { wch: 38 },
            { wch: 20 },
            { wch: 16 },
            { wch: 10 },
            { wch: 14 },
            { wch: 10 }
        ]
    
        const deviceSheet = XLSX.utils.json_to_sheet(
            summary.devices.map((e) => ({
                "Device ID":e.id,
                Name:e.name,
                Project: e.project,
                "Fills Today":e.todayCount,
                Status: e.status === "online" ? "Online" : "Offline",
            }))
        )
    
        deviceSheet["!cols"] = [
            { wch: 38 },
            { wch: 24 },
            { wch: 20 },
            { wch: 16 },
            { wch: 10 }
        ]
    
        const weeklySheet = XLSX.utils.json_to_sheet(
            summary.weeklyUsage.map((e) => ({
                Hari: e.label,
                "Amount Fills": e.value
            }))
        );
    
        weeklySheet["!cols"] = [
            { wch: 16 },
            { wch: 10 }
        ]
    
        const workbook = XLSX.utils.book_new()
    
        XLSX.utils.book_append_sheet(workbook, logSheet, "Complete Log")
        XLSX.utils.book_append_sheet(workbook, deviceSheet, "Device Summary")
        XLSX.utils.book_append_sheet(workbook, weeklySheet, "Weekly Trends")
    
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        const today = new Date().toISOString().slice(0, 10);
        const filename = `water-station-log-${today}.xlsx`
    
        return new NextResponse(buffer, { status: 200, headers:{
            "Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet",
            "Content-Disposition":`attachment; filename="${filename}"`,
            "Content-Length": String(buffer.length)
        }})
    } catch (error) {
        return NextResponse.json({success: false, status:500, message: error})
    }

}