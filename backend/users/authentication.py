from rest_framework_simplejwt.authentication import JWTAuthentication

class QueryParamsJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        token = request.query_params.get('token')
        if not token:
            return None
        
        validated_token = self.get_validated_token(token)
        return self.get_user(validated_token), validated_token
