import os
import mimetypes
from django.http import StreamingHttpResponse
from wsgiref.util import FileWrapper

def range_re(bytes_range, range_header):
    if not range_header:
        return None, None
    unit, ranges = range_header.split('=')
    if unit != 'bytes':
        return None, None
    start_str, end_str = ranges.split('-')
    start = int(start_str) if start_str else 0
    end = int(end_str) if end_str else None
    return start, end

def get_streaming_response(path, request):
    range_header = request.META.get('HTTP_RANGE', '').strip()
    range_match = range_re(range_header, range_header)
    size = os.path.getsize(path)
    content_type, _ = mimetypes.guess_type(path)
    content_type = content_type or 'application/octet-stream'
    
    if range_header:
        start, end = range_match
        if end is None:
            end = size - 1
        
        length = end - start + 1
        
        def file_iterator(file_path, offset=0, length=None, chunk_size=8192):
            with open(file_path, "rb") as f:
                f.seek(offset, os.SEEK_SET)
                remaining = length
                while remaining > 0:
                    read_size = min(chunk_size, remaining)
                    data = f.read(read_size)
                    if not data:
                        break
                    remaining -= len(data)
                    yield data

        response = StreamingHttpResponse(
            file_iterator(path, offset=start, length=length),
            status=206,
            content_type=content_type
        )
        response['Content-Length'] = str(length)
        response['Content-Range'] = f'bytes {start}-{end}/{size}'
    else:
        response = StreamingHttpResponse(
            FileWrapper(open(path, 'rb')),
            content_type=content_type
        )
        response['Content-Length'] = str(size)
    
    response['Accept-Ranges'] = 'bytes'
    return response
