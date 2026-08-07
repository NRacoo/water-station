import { getAllDevices, registerDevice } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {

        const body = await request.json();
        
        const name = body.name;
        const project = body.project;
        const location = body.location;
        
        if(!name || !project || !location) {
            return NextResponse.json({ success:false, message: "name and project must be fill"}, { status: 400 });
        };
        const device = await registerDevice({ name, project, location });
        return NextResponse.json({ success:true, message:"success create device", data:device }, { status: 201 })
    } catch (error) {
        return NextResponse.json({success: false, message: error}, { status: 500})
    }   
}


export async function GET(){
    try {
        const devices = await getAllDevices();
        return NextResponse.json({ success: true, message:"fetch success", data:devices})
    } catch (error) {
        return NextResponse.json({ success: false, message:"fetch device failed", error:error})
    }
}