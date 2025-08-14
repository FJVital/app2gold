// /api/purchase-webhook.js
// Handles Gumroad purchase webhooks and redirects customers to AI agent

export default async function handler(req, res) {
    console.log('Webhook received:', req.method, req.body);
    
    if (req.method === 'POST') {
        try {
            // Gumroad sends purchase data in the request body
            const purchaseData = req.body;
            
            // Log the purchase for debugging
            console.log('Purchase data received:', purchaseData);
            
            // Verify this is a valid purchase
            if (purchaseData && (purchaseData.seller_id || purchaseData.email)) {
                
                // Generate a simple access token for this purchase
                const accessToken = generateAccessToken();
                
                // Log successful purchase
                console.log('Valid purchase detected, redirecting customer');
                
                // Redirect customer to AI agent with access
                const redirectUrl = `https://app2gold.vercel.app/?access=true&token=${accessToken}`;
                
                // Return redirect response
                return res.status(200).json({
                    status: 'success',
                    redirect: redirectUrl,
                    message: 'Purchase verified, redirecting to AI agent'
                });
                
            } else {
                console.log('Invalid purchase data received');
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid purchase data'
                });
            }
            
        } catch (error) {
            console.error('Webhook processing error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
        
    } else if (req.method === 'GET') {
        // Handle GET requests (like when Gumroad tests the endpoint)
        console.log('GET request to webhook - responding OK');
        return res.status(200).json({
            status: 'ok',
            message: 'Webhook endpoint is active',
            timestamp: new Date().toISOString()
        });
        
    } else {
        return res.status(405).json({
            status: 'error',
            message: 'Method not allowed'
        });
    }
}

// Generate a simple access token
function generateAccessToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Configure for Vercel
export const config = {
    api: {
        bodyParser: {
            json: true,
        },
    },
}