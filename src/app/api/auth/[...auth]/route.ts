import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Base URL for the authentication API
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

// Helper function to forward requests to the auth API
async function forwardToAuthApi(
    req: NextRequest,
    endpoint: string,
    method: string = 'POST'
): Promise<NextResponse> {
    try {
        // Get request body if applicable
        let body = null;
        if (method !== 'GET' && method !== 'HEAD') {
            body = await req.json().catch(() => ({}));
        }

        // Extract headers we want to forward
        const headers: Record<string, string> = {};
        const forwardHeaders = ['content-type', 'authorization', 'user-agent'];

        forwardHeaders.forEach(header => {
            const value = req.headers.get(header);
            if (value) headers[header] = value;
        });

        // Add client IP address
        headers['x-forwarded-for'] = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';

        // Make request to the authentication API
        const response = await axios({
            method,
            url: `${API_BASE_URL}${endpoint}`,
            data: body,
            headers,
            validateStatus: () => true, // Don't throw on any status code
        });
        console.log("first,", response.data)
        // Create NextResponse with the same status and data from API
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error(`Error in auth API ${method} ${endpoint}:`, error);
        return NextResponse.json(
            { error: 'Authentication service unavailable' },
            { status: 503 }
        );
    }
}

// Route handlers for different auth endpoints
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ auth: string[] }> }
) {

    const authPath = (await params).auth.join('/');
    switch (authPath) {
        case 'login':
            return await forwardToAuthApi(req, '/api/login');
        case 'register':
            return await forwardToAuthApi(req, '/api/register');
        case 'logout':
            return await forwardToAuthApi(req, '/api/logout');
        case 'logout-all':
            return await forwardToAuthApi(req, '/api/logout-all');
        case 'refresh-token':
            return await forwardToAuthApi(req, '/api/refresh-token');
        case 'change-password':
            return await forwardToAuthApi(req, '/api/change-password', 'PUT');
        default:
            return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ auth: string[] }> }
) {

    const authPath = (await params).auth.join('/');

    switch (authPath) {
        case 'profile':
            return await forwardToAuthApi(req, '/api/profile', 'GET');
        case 'active-sessions':
            return await forwardToAuthApi(req, '/api/active-sessions', 'GET');
        default:
            return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ auth: string[] }> }
) {

    const authPath = (await params).auth.join('/');

    switch (authPath) {
        case 'profile':
            return await forwardToAuthApi(req, '/api/profile', 'PUT');
        default:
            return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ auth: string[] }> }
) {

    const authPath = (await params).auth.join('/');

    // Handle session revocation
    if (authPath.startsWith('sessions/')) {
        const sessionId = authPath.split('/')[1];
        return await forwardToAuthApi(req, `/api/sessions/${sessionId}`, 'DELETE');
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
}