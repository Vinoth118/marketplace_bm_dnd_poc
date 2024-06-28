import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    if(request.method != 'POST') {
        NextResponse.next();
        return ;
    }
    const formData = await request.formData();
    const token = formData.get('paymentResponse');
    return NextResponse.redirect(new URL(`/payment_status?token=${token}`, request.url), 303);
}

export const config = {
    matcher: '/payment_status',
}