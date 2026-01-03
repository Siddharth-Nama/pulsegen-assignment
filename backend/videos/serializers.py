from rest_framework import serializers
from .models import Video

class VideoSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')
    status = serializers.ReadOnlyField()
    sensitivity_score = serializers.ReadOnlyField()

    class Meta:
        model = Video
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'size', 'duration')

    def create(self, validated_data):
        file = validated_data.get('file')
        if file:
            validated_data['size'] = file.size
        return super().create(validated_data)
