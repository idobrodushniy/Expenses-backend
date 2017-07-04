from rest_framework.exceptions import APIException

class PartialContent(APIException):
    status_code = 206
    default_detail = "You can't create expenses for other users. By default it was set your username for 'owner' field!"
