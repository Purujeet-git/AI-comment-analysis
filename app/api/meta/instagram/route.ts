import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getPages } from "@/lib/graph/pages";
import { getInstagramBusinessAccount } from "@/lib/graph/instagram";

export async function GET() {
    const session = await getServerSession(authOptions);

    if(!session?.accessToken){
        return NextResponse.json(
            {error:"Unauthorized"},
            {status:401}
        );
    }

    try{
        const pages = await getPages(session.accessToken);

        if(pages.data.length === 0){
            return NextResponse.json(
                {error:"No facebook Pages found"},
                {status:404}
            )
        }


        const page = pages.data[0];

        const instagram = await getInstagramBusinessAccount(
            page.id,
            page.access_token
        );

        return NextResponse.json({
            page,
            instagram,
        });
    }catch(error){
        console.error(error);

        return NextResponse.json(
            {error:"Failed to fetch Instagram account"},
            {status:500}
        );
    }
}