from django.urls import path
from .views import VideoListCreateView, VideoDetailView, VideoStreamView

urlpatterns = [
    path('', VideoListCreateView.as_view(), name='video-list-create'),
    path('<uuid:pk>/', VideoDetailView.as_view(), name='video-detail'),
    path('<uuid:pk>/stream/', VideoStreamView.as_view(), name='video-stream'),
]
