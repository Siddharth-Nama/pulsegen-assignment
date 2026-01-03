import threading
import time
import random
from asgiref.sync import async_to_sync
from pulsegen_backend.sio import sio
from .models import Video

def run_analysis(video_id):
    try:
        # We are in a thread, so we can use sync DB calls directly
        video = Video.objects.get(id=video_id)
        
        video.status = 'processing'
        video.save()
        
        # Emit event using async_to_sync
        async_to_sync(sio.emit)('video_status', {'id': str(video.id), 'status': 'processing'})
        
        time.sleep(10)
        
        score = random.random()
        video.sensitivity_score = score
        
        if score > 0.7:
            video.status = 'flagged'
        else:
            video.status = 'safe'
            
        video.save()
        async_to_sync(sio.emit)('video_status', {'id': str(video.id), 'status': video.status})
        
    except Exception as e:
        print(f"Error in analysis task: {e}")

def perform_sensitivity_analysis(video_instance):
    thread = threading.Thread(target=run_analysis, args=(video_instance.id,))
    thread.start()
