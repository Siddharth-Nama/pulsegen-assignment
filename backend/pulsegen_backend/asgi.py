import os
from django.core.asgi import get_asgi_application
import socketio
from .sio import sio

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pulsegen_backend.settings')

django_app = get_asgi_application()
application = socketio.ASGIApp(sio, django_app)
