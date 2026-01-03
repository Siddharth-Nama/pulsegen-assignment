from rest_framework import generics, permissions, filters
from .models import Video
from .serializers import VideoSerializer
from users.permissions import IsEditor, IsViewer, IsAdmin

class VideoListCreateView(generics.ListCreateAPIView):
    serializer_class = VideoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']

    def get_permissions(self):
        if self.request.method == 'POST':
            # Editors and Admins can upload
            return [IsEditor()]
        # Viewers (and up) can list
        return [IsViewer()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Video.objects.none()
        if user.role == 'admin':
            return Video.objects.all()
        return Video.objects.filter(uploaded_by=user)

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
