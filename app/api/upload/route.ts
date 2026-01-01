import { put, del, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        console.log('Upload API called, files received:', files.length);

        if (!files || files.length === 0) {
            console.log('No files in request');
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const uploaded = [];

        for (const file of files) {
            console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

            // Accept all common document types
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain',
                'text/csv',
                'image/jpeg',
                'image/png',
                'image/gif',
                ''  // Some browsers don't set type
            ];

            // If file type is not recognized or empty, still allow it
            const isAllowed = allowedTypes.includes(file.type) || file.type === '' || !file.type;

            if (!isAllowed) {
                console.log('File type not allowed:', file.type);
                // Still add to uploaded list but mark as skipped
                uploaded.push({
                    id: `f${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    title: file.name,
                    url: null,
                    size: file.size,
                    fileType: 'OTHER',
                    jurisdiction: null,
                    error: 'File type not supported',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
                continue;
            }

            try {
                // Upload to Vercel Blob
                console.log('Uploading to Vercel Blob...');
                const blob = await put(`documents/${Date.now()}-${file.name}`, file, {
                    access: 'public',
                    addRandomSuffix: true,
                });
                console.log('Blob upload success:', blob.url);

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
            } catch (blobError) {
                console.error('Blob upload error for file:', file.name, blobError);
                // Return file info even if blob upload fails (for local storage fallback)
                uploaded.push({
                    id: `f${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    title: file.name,
                    url: null,
                    size: file.size,
                    fileType: 'OTHER',
                    jurisdiction: null,
                    error: 'Blob upload failed',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
            }
        }

        console.log('Upload complete, returning files:', uploaded.length);
        return NextResponse.json({ files: uploaded });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Upload failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
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
