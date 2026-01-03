import threading
import time
import random

def perform_sensitivity_analysis(video_instance):
    def analysis_task():
        video_instance.status = 'processing'
        video_instance.save()
        
        time.sleep(10)
        
        score = random.random()
        video_instance.sensitivity_score = score
        
        if score > 0.7:
            video_instance.status = 'flagged'
        else:
            video_instance.status = 'safe'
            
        video_instance.save()

    thread = threading.Thread(target=analysis_task)
    thread.start()
