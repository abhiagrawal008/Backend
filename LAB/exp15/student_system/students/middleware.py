import time

class SimpleLoggingMiddleware:
    def __init__(self, get_response):
        # Store the next middleware or Django's view handler.
        self.get_response = get_response

    def __call__(self, request):
        # This method receives the incoming HTTP request.
        start_time = time.perf_counter()

        print("Request:", request.method, request.path)

        # Pass the request forward and receive the HTTP response.
        response = self.get_response(request)

        # This code runs after the response comes back.
        duration = (time.perf_counter() - start_time) * 1000
        print("Response:", response.status_code)
        print("Time taken:", round(duration, 2), "ms")

        # Return the response to the previous middleware or client.
        return response
