"""
Share Endpoint for BananaClock API.
Serves dynamic HTML tags for social media previews.
"""

from fastapi import APIRouter, Request, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
import logging

from app.config import get_settings
from app.utils.storage import upload_image

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()

DEFAULT_IMAGE = "https://your-frontend-url.vercel.app/logo.png"
SHARE_BUCKET = "share-images"


class ShareUploadResponse(BaseModel):
    url: str
    share_link: str


@router.post("/share/upload", response_model=ShareUploadResponse)
async def upload_share_card(file: UploadFile = File(...)):
    """
    Upload a generated share card image to Supabase.
    Returns the public URL and the constructure share link.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        content = await file.read()
        public_url = await upload_image(content, bucket_name=SHARE_BUCKET)
        
        if not public_url:
             raise HTTPException(status_code=500, detail="Failed to upload to storage")
        
        base_url = settings.backend_url
        # If running on localhost but requesting share link, try to use public URL from env
        if "localhost" in base_url:
            import os
            base_url = os.getenv("PUBLIC_BACKEND_URL", "https://your-backend-url.hf.space")
             
        return {
            "url": public_url,
            "share_link": f"{base_url}/share?img={public_url}"
        }
        
    except Exception as e:
        logger.error(f"Share upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@router.get("/share", response_class=HTMLResponse)
async def share_preview(
    request: Request,
    img: str = None,
    title: str = "BananaClock Result",
    desc: str = "Check out my banana analysis!",
):
    """
    Serve a dynamic HTML page with Open Graph tags.
    Redirects to the main app after loading.
    """
    # Use default image if none provided or if it's "undefined"
    default_img = "https://your-frontend-url.vercel.app/logo.png"
    image_url = img if img and img != "undefined" else default_img
    
    # Ensure title/desc are safe (basic check)
    safe_title = title[:100]
    safe_desc = desc[:200]
    
    target_url = "https://your-frontend-url.vercel.app"
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{target_url}">
        <meta property="og:title" content="{safe_title}">
        <meta property="og:description" content="{safe_desc}">
        <meta property="og:image" content="{image_url}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{target_url}">
        <meta name="twitter:title" content="{safe_title}">
        <meta name="twitter:description" content="{safe_desc}">
        <meta name="twitter:image" content="{image_url}">
        
        <title>{safe_title}</title>
        
        <!-- Redirect to main app -->
        <script>
            window.location.href = "{target_url}";
        </script>
        
        <style>
            body {{
                background-color: #111;
                color: #fff;
                font-family: system-ui, -apple-system, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
            }}
            .loader {{
                border: 4px solid #333;
                border-top: 4px solid #FBBF24;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            }}
            @keyframes spin {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}
        </style>
    </head>
    <body>
        <div class="loader"></div>
        <p>Redirecting to BananaClock...</p>
        <p style="font-size: 0.8em; opacity: 0.6; margin-top: 10px;">
            <a href="{target_url}" style="color: #FBBF24; text-decoration: none;">Click here if not redirected</a>
        </p>
    </body>
    </html>
    """
    return html_content
