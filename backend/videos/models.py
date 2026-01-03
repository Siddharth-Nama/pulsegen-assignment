from django.db import models
from django.contrib.auth import get_user_model
import uuid
import os

User = get_user_model()

def video_file_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('uploads/videos/', filename)

class Video(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('safe', 'Safe'),
        ('flagged', 'Flagged'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to=video_file_path)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='videos')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Metadata
    size = models.BigIntegerField(default=0) # in bytes
    duration = models.FloatField(default=0.0) # in seconds
    
    # Analysis
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    sensitivity_score = models.FloatField(default=0.0) # 0 to 1

    def __str__(self):
        return self.title
