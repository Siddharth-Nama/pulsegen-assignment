from rest_framework import generics, permissions, filters
from .models import Video
from .serializers import VideoSerializer
from users.permissions import IsEditor, IsViewer, IsAdmin
from .utils import perform_sensitivity_analysis

class VideoListCreateView(generics.ListCreateAPIView):
    serializer_class = VideoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsEditor()]
        return [IsViewer()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Video.objects.none()
        if user.role == 'admin':
            return Video.objects.all()
        return Video.objects.filter(uploaded_by=user)

    def perform_create(self, serializer):
        video = serializer.save(uploaded_by=self.request.user)
        perform_sensitivity_analysis(video)

class VideoDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = VideoSerializer
    
    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsEditor()]
        return [IsViewer()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Video.objects.none()
        if user.role == 'admin':
            return Video.objects.all()
        return Video.objects.filter(uploaded_by=user)
