import asyncio
import random
from asgiref.sync import sync_to_async
from pulsegen_backend.sio import sio
from .models import Video

@sync_to_async
def get_video(video_id):
    return Video.objects.get(id=video_id)

@sync_to_async
def save_video(video):
    video.save()

async def analysis_task(video_id):
    try:
        video = await get_video(video_id)
        
        video.status = 'processing'
        await save_video(video)
        await sio.emit('video_status', {'id': str(video.id), 'status': 'processing'})
        
        await asyncio.sleep(10)
        
        score = random.random()
        video.sensitivity_score = score
        
        if score > 0.7:
            video.status = 'flagged'
        else:
            video.status = 'safe'
            
        await save_video(video)
        await sio.emit('video_status', {'id': str(video.id), 'status': video.status})
        
    except Exception as e:
        print(f"Error in analysis task: {e}")

def perform_sensitivity_analysis(video_instance):
    sio.start_background_task(analysis_task, video_instance.id)
