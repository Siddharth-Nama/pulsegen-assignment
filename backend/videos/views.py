import os
from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from django.http import FileResponse
from .models import Video
from .serializers import VideoSerializer
from users.permissions import IsEditor, IsViewer, IsAdmin
from .utils import perform_sensitivity_analysis
from users.authentication import QueryParamsJWTAuthentication

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

class VideoStreamView(generics.RetrieveAPIView):
    serializer_class = VideoSerializer
    authentication_classes = [QueryParamsJWTAuthentication]
    
    def get_permissions(self):
        return [IsViewer()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Video.objects.none()
        if user.role == 'admin':
            return Video.objects.all()
        return Video.objects.filter(uploaded_by=user)

    def get(self, request, *args, **kwargs):
        video = self.get_object()
        path = video.file.path
        if not os.path.exists(path):
            return Response(status=status.HTTP_404_NOT_FOUND)
        return FileResponse(open(path, 'rb'))
