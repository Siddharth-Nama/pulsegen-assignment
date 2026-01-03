from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Video
from django.core.files.uploadedfile import SimpleUploadedFile
import io

User = get_user_model()

class VideoTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='editor', password='password', role='editor')
        self.client.force_authenticate(user=self.user)
        self.video_data = {
            'title': 'Test Video', 
            'description': 'Test Desc',
            'file': SimpleUploadedFile("video.mp4", b"file_content", content_type="video/mp4")
        }

    def test_upload_video(self):
        response = self.client.post('/api/videos/', self.video_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Video.objects.count(), 1)
        self.assertEqual(Video.objects.get().title, 'Test Video')

    def test_list_videos(self):
        Video.objects.create(
            title='V1', 
            file=SimpleUploadedFile("v1.mp4", b"content", content_type="video/mp4"), 
            uploaded_by=self.user
        )
        response = self.client.get('/api/videos/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_stream_video(self):
        video = Video.objects.create(
            title='V1', 
            file=SimpleUploadedFile("v1.mp4", b"content", content_type="video/mp4"), 
            uploaded_by=self.user
        )
        response = self.client.get(f'/api/videos/{video.id}/stream/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
