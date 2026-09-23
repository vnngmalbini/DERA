"""Django storage backend that saves uploaded media straight to ImageKit.

Files are uploaded through ImageKit's upload API and the stored name is the
ImageKit file path (e.g. ``stories/photo_AbC123.jpeg``), so ``field.url``
resolves to the ImageKit CDN URL the frontend loads directly.
"""

import posixpath

import requests
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible

UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload'
FILES_API_URL = 'https://api.imagekit.io/v1/files'
TIMEOUT_SECONDS = 30


@deconstructible
class ImageKitStorage(Storage):
    def __init__(self, private_key=None, url_endpoint=None):
        self.private_key = private_key or settings.IMAGEKIT_PRIVATE_KEY
        self.url_endpoint = (url_endpoint or settings.IMAGEKIT_URL_ENDPOINT).rstrip('/')
        if not self.private_key or not self.url_endpoint:
            raise ImproperlyConfigured('IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT must be set.')

    @property
    def _auth(self):
        # ImageKit uses HTTP basic auth with the private key as the username.
        return (self.private_key, '')

    def _save(self, name, content):
        folder, file_name = posixpath.split(name.replace('\\', '/'))
        content.seek(0)
        response = requests.post(
            UPLOAD_URL,
            auth=self._auth,
            files={'file': (file_name, content)},
            data={
                'fileName': file_name,
                'folder': f'/{folder}' if folder else '/',
                'useUniqueFileName': 'true',
            },
            timeout=TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        return response.json()['filePath'].lstrip('/')

    def _find_file_id(self, name):
        folder, file_name = posixpath.split(name)
        response = requests.get(
            FILES_API_URL,
            auth=self._auth,
            params={'path': f'/{folder}' if folder else '/', 'searchQuery': f'name = "{file_name}"'},
            timeout=TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        for item in response.json():
            if item.get('filePath', '').lstrip('/') == name:
                return item['fileId']
        return None

    def delete(self, name):
        if not name:
            return
        file_id = self._find_file_id(name)
        if file_id:
            requests.delete(f'{FILES_API_URL}/{file_id}', auth=self._auth, timeout=TIMEOUT_SECONDS).raise_for_status()

    def exists(self, name):
        # ImageKit assigns unique file names on upload, so there is never a clash to avoid.
        return False

    def url(self, name):
        return f'{self.url_endpoint}/{name.lstrip("/")}'

    def size(self, name):
        raise NotImplementedError('ImageKitStorage does not report file sizes.')
