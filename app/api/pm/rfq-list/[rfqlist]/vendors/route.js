import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  req,
  { params }
) {
  try {
    const {rfqlist} = await params;
    // 1️⃣ Auth
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    // 🔒 PM / Admin only
    if (![1, 2].includes(payload.roleId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // 2️⃣ Get assigned vendors for this RFQ
    const assignments = await prisma.rfqVendorAssignment.findMany({
      where: {
        rfqListId: rfqlist,
        isActive: true,
      },
      include: {
        vendorUser: {
          select: {
            Id: true,
            email: true,
          },
        },
      },
    });

    const assignedVendors = assignments.map(a => ({
      Id: a.vendorUser.Id,
      email: a.vendorUser.email,
    }));

    const assignedVendorIds = assignedVendors.map(v => v.Id);

    // 3️⃣ Get all vendors (Users with RoleId = Vendor)
    const vendors = await prisma.users.findMany({
      where: {
        RoleId: 4, // Vendor
        IsActive: true,
        Id: {
          notIn: assignedVendorIds, // 🚫 exclude already assigned
        },
      },
      select: {
        Id: true,
        FullName: true,
        email: true,
      },
      orderBy: {
        CreatedAt: "desc",
      },
    });

    return NextResponse.json(
      {
        vendors,
        assignedVendors,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch RFQ vendors error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req,
  { params }
) {
  try {
    const {rfqlist} = await params;
    // 1️⃣ Auth
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    // 🔒 PM / Admin only
    if (![1, 2].includes(payload.roleId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // const { rfqListId } = params;
    const { vendorIds } = await req.json();
    

    if (!Array.isArray(vendorIds) || vendorIds.length === 0) {
      return NextResponse.json(
        { error: "No vendors selected" },
        { status: 400 }
      );
    }

    // 2️⃣ Prevent duplicate assignments
    const existingAssignments = await prisma.rfqVendorAssignment.findMany({
      where: {
        rfqListId: rfqlist,
        vendorUserId: { in: vendorIds },
      },
      select: { vendorUserId: true },
    });

    const alreadyAssignedIds = new Set(
      existingAssignments.map(a => a.vendorUserId)
    );

    const newAssignments = vendorIds
      .filter(id => !alreadyAssignedIds.has(id))
      .map(id => ({
        rfqListId: rfqlist,
        vendorUserId: id,
        statusCode: 'NEW'
      }));

    if (newAssignments.length === 0) {
      return NextResponse.json(
        { message: "Vendors already assigned" },
        { status: 200 }
      );
    }
    
    await prisma.$transaction(async (tx) => {
      await tx.rfqVendorAssignment.createMany({
        data: newAssignments,
      });

      await tx.rfqList.update({
        where: { Id: rfqlist },
        data: {
          statusId: "VENDOR_ASSIGNED",
        },
      });
    });

    return NextResponse.json(
      { message: "Vendors assigned successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Assign vendors error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}