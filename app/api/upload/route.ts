import { put, del, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const uploaded = [];

        for (const file of files) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                continue; // Skip non-allowed file types
            }

            // Upload to Vercel Blob
            const blob = await put(`documents/${Date.now()}-${file.name}`, file, {
                access: 'public',
                addRandomSuffix: true,
            });

            // Auto-detect jurisdiction from filename
            const filenameLower = file.name.toLowerCase();
            let jurisdiction = null;
            if (filenameLower.includes('fl') || filenameLower.includes('florida') || filenameLower.includes('brevard')) {
                jurisdiction = 'FL';
            } else if (filenameLower.includes('tn') || filenameLower.includes('tennessee')) {
                jurisdiction = 'TN';
            } else if (filenameLower.includes('in') || filenameLower.includes('indiana')) {
                jurisdiction = 'IN';
            } else if (filenameLower.includes('co') || filenameLower.includes('colorado')) {
                jurisdiction = 'CO';
            }

            // Auto-detect file type from filename
            let fileType = 'OTHER';
            if (filenameLower.includes('complaint')) fileType = 'COMPLAINT';
            else if (filenameLower.includes('order')) fileType = 'ORDER';
            else if (filenameLower.includes('judgment') || filenameLower.includes('fj')) fileType = 'JUDGMENT';
            else if (filenameLower.includes('affidavit')) fileType = 'AFFIDAVIT';
            else if (filenameLower.includes('ltr') || filenameLower.includes('letter')) fileType = 'LETTER';
            else if (filenameLower.includes('notice')) fileType = 'NOTICE';

            uploaded.push({
                id: `f${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: file.name,
                url: blob.url,
                size: file.size,
                fileType,
                jurisdiction,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }

        return NextResponse.json({ files: uploaded });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
        }

        await del(url);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { blobs } = await list({ prefix: 'documents/' });
        return NextResponse.json({ files: blobs });
    } catch (error) {
        console.error('List error:', error);
        return NextResponse.json({ error: 'List failed' }, { status: 500 });
    }
}
