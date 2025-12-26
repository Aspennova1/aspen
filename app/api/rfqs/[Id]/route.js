import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  req,
  { params }
) {
  try {
    const {Id} = await params;
    
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.Id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // const rfq = await prisma.rfqs.findFirst({
    //   where: {
    //     Id: params.Id,
    //     createdByUserId: payload.Id, // 🔒 ownership check
    //   },
    // });

    if(Id && payload.Id){
        const rfq = await prisma.rfqs.findFirst({
            where: {
                AND: [
                { Id: Id },
                { createdByUserId: payload.Id },
                ],
            },
        });
        if (!rfq) {
          return NextResponse.json(
            { message: "RFQ not found" },
            { status: 404 }
          );
        }
    
        if (!rfq.isEditable) {
          return NextResponse.json(
            { message: "RFQ cannot be edited" },
            { status: 403 }
          );
        }
    
        return NextResponse.json({ rfq });
    }
    else{
        return NextResponse.json(
            { message: "Something went wrong..." },
            { status: 401 }
          );
    }

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req,
  { params }
) {
  try {
    const {Id} = await params;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.Id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();

    if(Id && payload.Id){
        const rfq = await prisma.rfqs.findFirst({
            where: {
                AND: [
                { Id: Id },
                { createdByUserId: payload.Id },
                ],
            },
        });
        // console.log(rfq, 'first rfq');
        
        if (!rfq) {
          return NextResponse.json({ message: "RFQ not found" }, { status: 404 });
        }
    
        if (!rfq.isEditable) {
          return NextResponse.json(
            { message: "RFQ cannot be edited" },
            { status: 403 }
          );
        }
    
        const updated = await prisma.rfqs.update({
          where: {
            Id,
            createdByUserId: payload.Id
            },
          data: {
            name: body.name,
            projectType: body.projectType,
            briefDescription: body.briefDescription,
            budgetRange: body.budgetRange,
            timeline: body.timeline,
            company: body.company,
          },
        });
    
        if (updated.count === 0) {
            throw new Error("RFQ not found or not editable");
        }
        // console.log(updated, 'updated');
        
        return NextResponse.json({ rfq: updated });
    }
    else{
        return NextResponse.json(
            { message: "Something went wrong..." },
            { status: 401 }
          );
    }

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}